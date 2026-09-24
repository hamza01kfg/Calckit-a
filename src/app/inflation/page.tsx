"use client";

import { useMemo, useState } from "react";
import { inflationCalc, fmt } from "@/lib/calculators";
import CalculatorShell from "@/components/CalculatorShell";
import InputSlider from "@/components/ui/InputSlider";
import ResultCard from "@/components/ui/ResultCard";
import ResultActions from "@/components/ui/ResultActions";

export default function InflationPage() {
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState(6);
  const [years, setYears] = useState(10);
  const result = useMemo(() => inflationCalc(amount, rate, years), [amount, rate, years]);
  const eroded = result - amount;

  return (
    <CalculatorShell
      title="Inflation Calculator"
      description="Live future value of money after inflation."
      toolId="inflation"
      result={
        <ResultCard
          title="Inflation Calculation Result"
          headlineLabel="Future Equivalent"
          headlineValue={`₹${fmt(result)}`}
          metaLine={`₹${fmt(amount, 0)} at ${rate}% inflation for ${years} years`}
          accent="orange"
          breakdown={[
            { label: "Current Amount", value: `₹${fmt(amount)}`, icon: "₹" },
            { label: "Purchasing Gap", value: `₹${fmt(eroded)}`, icon: "↑" },
            { label: "Inflation Rate", value: `${rate}% p.a.`, icon: "%" },
          ]}
          actions={
            <ResultActions
              copyText={`After inflation: ₹${fmt(result)}\nFrom ₹${fmt(amount)} at ${rate}% for ${years}y`}
              path="/inflation"
              shareParams={{ amount, rate, years }}
              pdfTitle="Inflation Calculation Result"
              pdfHeadline={{ label: "Future Equivalent", value: `₹${fmt(result)}` }}
              pdfRows={[
                { label: "Current Amount", value: `₹${fmt(amount)}` },
                { label: "Inflation Rate", value: `${rate}% p.a.` },
                { label: "Years", value: String(years) },
                { label: "Future Equivalent", value: `₹${fmt(result)}` },
                { label: "Purchasing Gap", value: `₹${fmt(eroded)}` },
              ]}
            />
          }
        />
      }
    >
      <h2>Details</h2>
      <InputSlider label="Current amount" value={amount} min={0} max={10000000} step={100} unit="₹" onChange={setAmount} />
      <InputSlider label="Inflation rate" value={rate} min={0} max={30} step={0.1} unit="%" onChange={setRate} />
      <InputSlider label="Years" value={years} min={1} max={50} step={1} onChange={setYears} />
    </CalculatorShell>
  );
}
