import { NextRequest, NextResponse } from "next/server";
import { trackPath, getTraffic } from "@/lib/trafficStore";

export const dynamic = "force-dynamic";

function checkAdmin(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET || "";
  if (!secret) return false;
  const header = req.headers.get("x-admin-secret") || "";
  const urlSecret = req.nextUrl.searchParams.get("secret") || "";
  return header === secret || urlSecret === secret;
}

/** POST — public soft track (no PII) */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const path =
      typeof body.path === "string" ? body.path : "/";
    // ignore admin + api
    if (path.startsWith("/admin") || path.startsWith("/api")) {
      return NextResponse.json({ ok: true, skipped: true });
    }
    await trackPath(path);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // never break UX
  }
}

/** GET — admin traffic */
export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const data = await getTraffic();
  return NextResponse.json({ ok: true, ...data });
}
