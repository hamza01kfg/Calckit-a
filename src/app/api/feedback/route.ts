import { NextRequest, NextResponse } from "next/server";
import { parseFeedback } from "@/lib/validation";
import {
  addFeedback,
  aggregateByTool,
  listFeedback,
  storageStatus,
  setFeedbackReply,
} from "@/lib/feedbackStore";
import { createHash } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function checkAdmin(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET || "calckit-admin-change-me";
  const header = req.headers.get("x-admin-secret") || "";
  const urlSecret = req.nextUrl.searchParams.get("secret") || "";
  return header === secret || urlSecret === secret;
}

function ipHash(req: NextRequest): string | undefined {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "";
  if (!ip) return undefined;
  return createHash("sha256")
    .update(ip + (process.env.ADMIN_SECRET || "calckit-salt"))
    .digest("hex")
    .slice(0, 16);
}

/** POST — public: save a vote */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = parseFeedback(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
    }
    const rec = await addFeedback(parsed.data, ipHash(req));
    return NextResponse.json({
      ok: true,
      id: rec.id,
      storage: storageStatus().backend,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

/** GET — admin only: list + aggregate + storage status */
export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const [items, stats] = await Promise.all([
      listFeedback(300),
      aggregateByTool(),
    ]);
    return NextResponse.json({
      ok: true,
      storage: storageStatus(),
      stats,
      items,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}


/** PATCH — admin: reply to feedback */
export async function PATCH(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const id = typeof body.id === "string" ? body.id : "";
    const reply = typeof body.reply === "string" ? body.reply.trim() : "";
    if (!id || !reply) {
      return NextResponse.json({ ok: false, error: "id and reply required" }, { status: 400 });
    }
    const rec = await setFeedbackReply(id, reply);
    if (!rec) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, item: rec });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
