"use client";

import { UiIcon } from "./Icon";

import { useState } from "react";

type Props = {
  toolId: string;
  inputs: Record<string, string | number>;
  result: string;
  lang?: "en" | "ur";
};

export default function AiInsightCard({ toolId, inputs, result, lang = "en" }: Props) {
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

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
        return;
      }
      setAdvice(data.advice || "");
    } catch {
      setErr("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="panel"
      style={{ marginTop: 12, borderStyle: "dashed" }}
      aria-live="polite"
    >
      <h3 style={{ margin: "0 0 8px", fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}><UiIcon name="ai-tip" size={18} /> AI insight</h3>
      <p className="meta" style={{ marginTop: 0 }}>
        General education only — not financial advice.
      </p>
      {advice ? (
        <p style={{ margin: "8px 0 0", lineHeight: 1.5 }}>{advice}</p>
      ) : (
        <button type="button" className="ghost" disabled={loading} onClick={() => void load()}>
          {loading ? "Thinking…" : (<><UiIcon name="ai-tip" size={16} /> Get AI tip</>)}
        </button>
      )}
      {err ? (
        <p className="meta" style={{ color: "var(--warn)", marginTop: 8 }}>
          {err}
        </p>
      ) : null}
    </div>
  );
}
