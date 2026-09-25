import type { MetadataRoute } from "next";
import { PAGE_SEO } from "@/lib/seo";
import { BLOG_POSTS } from "@/lib/blogPosts";

const site = "https://calckit.koderg.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["/", "/blog"];
  const fromSeo = Object.values(PAGE_SEO).map((p) => p.path);
  const blogs = BLOG_POSTS.map((p) => `/blog/${p.slug}`);
  const paths = Array.from(new Set([...staticPaths, ...fromSeo, ...blogs]));

  return paths.map((path) => ({
    url: `${site}${path === "/" ? "" : path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/blog") ? 0.65 : 0.8,
  }));
}
