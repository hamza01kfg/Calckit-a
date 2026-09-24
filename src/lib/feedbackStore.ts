import { promises as fs } from "fs";
import path from "path";
import type { FeedbackPayload } from "./validation";

export type FeedbackRecord = FeedbackPayload & {
  id: string;
  ipHash?: string;
  reply?: string;
  repliedAt?: number;
};

export type ToolStats = {
  toolId: string;
  up: number;
  down: number;
  total: number;
  notes: string[];
};

export type StorageBackend = "upstash" | "file" | "memory";

type StoreFile = { items: FeedbackRecord[] };

const KEY = "calckit:feedback";
const MAX_ITEMS = 5000;

/** In-memory fallback (serverless without Upstash — process lifetime only) */
let memoryItems: FeedbackRecord[] = [];

function upstashConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

export function getStorageBackend(): StorageBackend {
  if (upstashConfigured()) return "upstash";
  // Netlify / Vercel serverless: filesystem is read-only or ephemeral
  if (process.env.NETLIFY || process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return "memory";
  }
  return "file";
}

function storePath() {
  return path.join(process.cwd(), "data", "feedback.json");
}

async function upstashCmd(command: (string | number)[]): Promise<unknown> {
  const url = process.env.UPSTASH_REDIS_REST_URL!;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Upstash ${res.status}: ${text.slice(0, 200)}`);
  }
  const json = (await res.json()) as { result?: unknown };
  return json.result;
}

async function readAll(): Promise<FeedbackRecord[]> {
  const backend = getStorageBackend();

  if (backend === "upstash") {
    // List is newest-first (LPUSH)
    const raw = (await upstashCmd(["LRANGE", KEY, 0, MAX_ITEMS - 1])) as
      | string[]
      | null;
    if (!raw || !Array.isArray(raw)) return [];
    const items: FeedbackRecord[] = [];
    for (const row of raw) {
      try {
        items.push(JSON.parse(row) as FeedbackRecord);
      } catch {
        /* skip bad row */
      }
    }
    return items;
  }

  if (backend === "memory") {
    return [...memoryItems];
  }

  try {
    const raw = await fs.readFile(storePath(), "utf8");
    const parsed = JSON.parse(raw) as StoreFile;
    if (!parsed || !Array.isArray(parsed.items)) return [];
    return parsed.items;
  } catch {
    return [];
  }
}

async function writeFileItems(items: FeedbackRecord[]) {
  const dir = path.dirname(storePath());
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(
    storePath(),
    JSON.stringify({ items }, null, 2),
    "utf8"
  );
}

export async function addFeedback(
  payload: FeedbackPayload,
  ipHash?: string
): Promise<FeedbackRecord> {
  const rec: FeedbackRecord = {
    ...payload,
    id: `${payload.ts}-${Math.random().toString(36).slice(2, 9)}`,
    ipHash,
  };

  const backend = getStorageBackend();

  if (backend === "upstash") {
    // Optional soft rate-limit: same IP + tool within 45s
    if (ipHash) {
      const recent = (await upstashCmd(["LRANGE", KEY, 0, 30])) as string[] | null;
      if (recent) {
        for (const row of recent) {
          try {
            const prev = JSON.parse(row) as FeedbackRecord;
            if (
              prev.ipHash === ipHash &&
              prev.toolId === rec.toolId &&
              rec.ts - prev.ts < 45_000
            ) {
              // Update last vote instead of flooding
              return prev;
            }
          } catch {
            /* skip */
          }
        }
      }
    }
    await upstashCmd(["LPUSH", KEY, JSON.stringify(rec)]);
    await upstashCmd(["LTRIM", KEY, 0, MAX_ITEMS - 1]);
    return rec;
  }

  if (backend === "memory") {
    if (ipHash) {
      const dup = memoryItems.find(
        (p) =>
          p.ipHash === ipHash &&
          p.toolId === rec.toolId &&
          rec.ts - p.ts < 45_000
      );
      if (dup) return dup;
    }
    memoryItems.push(rec);
    if (memoryItems.length > MAX_ITEMS) {
      memoryItems = memoryItems.slice(-MAX_ITEMS);
    }
    return rec;
  }

  // file
  const items = await readAll();
  if (ipHash) {
    const dup = items
      .slice(-40)
      .reverse()
      .find(
        (p) =>
          p.ipHash === ipHash &&
          p.toolId === rec.toolId &&
          rec.ts - p.ts < 45_000
      );
    if (dup) return dup;
  }
  items.push(rec);
  const trimmed = items.length > MAX_ITEMS ? items.slice(-MAX_ITEMS) : items;
  await writeFileItems(trimmed);
  return rec;
}

export async function listFeedback(limit = 200): Promise<FeedbackRecord[]> {
  const items = await readAll();
  // Upstash list is newest-first; file/memory is oldest-first
  if (getStorageBackend() === "upstash") {
    return items.slice(0, limit);
  }
  return items.slice(-limit).reverse();
}

export async function aggregateByTool(): Promise<ToolStats[]> {
  const items = await readAll();
  const map = new Map<string, ToolStats>();
  for (const item of items) {
    let s = map.get(item.toolId);
    if (!s) {
      s = { toolId: item.toolId, up: 0, down: 0, total: 0, notes: [] };
      map.set(item.toolId, s);
    }
    if (item.vote === "up") s.up += 1;
    else s.down += 1;
    s.total += 1;
    if (item.note && s.notes.length < 20) s.notes.push(item.note);
  }
  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

export function storageStatus(): {
  backend: StorageBackend;
  netlifySafe: boolean;
  hint: string;
} {
  const backend = getStorageBackend();
  if (backend === "upstash") {
    return {
      backend,
      netlifySafe: true,
      hint: "Upstash Redis — durable on Netlify / Vercel",
    };
  }
  if (backend === "file") {
    return {
      backend,
      netlifySafe: false,
      hint: "Local file data/feedback.json — fine for npm run dev",
    };
  }
  return {
    backend,
    netlifySafe: false,
    hint:
      "In-memory only on serverless. Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN for durable votes.",
  };
}


export async function setFeedbackReply(id: string, reply: string): Promise<FeedbackRecord | null> {
  const items = await readAll();
  const i = items.findIndex((x) => x.id === id);
  if (i < 0) return null;
  items[i] = { ...items[i], reply: reply.slice(0, 1000), repliedAt: Date.now() };
  const backend = getStorageBackend();
  if (backend === "upstash") {
    // rewrite list (simple approach)
    await upstashCmd(["DEL", KEY]);
    for (const row of items.slice().reverse()) {
      await upstashCmd(["LPUSH", KEY, JSON.stringify(row)]);
    }
  } else if (backend === "memory") {
    memoryItems = items;
  } else {
    await fs.mkdir(path.dirname(storePath()), { recursive: true });
    await fs.writeFile(storePath(), JSON.stringify({ items }, null, 2), "utf8");
  }
  return items[i];
}
