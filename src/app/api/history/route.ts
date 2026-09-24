import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type HistoryItem = {
  id: string;
  tool: string;
  title: string;
  summary: string;
  href: string;
  at: number;
};

function keyFor(deviceId: string) {
  const h = createHash("sha256").update(deviceId).digest("hex").slice(0, 24);
  return `calckit:history:${h}`;
}

function upstashOk() {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

async function upstash(cmd: (string | number)[]) {
  const res = await fetch(process.env.UPSTASH_REDIS_REST_URL!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cmd),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Upstash error");
  const json = (await res.json()) as { result?: unknown };
  return json.result;
}

function deviceId(req: NextRequest) {
  const h = req.headers.get("x-device-id") || "";
  if (!h || h.length < 8 || h.length > 80) return null;
  if (!/^[a-zA-Z0-9\-]+$/.test(h)) return null;
  return h;
}

export async function GET(req: NextRequest) {
  const id = deviceId(req);
  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing device id" }, { status: 400 });
  }
  if (!upstashOk()) {
    return NextResponse.json({
      ok: true,
      items: [],
      storage: "none",
      hint: "Set Upstash env for cloud history",
    });
  }
  try {
    const raw = (await upstash(["GET", keyFor(id)])) as string | null;
    const items = raw ? (JSON.parse(raw) as HistoryItem[]) : [];
    return NextResponse.json({ ok: true, items, storage: "upstash" });
  } catch {
    return NextResponse.json({ ok: false, error: "Read failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const id = deviceId(req);
  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing device id" }, { status: 400 });
  }
  if (!upstashOk()) {
    return NextResponse.json(
      {
        ok: false,
        error: "Cloud sync needs UPSTASH_REDIS_REST_URL + TOKEN",
      },
      { status: 503 }
    );
  }
  try {
    const body = await req.json();
    const items = Array.isArray(body?.items) ? body.items : [];
    const cleaned: HistoryItem[] = items.slice(0, 20).map((x: Partial<HistoryItem>) => ({
      id: String(x.id || Date.now()).slice(0, 40),
      tool: String(x.tool || "").slice(0, 40),
      title: String(x.title || "").slice(0, 80),
      summary: String(x.summary || "").slice(0, 160),
      href: String(x.href || "/").slice(0, 120),
      at: Number(x.at) || Date.now(),
    }));
    await upstash(["SET", keyFor(id), JSON.stringify(cleaned)]);
    return NextResponse.json({ ok: true, count: cleaned.length });
  } catch {
    return NextResponse.json({ ok: false, error: "Write failed" }, { status: 500 });
  }
}
