import { NextRequest, NextResponse } from "next/server";
import {
  listDynamicPosts,
  listAllPosts,
  savePost,
  deletePost,
  slugify,
} from "@/lib/blogStore";
import type { BlogPost } from "@/lib/blogPosts";

export const dynamic = "force-dynamic";

function checkAdmin(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET || "";
  if (!secret) return false;
  const header = req.headers.get("x-admin-secret") || "";
  const urlSecret = req.nextUrl.searchParams.get("secret") || "";
  return header === secret || urlSecret === secret;
}

export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const dynamic = await listDynamicPosts();
  const all = await listAllPosts();
  return NextResponse.json({ ok: true, dynamic, all });
}

export async function POST(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const title = String(body.title || "").trim().slice(0, 120);
    if (!title) {
      return NextResponse.json({ ok: false, error: "title required" }, { status: 400 });
    }
    const slug =
      String(body.slug || "").trim().slice(0, 80) || slugify(title);
    const bodyLines = Array.isArray(body.body)
      ? body.body.map((x: unknown) => String(x).slice(0, 2000)).slice(0, 40)
      : String(body.bodyText || "")
          .split(/\n\n+/)
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 40);
    const post: BlogPost = {
      slug,
      title,
      desc: String(body.desc || "").trim().slice(0, 200),
      icon: String(body.icon || "📝").slice(0, 8),
      toolHref: String(body.toolHref || "/").slice(0, 40),
      toolName: String(body.toolName || "General").slice(0, 40),
      body: bodyLines.length ? bodyLines : ["Content coming soon."],
    };
    const saved = await savePost(post);
    return NextResponse.json({ ok: true, post: saved });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const slug = req.nextUrl.searchParams.get("slug") || "";
  if (!slug) {
    return NextResponse.json({ ok: false, error: "slug required" }, { status: 400 });
  }
  const ok = await deletePost(slug);
  return NextResponse.json({ ok, deleted: ok });
}
