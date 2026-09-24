"use client";

import { useMemo, useState } from "react";
import { marginCalc, fmt } from "@/lib/calculators";
import CalculatorShell from "@/components/CalculatorShell";
import InputSlider from "@/components/ui/InputSlider";
import ResultCard from "@/components/ui/ResultCard";
import ResultActions from "@/components/ui/ResultActions";

export default function MarginPage() {
  const [cost, setCost] = useState(100);
  const [sell, setSell] = useState(150);
  const result = useMemo(() => marginCalc(cost, sell), [cost, sell]);

  return (
    <CalculatorShell
      title="Margin / Markup Calculator"
      description="Live profit, margin % and markup %."
      toolId="margin"
      result={
        <ResultCard
          title="Margin / Markup Result"
          headlineLabel="Profit"
          headlineValue={`₹${fmt(result.profit)}`}
          metaLine={`Cost ₹${fmt(cost, 0)} · Sell ₹${fmt(sell, 0)}`}
          accent={result.profit >= 0 ? "green" : "orange"}
          breakdown={[
            { label: "Margin %", value: `${result.margin.toFixed(2)}%`, icon: "%" },
            { label: "Markup %", value: `${result.markup.toFixed(2)}%`, icon: "↑" },
            { label: "Cost Price", value: `₹${fmt(cost)}`, icon: "₹" },
            { label: "Selling Price", value: `₹${fmt(sell)}`, icon: "Σ" },
          ]}
          actions={
            <ResultActions
              copyText={`Profit ₹${fmt(result.profit)}\nMargin ${result.margin.toFixed(2)}%\nMarkup ${result.markup.toFixed(2)}%\nCost ₹${fmt(cost)}\nSell ₹${fmt(sell)}`}
              path="/margin"
              shareParams={{ cost, sell }}
              pdfTitle="Margin / Markup Result"
              pdfHeadline={{ label: "Profit", value: `₹${fmt(result.profit)}` }}
              pdfRows={[
                { label: "Cost Price", value: `₹${fmt(cost)}` },
                { label: "Selling Price", value: `₹${fmt(sell)}` },
                { label: "Profit", value: `₹${fmt(result.profit)}` },
                { label: "Margin", value: `${result.margin.toFixed(2)}%` },
                { label: "Markup", value: `${result.markup.toFixed(2)}%` },
              ]}
            />
          }
        />
      }
    >
      <InputSlider label="Cost price" value={cost} min={0} max={1000000} step={1} unit="₹" onChange={setCost} />
      <InputSlider label="Selling price" value={sell} min={0} max={1000000} step={1} unit="₹" onChange={setSell} />
    </CalculatorShell>
  );
}
