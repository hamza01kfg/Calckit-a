"use client";

import { useCallback, useState } from "react";
import AdSlot from "@/components/AdSlot";
import { playTick } from "@/lib/clickSound";

const KEYS: { label: string; kind: "num" | "op" | "fn" | "eq"; wide?: boolean }[] = [
  { label: "C", kind: "fn" },
  { label: "⌫", kind: "fn" },
  { label: "%", kind: "op" },
  { label: "÷", kind: "op" },
  { label: "7", kind: "num" },
  { label: "8", kind: "num" },
  { label: "9", kind: "num" },
  { label: "×", kind: "op" },
  { label: "4", kind: "num" },
  { label: "5", kind: "num" },
  { label: "6", kind: "num" },
  { label: "-", kind: "op" },
  { label: "1", kind: "num" },
  { label: "2", kind: "num" },
  { label: "3", kind: "num" },
  { label: "+", kind: "op" },
  { label: "0", kind: "num", wide: true },
  { label: ".", kind: "num" },
  { label: "=", kind: "eq" },
];

function evaluate(expr: string): string {
  try {
    const safe = expr.replace(/×/g, "*").replace(/÷/g, "/").replace(/%/g, "/100");
    if (!/^[0-9+\-*/().\s]+$/.test(safe)) return "Error";
    // eslint-disable-next-line no-new-func
    const val = Function(`"use strict"; return (${safe})`)();
    if (typeof val !== "number" || !isFinite(val)) return "Error";
    return String(val);
  } catch {
    return "Error";
  }
}

export default function BasicPage() {
  const [expr, setExpr] = useState("0");

  const press = useCallback(
    (k: string) => {
      playTick();
      if (k === "C") {
        setExpr("0");
        return;
      }
      if (k === "⌫") {
        setExpr((e) => (e.length <= 1 ? "0" : e.slice(0, -1)));
        return;
      }
      if (k === "=") {
        setExpr(evaluate(expr));
        return;
      }
      setExpr((e) => {
        if (e === "0" || e === "Error") return k === "." ? "0." : k;
        return e + k;
      });
    },
    [expr]
  );

  return (
    <div className="wrap tool-page">
      <div className="tool-head">
        <h1>Crystal Calculator</h1>
        <p>Glass crystal keys · glowing display · click sound</p>
      </div>
      <AdSlot variant="desktop" />
      <AdSlot variant="mobile" />

      <div className="crystal-stage">
        <div className="crystal-phone">
          <div className="crystal-phone-inner">
            <div className="crystal-oled">
              <div className="crystal-oled-glow" />
              <div className="crystal-oled-label">CalcKit</div>
              <div className="crystal-oled-value">{expr}</div>
            </div>
            <div className="crystal-pad">
              {KEYS.map((k) => (
                <button
                  key={k.label}
                  type="button"
                  className={`crystal-glass crystal-glass--${k.kind}${k.wide ? " crystal-glass--wide" : ""}`}
                  onClick={() => press(k.label)}
                >
                  <span>{k.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="panel info-card">
        <h2>Complete Detail</h2>
        <p>
          Basic arithmetic calculator with crystal-glass keys and an OLED-style
          glowing display. Designed for a clean, modern feel.
        </p>
      </div>
      <div className="panel info-card">
        <h2>User Manual</h2>
        <ol className="info-list numbered">
          <li>Tap number and operator keys. Each tap plays a soft click.</li>
          <li>
            <strong>C</strong> clears all. <strong>⌫</strong> deletes one character.
          </li>
          <li>
            Press <strong>=</strong> for the result.
          </li>
        </ol>
      </div>
    </div>
  );
}
