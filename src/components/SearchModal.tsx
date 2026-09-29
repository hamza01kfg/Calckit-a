"use client";

import { UiIcon, ToolIcon } from "./Icon";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TOOLS } from "@/lib/toolsList";

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return TOOLS;
    return TOOLS.filter(
      (t) =>
        t.title.toLowerCase().includes(s) ||
        t.desc.toLowerCase().includes(s) ||
        t.tag.toLowerCase().includes(s)
    );
  }, [q]);

  const go = (href: string) => {
    setOpen(false);
    setQ("");
    router.push(href);
  };

  if (!open) {
    return (
      <button
        type="button"
        className="search-trigger ghost"
        onClick={() => setOpen(true)}
        title="Search (Ctrl+K)"
      >
        <UiIcon name="search" size={16} />
      </button>
    );
  }

  return (
    <div className="search-overlay" onClick={() => setOpen(false)}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          type="search"
          placeholder="Search calculators… EMI, SIP, BMI"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && filtered[0]) go(filtered[0].href);
          }}
        />
        <div className="search-results">
          {filtered.length === 0 && <p className="meta">No tools found</p>}
          {filtered.map((t) => (
            <button key={t.href} type="button" className="search-item" onClick={() => go(t.href)}>
              <span className="icon icon-img-wrap"><ToolIcon src={t.iconSrc} size={28} /></span>
              <span>
                <strong>{t.title}</strong>
                <small>{t.desc}</small>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
