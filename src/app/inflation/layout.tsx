import type { Metadata } from "next";
import { meta, PAGE_SEO } from "@/lib/seo";

const s = PAGE_SEO["inflation"];
export const metadata: Metadata = meta(s.title, s.description, s.path, s.keywords);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
