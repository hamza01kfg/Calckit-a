"use client";

import { useMemo, useState } from "react";
import { fmt } from "@/lib/calculators";
import CalculatorShell from "@/components/CalculatorShell";
import InputSlider from "@/components/ui/InputSlider";
import ResultCard from "@/components/ui/ResultCard";
import ResultActions from "@/components/ui/ResultActions";

export default function PercentagePage() {
  const [mode, setMode] = useState<"of" | "is" | "change">("of");
  const [a, setA] = useState(25);
  const [b, setB] = useState(200);

  const { display, label, rows, copy } = useMemo(() => {
    if (mode === "of") {
      const v = (a / 100) * b;
      return {
        display: fmt(v),
        label: `${a}% of ${fmt(b)}`,
        rows: [
          { label: "Percentage", value: `${a}%` },
          { label: "Of value", value: fmt(b) },
          { label: "Result", value: fmt(v) },
        ],
        copy: `${a}% of ${fmt(b)} = ${fmt(v)}`,
      };
    }
    if (mode === "is") {
      const v = b ? (a / b) * 100 : 0;
      return {
        display: b ? `${fmt(v)}%` : "—",
        label: `${fmt(a)} is what % of ${fmt(b)}`,
        rows: [
          { label: "Value", value: fmt(a) },
          { label: "Of total", value: fmt(b) },
          { label: "Percentage", value: b ? `${fmt(v)}%` : "—" },
        ],
        copy: `${fmt(a)} is ${fmt(v)}% of ${fmt(b)}`,
      };
    }
    const v = a ? ((b - a) / a) * 100 : 0;
    return {
      display: a ? `${fmt(v)}%` : "—",
      label: `Change ${fmt(a)} → ${fmt(b)}`,
      rows: [
        { label: "From", value: fmt(a) },
        { label: "To", value: fmt(b) },
        { label: "Change", value: a ? `${fmt(v)}%` : "—" },
      ],
      copy: `Change ${fmt(a)} → ${fmt(b)} = ${fmt(v)}%`,
    };
  }, [mode, a, b]);

  return (
    <CalculatorShell
      title="Percentage Calculator"
      description="Live percentage of, percent-of, and percent change."
      toolId="percentage"
      result={
        <ResultCard
          title="Percentage Calculation Result"
          headlineLabel="Result"
          headlineValue={display}
          metaLine={label}
          breakdown={rows.map((r) => ({ ...r, icon: "%" }))}
          actions={
            <ResultActions
              copyText={copy}
              path="/percentage"
              shareParams={{ mode, a, b }}
              pdfTitle="Percentage Calculation Result"
              pdfHeadline={{ label: "Result", value: display }}
              pdfRows={rows}
            />
          }
        />
      }
    >
      <h2>Mode</h2>
      <div className="row" style={{ marginBottom: 12 }}>
        <button type="button" className={mode === "of" ? "" : "ghost"} onClick={() => setMode("of")}>
          X% of Y
        </button>
        <button type="button" className={mode === "is" ? "" : "ghost"} onClick={() => setMode("is")}>
          X is what % of Y
        </button>
        <button type="button" className={mode === "change" ? "" : "ghost"} onClick={() => setMode("change")}>
          % change
        </button>
      </div>
      <InputSlider
        label={mode === "of" ? "Percentage (X)" : mode === "is" ? "Value (X)" : "From (X)"}
        value={a}
        min={0}
        max={mode === "of" ? 100 : 1000000}
        step={mode === "of" ? 0.1 : 1}
        onChange={setA}
      />
      <InputSlider
        label={mode === "of" ? "Of value (Y)" : mode === "is" ? "Of total (Y)" : "To (Y)"}
        value={b}
        min={0}
        max={1000000}
        step={1}
        onChange={setB}
      />
    </CalculatorShell>
  );
}
