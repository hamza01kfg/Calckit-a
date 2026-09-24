import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BLOG_POSTS } from "@/lib/blogPosts";
import { getPost, listAllPosts } from "@/lib/blogStore";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Blog | CalcKit" };
  return {
    title: `${post.title} | CalcKit Blog`,
    description: post.desc,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const others = (await listAllPosts()).filter((p) => p.slug !== slug).slice(0, 4);

  return (
    <div className="wrap tool-page">
      <div className="tool-head">
        <p className="meta" style={{ marginBottom: 8 }}>
          <Link href="/blog">Blog</Link> · {post.toolName}
        </p>
        <h1>{post.title}</h1>
        <p>{post.desc}</p>
      </div>
      <div className="panel seo-prose" style={{ maxWidth: 720 }}>
        {post.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
        {post.toolHref && post.toolHref !== "/" ? (
          <p style={{ marginTop: 24 }}>
            <Link href={post.toolHref} className="primary" style={{ display: "inline-block", padding: "10px 16px" }}>
              Open {post.toolName} →
            </Link>
          </p>
        ) : null}
      </div>
      {others.length ? (
        <div style={{ marginTop: 32 }}>
          <h2>More guides</h2>
          <div className="grid">
            {others.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="card">
                <div className="icon">{p.icon}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
