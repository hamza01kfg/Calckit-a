import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BLOG_POSTS } from "@/lib/blogPosts";
import { getPost, listAllPosts } from "@/lib/blogStore";
import { ALL_TOOLS } from "@/lib/toolsList";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

function toolIcon(href: string) {
  return ALL_TOOLS.find((t) => t.href === href)?.iconSrc || "";
}

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
  const headIcon = toolIcon(post.toolHref);

  return (
    <div className="wrap tool-page">
      <div className="tool-head">
        <p className="meta" style={{ marginBottom: 8 }}>
          <Link href="/blog">Blog</Link> · {post.toolName}
        </p>
        {headIcon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={headIcon}
            alt=""
            width={48}
            height={48}
            className="tool-icon-img"
            style={{ marginBottom: 12 }}
          />
        ) : null}
        <h1>{post.title}</h1>
        <p>{post.desc}</p>
      </div>
      <div className="panel seo-prose" style={{ maxWidth: 720 }}>
        {post.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
        {post.toolHref && post.toolHref !== "/" ? (
          <p style={{ marginTop: 24 }}>
            <Link
              href={post.toolHref}
              className="primary"
              style={{ display: "inline-block", padding: "10px 16px" }}
            >
              Open {post.toolName} →
            </Link>
          </p>
        ) : null}
      </div>
      {others.length ? (
        <div style={{ marginTop: 32 }}>
          <h2>More guides</h2>
          <div className="grid">
            {others.map((p) => {
              const src = toolIcon(p.toolHref);
              return (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="card">
                  <div className="icon icon-img-wrap">
                    {src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={src}
                        alt=""
                        width={40}
                        height={40}
                        className="tool-icon-img"
                        loading="lazy"
                      />
                    ) : (
                      <span style={{ fontSize: 28 }}>{p.icon}</span>
                    )}
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
