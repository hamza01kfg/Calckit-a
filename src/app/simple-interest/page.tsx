"use client";

import { useMemo, useState } from "react";
import { simpleInterest, fmt } from "@/lib/calculators";
import CalculatorShell from "@/components/CalculatorShell";
import InputSlider from "@/components/ui/InputSlider";
import ResultCard from "@/components/ui/ResultCard";
import ResultActions from "@/components/ui/ResultActions";

export default function SimpleInterestPage() {
  const [p, setP] = useState(10000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(3);
  const result = useMemo(() => simpleInterest(p, rate, years), [p, rate, years]);

  return (
    <CalculatorShell
      title="Simple Interest Calculator"
      description="Live simple interest (I = P × R × T / 100)."
      toolId="simple-interest"
      result={
        <ResultCard
          title="Simple Interest Result"
          headlineLabel="Total Amount"
          headlineValue={`₹${fmt(result.total)}`}
          metaLine={`Principal ₹${fmt(p, 0)} · ${rate}% · ${years} years`}
          breakdown={[
            { label: "Interest Earned", value: `₹${fmt(result.interest)}`, icon: "%" },
            { label: "Principal", value: `₹${fmt(p)}`, icon: "₹" },
            { label: "Rate × Time", value: `${rate}% × ${years}y`, icon: "#" },
          ]}
          actions={
            <ResultActions
              copyText={`Total ₹${fmt(result.total)}\nInterest ₹${fmt(result.interest)}\nPrincipal ₹${fmt(p)}\nRate ${rate}%\nYears ${years}`}
              path="/simple-interest"
              shareParams={{ p, rate, years }}
              pdfTitle="Simple Interest Result"
              pdfHeadline={{ label: "Total Amount", value: `₹${fmt(result.total)}` }}
              pdfRows={[
                { label: "Principal", value: `₹${fmt(p)}` },
                { label: "Rate", value: `${rate}% p.a.` },
                { label: "Time", value: `${years} years` },
                { label: "Interest", value: `₹${fmt(result.interest)}` },
                { label: "Total Amount", value: `₹${fmt(result.total)}` },
              ]}
            />
          }
        />
      }
    >
      <h2>Details</h2>
      <InputSlider label="Principal" value={p} min={0} max={5000000} step={1000} unit="₹" onChange={setP} />
      <InputSlider label="Rate" value={rate} min={0} max={50} step={0.1} unit="%" onChange={setRate} />
      <InputSlider label="Time" value={years} min={0.5} max={40} step={0.5} unit="years" onChange={setYears} />
    </CalculatorShell>
  );
}
