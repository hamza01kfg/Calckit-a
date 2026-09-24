"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { TOOLS } from "@/lib/toolsList";
import { useLang } from "@/components/LanguageProvider";

export default function HomePage() {
  const { t } = useLang();
  const [q, setQ] = useState("");

  const tools = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return TOOLS;
    return TOOLS.filter(
      (x) =>
        x.title.toLowerCase().includes(s) ||
        x.desc.toLowerCase().includes(s) ||
        x.tag.toLowerCase().includes(s)
    );
  }, [q]);

  return (
    <div className="wrap">
      <section className="hero">
        <div className="kicker">{t("freeSuite")}</div>
        <h1>
          {t("heroTitle1")}
          <br />
          {t("heroTitle2")}
        </h1>
        <p className="sub">{t("heroSub")}</p>
        <div className="search">
          <input
            type="search"
            placeholder={t("searchPlaceholder")}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <p className="meta" style={{ marginTop: 14, fontSize: 12 }}>
          {t("heroTip")}
        </p>
      </section>

      <h2 id="tools" className="section-title">
        {t("allTools")}
      </h2>
      <div className="grid" id="finance">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href} className="card">
            <div className="icon icon-img-wrap">
              <img
                src={tool.iconSrc}
                alt=""
                width={40}
                height={40}
                className="tool-icon-img"
                loading="lazy"
              />
            </div>
            <h3>{tool.title}</h3>
            <p>{tool.desc}</p>
            <span className="tag">{tool.tag}</span>
          </Link>
        ))}
      </div>
      {tools.length === 0 && <p className="meta">{t("noTools")}</p>}
    </div>
  );
}
