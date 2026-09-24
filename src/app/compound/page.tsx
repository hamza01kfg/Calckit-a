"use client";

import { useMemo, useState } from "react";
import { compoundFV, fmt } from "@/lib/calculators";
import CalculatorShell from "@/components/CalculatorShell";
import InputSlider from "@/components/ui/InputSlider";
import ResultCard from "@/components/ui/ResultCard";
import ResultActions from "@/components/ui/ResultActions";
import DonutChart from "@/components/ui/DonutChart";

export default function CompoundPage() {
  const [p, setP] = useState(10000);
  const [pmt, setPmt] = useState(500);
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(5);
  const [freq, setFreq] = useState(12);

  const result = useMemo(
    () => compoundFV(p, pmt, rate, years, freq),
    [p, pmt, rate, years, freq]
  );

  const invested = p + pmt * years * freq;
  const gain = Math.max(0, result.fv - invested);

  const copyText = `Future value: ₹${fmt(result.fv)}\nInvested: ₹${fmt(invested)}\nGain: ₹${fmt(gain)}\nPrincipal: ₹${fmt(p)}\nDeposit: ₹${fmt(pmt)}\nRate: ${rate}%\nYears: ${years}`;

  return (
    <CalculatorShell
      title="Compound Interest Calculator"
      description="Live future value with optional regular deposits."
      toolId="compound"
      result={
        <ResultCard
          title="Compound Interest Result"
          headlineLabel="Future Value"
          headlineValue={`₹${fmt(result.fv)}`}
          metaLine={`Principal ₹${fmt(p, 0)} · ${rate}% · ${years}y · ${freq}x/yr`}
          breakdown={[
            { label: "Total Invested", value: `₹${fmt(invested)}`, icon: "↓" },
            { label: "Interest Gain", value: `₹${fmt(gain)}`, icon: "↑" },
            { label: "Starting Principal", value: `₹${fmt(p)}`, icon: "₹" },
          ]}
          actions={
            <ResultActions
              copyText={copyText}
              path="/compound"
              shareParams={{ p, pmt, rate, years, freq }}
              pdfTitle="Compound Interest Result"
              pdfHeadline={{ label: "Future Value", value: `₹${fmt(result.fv)}` }}
              pdfRows={[
                { label: "Starting Principal", value: `₹${fmt(p)}` },
                { label: "Regular Deposit", value: `₹${fmt(pmt)}` },
                { label: "Annual Rate", value: `${rate}%` },
                { label: "Years", value: String(years) },
                { label: "Compounding / year", value: String(freq) },
                { label: "Total Invested", value: `₹${fmt(invested)}` },
                { label: "Interest Gain", value: `₹${fmt(gain)}` },
              ]}
              csvRows={[
                ["Field", "Value"],
                ["Principal", String(p)],
                ["Deposit", String(pmt)],
                ["Rate %", String(rate)],
                ["Years", String(years)],
                ["Freq", String(freq)],
                ["Future value", String(result.fv)],
                ["Invested", String(invested)],
                ["Gain", String(gain)],
              ]}
            />
          }
        />
      }
      chart={
        <DonutChart
          centerLabel="FV"
          centerValue={fmt(result.fv, 0)}
          slices={[
            { label: "Invested", value: Math.max(1, invested), color: "#3d9b84" },
            { label: "Gain", value: Math.max(0, gain), color: "#e07a3d" },
          ]}
        />
      }
    >
      <h2>Investment details</h2>
      <InputSlider label="Starting principal" value={p} min={0} max={5000000} step={1000} unit="₹" onChange={setP} />
      <InputSlider label="Regular deposit" value={pmt} min={0} max={200000} step={100} unit="₹" onChange={setPmt} />
      <InputSlider label="Annual rate" value={rate} min={0} max={30} step={0.1} unit="%" onChange={setRate} />
      <InputSlider label="Years" value={years} min={1} max={40} step={1} unit="y" onChange={setYears} />
      <InputSlider label="Compounds per year" value={freq} min={1} max={12} step={1} onChange={setFreq} />
    </CalculatorShell>
  );
}
