"use client";

import { useMemo, useState } from "react";
import { roiCalc, fmt } from "@/lib/calculators";
import CalculatorShell from "@/components/CalculatorShell";
import InputSlider from "@/components/ui/InputSlider";
import ResultCard from "@/components/ui/ResultCard";
import ResultActions from "@/components/ui/ResultActions";

export default function RoiPage() {
  const [invested, setInvested] = useState(10000);
  const [returned, setReturned] = useState(13500);
  const result = useMemo(() => roiCalc(invested, returned), [invested, returned]);
  const profit = returned - invested;

  return (
    <CalculatorShell
      title="ROI Calculator"
      description="Live return on investment percentage."
      toolId="roi"
      result={
        <ResultCard
          title="ROI Calculation Result"
          headlineLabel="Return on Investment"
          headlineValue={`${result.toFixed(2)}%`}
          metaLine={`Invested ₹${fmt(invested, 0)} → Returned ₹${fmt(returned, 0)}`}
          accent={profit >= 0 ? "green" : "orange"}
          breakdown={[
            { label: "Profit / Loss", value: `₹${fmt(profit)}`, icon: profit >= 0 ? "↑" : "↓" },
            { label: "Amount Invested", value: `₹${fmt(invested)}`, icon: "₹" },
            { label: "Amount Returned", value: `₹${fmt(returned)}`, icon: "Σ" },
          ]}
          actions={
            <ResultActions
              copyText={`ROI ${result.toFixed(2)}%\nProfit ₹${fmt(profit)}\nInvested ₹${fmt(invested)}\nReturned ₹${fmt(returned)}`}
              path="/roi"
              shareParams={{ invested, returned }}
              pdfTitle="ROI Calculation Result"
              pdfHeadline={{ label: "Return on Investment", value: `${result.toFixed(2)}%` }}
              pdfRows={[
                { label: "Amount Invested", value: `₹${fmt(invested)}` },
                { label: "Amount Returned", value: `₹${fmt(returned)}` },
                { label: "Profit / Loss", value: `₹${fmt(profit)}` },
                { label: "ROI", value: `${result.toFixed(2)}%` },
              ]}
            />
          }
        />
      }
    >
      <h2>Values</h2>
      <InputSlider label="Amount invested" value={invested} min={0} max={10000000} step={100} unit="₹" onChange={setInvested} />
      <InputSlider label="Amount returned" value={returned} min={0} max={10000000} step={100} unit="₹" onChange={setReturned} />
    </CalculatorShell>
  );
}
