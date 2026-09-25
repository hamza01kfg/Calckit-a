"use client";

import { UiIcon } from "./Icon";
import { useState } from "react";

type Props = {
  toolId: string;
  inputs: Record<string, string | number>;
  result: string;
  lang?: "en" | "ur";
};

function looksIncomplete(text: string): boolean {
  const t = text.trim();
  if (t.length < 24) return true;
  // cut mid-word / open paren / no sentence end
  if (/[(\[{,:\-–—]\s*$/.test(t)) return true;
  if (!/[.!?۔؟]\s*$/.test(t) && t.length < 80) return true;
  return false;
}

export default function AiInsightCard({ toolId, inputs, result, lang = "en" }: Props) {
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [source, setSource] = useState("");

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/ai-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId, inputs, result, lang }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErr(data.error || "Could not load advice");
        setAdvice("");
        return;
      }
      let text = String(data.advice || "").trim();
      // strip accidental markdown noise
      text = text.replace(/\*\*/g, "").replace(/^["']|["']$/g, "").trim();
      if (!text || looksIncomplete(text)) {
        setErr(
          lang === "ur"
            ? "AI jawab adhura aaya — dobara try karein ya baad mein."
            : "AI reply was incomplete — tap again to retry."
        );
        // still show what we got if any
        setAdvice(text);
        setSource(data.source || "");
        return;
      }
      setAdvice(text);
      setSource(data.source || "");
      setErr("");
    } catch {
      setErr("Network error — check connection and try again.");
      setAdvice("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel ai-insight-card" style={{ marginTop: 12, borderStyle: "dashed" }} aria-live="polite">
      <h3
        style={{
          margin: "0 0 8px",
          fontSize: 15,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <UiIcon name="ai-tip" size={18} /> AI insight
      </h3>
      <p className="meta" style={{ marginTop: 0, marginBottom: 8 }}>
        General education only — not financial advice.
      </p>

      {advice ? (
        <div className="ai-insight-body">
          <p className="ai-insight-text">{advice}</p>
          {source === "fallback" ? (
            <p className="meta" style={{ marginTop: 6, fontSize: 12 }}>
              Offline tip (API key / model not available)
            </p>
          ) : null}
          <button
            type="button"
            className="ghost"
            style={{ marginTop: 10 }}
            disabled={loading}
            onClick={() => void load()}
          >
            {loading ? "Thinking…" : "Refresh tip"}
          </button>
        </div>
      ) : (
        <button type="button" className="ghost" disabled={loading} onClick={() => void load()}>
          {loading ? (
            "Thinking…"
          ) : (
            <>
              <UiIcon name="ai-tip" size={16} /> Get AI tip
            </>
          )}
        </button>
      )}

      {err ? (
        <p className="meta" style={{ color: "var(--warn, #f59e0b)", marginTop: 8 }}>
          {err}
        </p>
      ) : null}
    </div>
  );
}
