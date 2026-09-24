"use client";

import { useMemo, useState } from "react";
import { discountCalc, fmt } from "@/lib/calculators";
import CalculatorShell from "@/components/CalculatorShell";
import InputSlider from "@/components/ui/InputSlider";
import ResultCard from "@/components/ui/ResultCard";
import ResultActions from "@/components/ui/ResultActions";

export default function DiscountPage() {
  const [price, setPrice] = useState(1000);
  const [percent, setPercent] = useState(20);
  const result = useMemo(() => discountCalc(price, percent), [price, percent]);

  return (
    <CalculatorShell
      title="Discount Calculator"
      description="Live sale price after discount."
      toolId="discount"
      result={
        <ResultCard
          title="Discount Calculation Result"
          headlineLabel="Final Price"
          headlineValue={`₹${fmt(result.final)}`}
          metaLine={`Original ₹${fmt(price, 0)} · ${percent}% off`}
          breakdown={[
            { label: "You Save", value: `₹${fmt(result.save)}`, icon: "%" },
            { label: "Original Price", value: `₹${fmt(price)}`, icon: "₹" },
            { label: "Discount", value: `${percent}%`, icon: "↓" },
          ]}
          actions={
            <ResultActions
              copyText={`Final ₹${fmt(result.final)}\nSave ₹${fmt(result.save)}\nOriginal ₹${fmt(price)}\nDiscount ${percent}%`}
              path="/discount"
              shareParams={{ price, percent }}
              pdfTitle="Discount Calculation Result"
              pdfHeadline={{ label: "Final Price", value: `₹${fmt(result.final)}` }}
              pdfRows={[
                { label: "Original Price", value: `₹${fmt(price)}` },
                { label: "Discount", value: `${percent}%` },
                { label: "You Save", value: `₹${fmt(result.save)}` },
                { label: "Final Price", value: `₹${fmt(result.final)}` },
              ]}
            />
          }
        />
      }
    >
      <h2>Details</h2>
      <InputSlider label="Original price" value={price} min={0} max={1000000} step={10} unit="₹" onChange={setPrice} />
      <InputSlider label="Discount" value={percent} min={0} max={100} step={1} unit="%" onChange={setPercent} />
    </CalculatorShell>
  );
}
