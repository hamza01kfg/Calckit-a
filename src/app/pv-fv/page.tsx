"use client";

import { useMemo, useState } from "react";
import { fmt } from "@/lib/calculators";
import CalculatorShell from "@/components/CalculatorShell";
import InputSlider from "@/components/ui/InputSlider";
import ResultCard from "@/components/ui/ResultCard";
import ResultActions from "@/components/ui/ResultActions";

export default function PvFvPage() {
  const [mode, setMode] = useState<"fv" | "pv">("fv");
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(5);

  const result = useMemo(() => {
    const f = Math.pow(1 + rate / 100, years);
    return mode === "fv" ? amount * f : amount / f;
  }, [mode, amount, rate, years]);

  const headlineLabel = mode === "fv" ? "Future Value" : "Present Value";

  return (
    <CalculatorShell
      title="Present / Future Value"
      description="Live PV ↔ FV conversion."
      toolId="pv-fv"
      result={
        <ResultCard
          title="PV / FV Calculation Result"
          headlineLabel={headlineLabel}
          headlineValue={`₹${fmt(result)}`}
          metaLine={`${mode === "fv" ? "PV" : "FV"} ₹${fmt(amount, 0)} · ${rate}% · ${years} years`}
          breakdown={[
            {
              label: mode === "fv" ? "Present Amount" : "Future Amount",
              value: `₹${fmt(amount)}`,
              icon: "₹",
            },
            { label: "Rate", value: `${rate}% p.a.`, icon: "%" },
            { label: "Years", value: String(years), icon: "#" },
          ]}
          actions={
            <ResultActions
              copyText={`${headlineLabel}: ₹${fmt(result)}\nInput ₹${fmt(amount)}\nRate ${rate}%\nYears ${years}`}
              path="/pv-fv"
              shareParams={{ mode, amount, rate, years }}
              pdfTitle="Present / Future Value Result"
              pdfHeadline={{ label: headlineLabel, value: `₹${fmt(result)}` }}
              pdfRows={[
                { label: "Mode", value: mode === "fv" ? "Future Value" : "Present Value" },
                {
                  label: mode === "fv" ? "Present Amount" : "Future Amount",
                  value: `₹${fmt(amount)}`,
                },
                { label: "Annual Rate", value: `${rate}%` },
                { label: "Years", value: String(years) },
                { label: headlineLabel, value: `₹${fmt(result)}` },
              ]}
            />
          }
        />
      }
    >
      <label>Mode</label>
      <select value={mode} onChange={(e) => setMode(e.target.value as "fv" | "pv")}>
        <option value="fv">Future Value (FV)</option>
        <option value="pv">Present Value (PV)</option>
      </select>
      <InputSlider
        label={mode === "fv" ? "Present amount" : "Future amount"}
        value={amount}
        min={0}
        max={10000000}
        step={100}
        unit="₹"
        onChange={setAmount}
      />
      <InputSlider label="Annual rate" value={rate} min={0} max={30} step={0.1} unit="%" onChange={setRate} />
      <InputSlider label="Years" value={years} min={1} max={50} step={1} onChange={setYears} />
    </CalculatorShell>
  );
}
