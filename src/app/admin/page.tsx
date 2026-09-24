"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { TOOLS } from "@/lib/toolsList";

type Tab = "dashboard" | "feedback" | "blog" | "traffic" | "tools";

type ToolStats = {
  toolId: string;
  up: number;
  down: number;
  total: number;
  notes: string[];
};

type FbItem = {
  id: string;
  toolId: string;
  vote: "up" | "down";
  note: string;
  ts: number;
  reply?: string;
};

type BlogPost = {
  slug: string;
  title: string;
  desc: string;
  icon: string;
  toolHref: string;
  toolName: string;
  body: string[];
};

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState<ToolStats[]>([]);
  const [items, setItems] = useState<FbItem[]>([]);
  const [storage, setStorage] = useState("");
  const [traffic, setTraffic] = useState<{ total: number; pages: { path: string; views: number }[] } | null>(null);
  const [blogDyn, setBlogDyn] = useState<BlogPost[]>([]);
  const [blogAll, setBlogAll] = useState<BlogPost[]>([]);

  const [replyId, setReplyId] = useState("");
  const [replyText, setReplyText] = useState("");

  const [bTitle, setBTitle] = useState("");
  const [bSlug, setBSlug] = useState("");
  const [bDesc, setBDesc] = useState("");
  const [bBody, setBBody] = useState("");
  const [bTool, setBTool] = useState("/");
  const [bToolName, setBToolName] = useState("General");

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      "x-admin-secret": secret,
    }),
    [secret]
  );

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [fb, tr, bl] = await Promise.all([
        fetch(`/api/feedback?secret=${encodeURIComponent(secret)}`, {
          headers: { "x-admin-secret": secret },
          cache: "no-store",
        }).then((r) => r.json()),
        fetch(`/api/traffic?secret=${encodeURIComponent(secret)}`, {
          headers: { "x-admin-secret": secret },
          cache: "no-store",
        }).then((r) => r.json()),
        fetch(`/api/admin/blog?secret=${encodeURIComponent(secret)}`, {
          headers: { "x-admin-secret": secret },
          cache: "no-store",
        }).then((r) => r.json()),
      ]);

      if (!fb.ok) {
        setError(fb.error || "Unauthorized — Netlify pe ADMIN_SECRET set karein");
        setAuthed(false);
        return;
      }
      setAuthed(true);
      setStats(fb.stats || []);
      setItems(fb.items || []);
      setStorage(fb.storage?.backend || "");
      if (tr.ok) setTraffic({ total: tr.total || 0, pages: tr.pages || [] });
      if (bl.ok) {
        setBlogDyn(bl.dynamic || []);
        setBlogAll(bl.all || []);
      }
    } catch {
      setError("Network error");
      setAuthed(false);
    } finally {
      setLoading(false);
    }
  }, [secret]);

  const sendReply = async () => {
    if (!replyId || !replyText.trim()) return;
    const res = await fetch("/api/feedback", {
      method: "PATCH",
      headers,
      body: JSON.stringify({ id: replyId, reply: replyText.trim() }),
    });
    const data = await res.json();
    if (!data.ok) {
      setError(data.error || "Reply failed");
      return;
    }
    setReplyText("");
    setReplyId("");
    await loadAll();
  };

  const saveBlog = async () => {
    const res = await fetch("/api/admin/blog", {
      method: "POST",
      headers,
      body: JSON.stringify({
        title: bTitle,
        slug: bSlug || undefined,
        desc: bDesc,
        bodyText: bBody,
        toolHref: bTool,
        toolName: bToolName,
        icon: "📝",
      }),
    });
    const data = await res.json();
    if (!data.ok) {
      setError(data.error || "Save failed");
      return;
    }
    setBTitle("");
    setBSlug("");
    setBDesc("");
    setBBody("");
    await loadAll();
  };

  const removeBlog = async (slug: string) => {
    if (!confirm(`Delete post ${slug}?`)) return;
    await fetch(`/api/admin/blog?slug=${encodeURIComponent(slug)}`, {
      method: "DELETE",
      headers: { "x-admin-secret": secret },
    });
    await loadAll();
  };

  const totalVotes = stats.reduce((n, s) => n + s.total, 0);
  const toolMap = useMemo(() => {
    const m = new Map(stats.map((s) => [s.toolId, s]));
    return TOOLS.map((t) => {
      const id = t.href.replace(/^\//, "");
      const s = m.get(id) || m.get(t.href);
      return {
        ...t,
        up: s?.up || 0,
        down: s?.down || 0,
        total: s?.total || 0,
      };
    }).sort((a, b) => b.total - a.total);
  }, [stats]);

  return (
    <div className="wrap tool-page" style={{ maxWidth: 960 }}>
      <div className="tool-head">
        <h1>CalcKit Admin</h1>
        <p>
          Blog, feedback replies, tools analyzer, traffic. Password = Netlify env{" "}
          <code>ADMIN_SECRET</code>. Durable data: Upstash Redis (recommended).
        </p>
      </div>

      <div className="panel" style={{ marginBottom: 16 }}>
        <label>Admin password</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="ADMIN_SECRET"
            style={{ flex: 1, minWidth: 180 }}
          />
          <button type="button" className="primary" disabled={loading || !secret} onClick={() => void loadAll()}>
            {loading ? "Loading…" : authed ? "Refresh" : "Login"}
          </button>
          <Link href="/" className="ghost" style={{ padding: "10px 14px" }}>
            ← Site
          </Link>
        </div>
        {error ? (
          <p className="meta" style={{ color: "var(--warn)", marginTop: 10 }}>
            {error}
          </p>
        ) : null}
        {authed ? (
          <p className="meta" style={{ marginTop: 8 }}>
            Storage: <strong>{storage || "—"}</strong>
            {storage === "memory" ? " (Netlify pe restart pe data wipe — Upstash lagao)" : ""}
          </p>
        ) : null}
      </div>

      {authed ? (
        <>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {(
              [
                ["dashboard", "Dashboard"],
                ["tools", "Tools analyzer"],
                ["traffic", "Traffic"],
                ["feedback", "Feedback / Reply"],
                ["blog", "Blog"],
              ] as [Tab, string][]
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={tab === id ? "primary" : "ghost"}
                onClick={() => setTab(id)}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "dashboard" && (
            <div className="panel">
              <h2>Overview</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12 }}>
                <div className="panel" style={{ margin: 0 }}>
                  <div className="meta">Tools</div>
                  <strong style={{ fontSize: 24 }}>{TOOLS.length}</strong>
                </div>
                <div className="panel" style={{ margin: 0 }}>
                  <div className="meta">Feedback votes</div>
                  <strong style={{ fontSize: 24 }}>{totalVotes}</strong>
                </div>
                <div className="panel" style={{ margin: 0 }}>
                  <div className="meta">Tracked views</div>
                  <strong style={{ fontSize: 24 }}>{traffic?.total ?? "—"}</strong>
                </div>
                <div className="panel" style={{ margin: 0 }}>
                  <div className="meta">Blog posts</div>
                  <strong style={{ fontSize: 24 }}>{blogAll.length}</strong>
                </div>
              </div>
              <p className="meta" style={{ marginTop: 16 }}>
                Live Netlify Analytics / GA4 alag se dashboard pe dekho. Yahan in-app counter hai (Upstash se durable).
              </p>
            </div>
          )}

          {tab === "tools" && (
            <div className="panel">
              <h2>Tools analyzer</h2>
              <p className="meta">Votes se ranking — zyada feedback = zyada use signal.</p>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ textAlign: "left", borderBottom: "1px solid var(--line)" }}>
                      <th style={{ padding: 8 }}>Tool</th>
                      <th style={{ padding: 8 }}>👍</th>
                      <th style={{ padding: 8 }}>👎</th>
                      <th style={{ padding: 8 }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {toolMap.map((t) => (
                      <tr key={t.href} style={{ borderBottom: "1px solid var(--line)" }}>
                        <td style={{ padding: 8 }}>
                          <Link href={t.href}>{t.title}</Link>
                        </td>
                        <td style={{ padding: 8 }}>{t.up}</td>
                        <td style={{ padding: 8 }}>{t.down}</td>
                        <td style={{ padding: 8 }}>{t.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "traffic" && (
            <div className="panel">
              <h2>Traffic (in-app)</h2>
              <p className="meta">
                Total views: <strong>{traffic?.total ?? 0}</strong> — soft counter, bot-proof nahi. Full analytics ke liye GA4 / Netlify Analytics.
              </p>
              <ul style={{ paddingLeft: 18 }}>
                {(traffic?.pages || []).map((p) => (
                  <li key={p.path} style={{ marginBottom: 6 }}>
                    <code>{p.path}</code> — {p.views}
                  </li>
                ))}
              </ul>
              {!traffic?.pages?.length ? <p className="meta">Abhi data nahi — site browse karke wapas refresh.</p> : null}
            </div>
          )}

          {tab === "feedback" && (
            <div className="panel">
              <h2>Feedback & reply</h2>
              <div style={{ marginBottom: 16 }}>
                <label>Reply to ID</label>
                <input
                  value={replyId}
                  onChange={(e) => setReplyId(e.target.value)}
                  placeholder="feedback id"
                  style={{ width: "100%", marginTop: 6, marginBottom: 8 }}
                />
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Your reply to user note…"
                  rows={3}
                  style={{ width: "100%", marginBottom: 8 }}
                />
                <button type="button" className="primary" onClick={() => void sendReply()}>
                  Send reply
                </button>
              </div>
              <div style={{ maxHeight: 480, overflow: "auto" }}>
                {items.map((it) => (
                  <div
                    key={it.id}
                    style={{
                      borderBottom: "1px solid var(--line)",
                      padding: "10px 0",
                      fontSize: 14,
                    }}
                  >
                    <div>
                      <strong>{it.toolId}</strong> · {it.vote === "up" ? "👍" : "👎"} ·{" "}
                      <button type="button" className="ghost" style={{ padding: "2px 8px" }} onClick={() => setReplyId(it.id)}>
                        Reply
                      </button>
                    </div>
                    <div className="meta">{new Date(it.ts).toLocaleString()}</div>
                    {it.note ? <p style={{ margin: "4px 0" }}>{it.note}</p> : null}
                    {it.reply ? (
                      <p style={{ margin: "4px 0", color: "var(--accent-2, #0d9488)" }}>
                        Admin: {it.reply}
                      </p>
                    ) : null}
                    <code className="meta">{it.id}</code>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "blog" && (
            <div className="panel">
              <h2>Blog — new / update post</h2>
              <p className="meta">Same slug save = update. Dynamic posts static list ko override karte hain.</p>
              <label>Title</label>
              <input value={bTitle} onChange={(e) => setBTitle(e.target.value)} style={{ width: "100%", marginBottom: 8 }} />
              <label>Slug (optional)</label>
              <input value={bSlug} onChange={(e) => setBSlug(e.target.value)} placeholder="auto-from-title" style={{ width: "100%", marginBottom: 8 }} />
              <label>Short description</label>
              <input value={bDesc} onChange={(e) => setBDesc(e.target.value)} style={{ width: "100%", marginBottom: 8 }} />
              <label>Tool link</label>
              <select value={bTool} onChange={(e) => { setBTool(e.target.value); const t = TOOLS.find(x => x.href === e.target.value); if (t) setBToolName(t.title); }} style={{ width: "100%", marginBottom: 8 }}>
                <option value="/">General</option>
                {TOOLS.map((t) => (
                  <option key={t.href} value={t.href}>{t.title}</option>
                ))}
              </select>
              <label>Body (paragraphs — blank line = new para)</label>
              <textarea value={bBody} onChange={(e) => setBBody(e.target.value)} rows={8} style={{ width: "100%", marginBottom: 8 }} />
              <button type="button" className="primary" onClick={() => void saveBlog()} disabled={!bTitle.trim()}>
                Publish / Update
              </button>

              <h3 style={{ marginTop: 24 }}>Dynamic posts</h3>
              <ul>
                {blogDyn.map((p) => (
                  <li key={p.slug} style={{ marginBottom: 8 }}>
                    <Link href={`/blog/${p.slug}`}>{p.title}</Link>{" "}
                    <button type="button" className="ghost" onClick={() => void removeBlog(p.slug)}>
                      Delete
                    </button>
                  </li>
                ))}
                {!blogDyn.length ? <li className="meta">No dynamic posts yet</li> : null}
              </ul>
              <h3>All visible posts ({blogAll.length})</h3>
              <ul>
                {blogAll.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
