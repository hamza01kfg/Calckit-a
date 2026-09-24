import Link from "next/link";
import { listAllPosts } from "@/lib/blogStore";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await listAllPosts();
  return (
    <div className="wrap tool-page">
      <div className="tool-head">
        <h1>Blog</h1>
        <p>Guides for every CalcKit tool — formulas, tips, and practical examples.</p>
      </div>
      <div className="grid">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="card">
            <div className="icon">{p.icon}</div>
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
            <span className="tag">{p.toolName}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
