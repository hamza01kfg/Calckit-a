"use client";

import Link from "next/link";
import { useCalcHistory } from "@/hooks/useCalcHistory";

export default function HistoryBar() {
  const { items, clear } = useCalcHistory();
  if (items.length === 0) return null;

  return (
    <div className="history-bar">
      <div className="wrap history-inner">
        <strong>Recent</strong>
        <div className="history-items">
          {items.map((h) => (
            <Link key={h.id} href={h.href} className="history-chip">
              {h.tool}: {h.summary}
            </Link>
          ))}
        </div>
        <button type="button" className="ghost" onClick={clear} style={{ fontSize: 12, padding: "4px 8px" }}>
          Clear
        </button>
      </div>
    </div>
  );
}
