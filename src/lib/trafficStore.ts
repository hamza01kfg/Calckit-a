import { promises as fs } from "fs";
import path from "path";

const KEY = "calckit:traffic";
let memory: Record<string, number> = {};

function upstashConfigured() {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
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
  if (!res.ok) throw new Error(`Upstash ${res.status}`);
  const json = (await res.json()) as { result?: unknown };
  return json.result;
}

function filePath() {
  return path.join(process.cwd(), "data", "traffic.json");
}

async function readMap(): Promise<Record<string, number>> {
  if (upstashConfigured()) {
    const raw = (await upstashCmd(["GET", KEY])) as string | null;
    if (!raw) return {};
    try {
      return JSON.parse(raw) as Record<string, number>;
    } catch {
      return {};
    }
  }
  if (process.env.NETLIFY || process.env.VERCEL) return { ...memory };
  try {
    const raw = await fs.readFile(filePath(), "utf8");
    return JSON.parse(raw) as Record<string, number>;
  } catch {
    return {};
  }
}

async function writeMap(map: Record<string, number>) {
  if (upstashConfigured()) {
    await upstashCmd(["SET", KEY, JSON.stringify(map)]);
    return;
  }
  if (process.env.NETLIFY || process.env.VERCEL) {
    memory = map;
    return;
  }
  await fs.mkdir(path.dirname(filePath()), { recursive: true });
  await fs.writeFile(filePath(), JSON.stringify(map), "utf8");
}

export async function trackPath(pathname: string) {
  const clean = (pathname || "/").slice(0, 120);
  const map = await readMap();
  map[clean] = (map[clean] || 0) + 1;
  map["__total__"] = (map["__total__"] || 0) + 1;
  await writeMap(map);
}

export async function getTraffic() {
  const map = await readMap();
  const total = map["__total__"] || 0;
  const pages = Object.entries(map)
    .filter(([k]) => k !== "__total__")
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 50);
  return { total, pages };
}
