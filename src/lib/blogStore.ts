import { promises as fs } from "fs";
import path from "path";
import type { BlogPost } from "./blogPosts";
import { BLOG_POSTS } from "./blogPosts";

const KEY = "calckit:blog";
let memoryPosts: BlogPost[] = [];

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
  return path.join(process.cwd(), "data", "blog.json");
}

async function readDynamic(): Promise<BlogPost[]> {
  if (upstashConfigured()) {
    const raw = (await upstashCmd(["GET", KEY])) as string | null;
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as BlogPost[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  if (process.env.NETLIFY || process.env.VERCEL) {
    return [...memoryPosts];
  }
  try {
    const raw = await fs.readFile(filePath(), "utf8");
    const parsed = JSON.parse(raw) as { posts?: BlogPost[] };
    return Array.isArray(parsed.posts) ? parsed.posts : [];
  } catch {
    return [];
  }
}

async function writeDynamic(posts: BlogPost[]) {
  if (upstashConfigured()) {
    await upstashCmd(["SET", KEY, JSON.stringify(posts)]);
    return;
  }
  if (process.env.NETLIFY || process.env.VERCEL) {
    memoryPosts = posts;
    return;
  }
  await fs.mkdir(path.dirname(filePath()), { recursive: true });
  await fs.writeFile(filePath(), JSON.stringify({ posts }, null, 2), "utf8");
}

export async function listAllPosts(): Promise<BlogPost[]> {
  const dyn = await readDynamic();
  const bySlug = new Map<string, BlogPost>();
  for (const p of BLOG_POSTS) bySlug.set(p.slug, p);
  for (const p of dyn) bySlug.set(p.slug, p); // dynamic overrides static
  return Array.from(bySlug.values());
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  const all = await listAllPosts();
  return all.find((p) => p.slug === slug) || null;
}

export async function listDynamicPosts(): Promise<BlogPost[]> {
  return readDynamic();
}

export async function savePost(post: BlogPost): Promise<BlogPost> {
  const posts = await readDynamic();
  const i = posts.findIndex((p) => p.slug === post.slug);
  if (i >= 0) posts[i] = post;
  else posts.unshift(post);
  await writeDynamic(posts);
  return post;
}

export async function deletePost(slug: string): Promise<boolean> {
  const posts = await readDynamic();
  const next = posts.filter((p) => p.slug !== slug);
  if (next.length === posts.length) return false;
  await writeDynamic(next);
  return true;
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || `post-${Date.now()}`;
}
