"use client";

import { useMemo, useState } from "react";
import { cagrCalc, fmt } from "@/lib/calculators";
import CalculatorShell from "@/components/CalculatorShell";
import InputSlider from "@/components/ui/InputSlider";
import ResultCard from "@/components/ui/ResultCard";
import ResultActions from "@/components/ui/ResultActions";

export default function CagrPage() {
  const [start, setStart] = useState(10000);
  const [end, setEnd] = useState(18000);
  const [years, setYears] = useState(5);
  const result = useMemo(() => cagrCalc(start, end, years), [start, end, years]);

  return (
    <CalculatorShell
      title="CAGR Calculator"
      description="Live compound annual growth rate."
      toolId="cagr"
      result={
        <ResultCard
          title="CAGR Calculation Result"
          headlineLabel="CAGR"
          headlineValue={`${result.toFixed(2)}%`}
          metaLine={`₹${fmt(start, 0)} → ₹${fmt(end, 0)} over ${years} years`}
          breakdown={[
            { label: "Beginning Value", value: `₹${fmt(start)}`, icon: "↓" },
            { label: "Ending Value", value: `₹${fmt(end)}`, icon: "↑" },
            { label: "Period", value: `${years} years`, icon: "#" },
          ]}
          actions={
            <ResultActions
              copyText={`CAGR ${result.toFixed(2)}%\n${fmt(start)} → ${fmt(end)} in ${years} years`}
              path="/cagr"
              shareParams={{ start, end, years }}
              pdfTitle="CAGR Calculation Result"
              pdfHeadline={{ label: "CAGR", value: `${result.toFixed(2)}%` }}
              pdfRows={[
                { label: "Beginning Value", value: `₹${fmt(start)}` },
                { label: "Ending Value", value: `₹${fmt(end)}` },
                { label: "Years", value: String(years) },
                { label: "CAGR", value: `${result.toFixed(2)}%` },
              ]}
            />
          }
        />
      }
    >
      <h2>Values</h2>
      <InputSlider label="Beginning value" value={start} min={1} max={10000000} step={100} unit="₹" onChange={setStart} />
      <InputSlider label="Ending value" value={end} min={1} max={10000000} step={100} unit="₹" onChange={setEnd} />
      <InputSlider label="Years" value={years} min={1} max={50} step={1} onChange={setYears} />
    </CalculatorShell>
  );
}
