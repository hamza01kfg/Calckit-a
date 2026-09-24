"use client";

import { useMemo, useState } from "react";
import { fmt } from "@/lib/calculators";
import CalculatorShell from "@/components/CalculatorShell";
import InputSlider from "@/components/ui/InputSlider";
import ResultCard from "@/components/ui/ResultCard";
import ResultActions from "@/components/ui/ResultActions";

export default function TaxPage() {
  const [amount, setAmount] = useState(1000);
  const [rate, setRate] = useState(15);
  const [mode, setMode] = useState<"add" | "extract">("add");

  const result = useMemo(() => {
    if (mode === "add") {
      const tax = (amount * rate) / 100;
      return { tax, total: amount + tax, net: amount };
    }
    const net = amount / (1 + rate / 100);
    return { tax: amount - net, total: amount, net };
  }, [amount, rate, mode]);

  return (
    <CalculatorShell
      title="Tax Calculator"
      description="Add tax or extract tax from an inclusive price — live results."
      toolId="tax"
      result={
        <ResultCard
          title="Tax Calculation Result"
          headlineLabel="Tax Amount"
          headlineValue={`₹${fmt(result.tax)}`}
          metaLine={mode === "add" ? `Add ${rate}% tax on ₹${fmt(amount, 0)}` : `Extract ${rate}% from ₹${fmt(amount, 0)}`}
          breakdown={[
            { label: "Net (before tax)", value: `₹${fmt(result.net)}`, icon: "₹" },
            { label: "Total (with tax)", value: `₹${fmt(result.total)}`, icon: "Σ" },
            { label: "Tax rate", value: `${rate}%`, icon: "%" },
          ]}
          actions={
            <ResultActions
              copyText={`Tax ₹${fmt(result.tax)}\nNet ₹${fmt(result.net)}\nTotal ₹${fmt(result.total)}\nRate ${rate}%`}
              path="/tax"
              shareParams={{ amount, rate, mode }}
              pdfTitle="Tax Calculation Result"
              pdfHeadline={{ label: "Tax Amount", value: `₹${fmt(result.tax)}` }}
              pdfRows={[
                { label: "Mode", value: mode === "add" ? "Add tax" : "Extract tax" },
                { label: "Input Amount", value: `₹${fmt(amount)}` },
                { label: "Tax Rate", value: `${rate}%` },
                { label: "Tax Amount", value: `₹${fmt(result.tax)}` },
                { label: "Net (before tax)", value: `₹${fmt(result.net)}` },
                { label: "Total (with tax)", value: `₹${fmt(result.total)}` },
              ]}
            />
          }
        />
      }
    >
      <h2>Details</h2>
      <label>Mode</label>
      <select value={mode} onChange={(e) => setMode(e.target.value as "add" | "extract")}>
        <option value="add">Add tax to amount</option>
        <option value="extract">Extract tax (price includes tax)</option>
      </select>
      <InputSlider label="Amount" value={amount} min={0} max={10000000} step={10} unit="₹" onChange={setAmount} />
      <InputSlider label="Tax rate" value={rate} min={0} max={50} step={0.1} unit="%" onChange={setRate} />
    </CalculatorShell>
  );
}
