"use client";

import { useMemo, useState } from "react";
import { breakevenCalc, fmt } from "@/lib/calculators";
import CalculatorShell from "@/components/CalculatorShell";
import InputSlider from "@/components/ui/InputSlider";
import ResultCard from "@/components/ui/ResultCard";
import ResultActions from "@/components/ui/ResultActions";

export default function BreakevenPage() {
  const [fixed, setFixed] = useState(50000);
  const [price, setPrice] = useState(200);
  const [variable, setVariable] = useState(80);
  const result = useMemo(() => breakevenCalc(fixed, price, variable), [fixed, price, variable]);

  return (
    <CalculatorShell
      title="Break-even Calculator"
      description="Live break-even units and revenue."
      toolId="breakeven"
      result={
        isFinite(result.units) ? (
          <ResultCard
            title="Break-even Result"
            headlineLabel="Break-even Units"
            headlineValue={fmt(result.units, 0)}
            metaLine={`Fixed ₹${fmt(fixed, 0)} · Price ₹${fmt(price, 0)} · Variable ₹${fmt(variable, 0)}`}
            breakdown={[
              { label: "Contribution / unit", value: `₹${fmt(result.contrib)}`, icon: "₹" },
              { label: "Break-even revenue", value: `₹${fmt(result.revenue)}`, icon: "Σ" },
              { label: "Fixed costs", value: `₹${fmt(fixed)}`, icon: "#" },
            ]}
            actions={
              <ResultActions
                copyText={`Break-even ${fmt(result.units, 0)} units\nRevenue ₹${fmt(result.revenue)}\nContribution ₹${fmt(result.contrib)}`}
                path="/breakeven"
                shareParams={{ fixed, price, variable }}
                pdfTitle="Break-even Calculation Result"
                pdfHeadline={{ label: "Break-even Units", value: fmt(result.units, 0) }}
                pdfRows={[
                  { label: "Fixed Costs", value: `₹${fmt(fixed)}` },
                  { label: "Price per Unit", value: `₹${fmt(price)}` },
                  { label: "Variable Cost / Unit", value: `₹${fmt(variable)}` },
                  { label: "Contribution / Unit", value: `₹${fmt(result.contrib)}` },
                  { label: "Break-even Units", value: fmt(result.units, 0) },
                  { label: "Break-even Revenue", value: `₹${fmt(result.revenue)}` },
                ]}
              />
            }
          />
        ) : (
          <div className="meta">Impossible — variable cost ≥ price</div>
        )
      }
    >
      <InputSlider label="Fixed costs" value={fixed} min={0} max={10000000} step={1000} unit="₹" onChange={setFixed} />
      <InputSlider label="Price per unit" value={price} min={0} max={100000} step={1} unit="₹" onChange={setPrice} />
      <InputSlider label="Variable cost / unit" value={variable} min={0} max={100000} step={1} unit="₹" onChange={setVariable} />
    </CalculatorShell>
  );
}
