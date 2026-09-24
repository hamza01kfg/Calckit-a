"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { emiCalc, fmt } from "@/lib/calculators";
import CalculatorShell from "@/components/CalculatorShell";
import InputSlider from "@/components/ui/InputSlider";
import DonutChart from "@/components/ui/DonutChart";
import ResultCard from "@/components/ui/ResultCard";
import ResultActions from "@/components/ui/ResultActions";
import { useCalcHistory } from "@/hooks/useCalcHistory";

function EmiInner() {
  const params = useSearchParams();
  const { push } = useCalcHistory();
  const [principal, setPrincipal] = useState(2000000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(5);

  useEffect(() => {
    const a = params.get("amount");
    const r = params.get("rate");
    const t = params.get("tenure");
    if (a) setPrincipal(Number(a) || 2000000);
    if (r) setRate(Number(r) || 8.5);
    if (t) setYears(Number(t) || 5);
  }, [params]);

  const result = useMemo(
    () => emiCalc(principal, rate, years),
    [principal, rate, years]
  );

  useEffect(() => {
    const id = setTimeout(() => {
      push({
        tool: "EMI",
        title: "EMI Calculator",
        summary: `EMI ${fmt(result.emi)} · P ${fmt(principal)} · ${rate}% · ${years}y`,
        href: `/emi?amount=${principal}&rate=${rate}&tenure=${years}`,
      });
    }, 800);
    return () => clearTimeout(id);
  }, [result.emi, principal, rate, years, push]);

  const copyText = `EMI: ${fmt(result.emi)}\nTotal payment: ${fmt(result.total)}\nTotal interest: ${fmt(result.interest)}\nPrincipal: ${fmt(principal)}\nRate: ${rate}%\nTenure: ${years} years`;

  const lac = (n: number) => {
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
    return `₹${fmt(n)}`;
  };

  return (
    <CalculatorShell
      title="EMI Calculator"
      description="Live monthly installment — drag sliders. Premium result card updates instantly."
      toolId="emi"
      aiInputs={{ principal, rate, years }}
      aiResult={`EMI ${result.emi}; interest ${result.interest}; total ${result.total}`}
      result={
        <ResultCard
          title="EMI Calculation Result"
          headlineLabel="Monthly EMI"
          headlineValue={`₹${fmt(result.emi)}`}
          metaLine={`Principal: ₹${fmt(principal, 0)}  ·  Rate: ${rate}% p.a.  ·  Tenure: ${years} Years`}
          breakdown={[
            { label: "Principal Amount", value: lac(principal), icon: "₹" },
            { label: "Total Interest", value: lac(result.interest), icon: "%" },
            { label: "Total Payable", value: lac(result.total), icon: "Σ" },
          ]}
          actions={
            <ResultActions
              copyText={copyText}
              path="/emi"
              shareParams={{ amount: principal, rate, tenure: years }}
              pdfTitle="EMI Calculation Result"
              pdfHeadline={{ label: "Monthly EMI", value: `₹${fmt(result.emi)}` }}
              pdfRows={[
                { label: "Principal Amount", value: `₹${fmt(principal)}` },
                { label: "Interest Rate", value: `${rate}% p.a.` },
                { label: "Tenure", value: `${years} years` },
                { label: "Total Interest", value: `₹${fmt(result.interest)}` },
                { label: "Total Payable", value: `₹${fmt(result.total)}` },
              ]}
              csvRows={[
                ["Field", "Value"],
                ["Principal", String(principal)],
                ["Rate %", String(rate)],
                ["Years", String(years)],
                ["EMI", String(result.emi)],
                ["Total payment", String(result.total)],
                ["Total interest", String(result.interest)],
              ]}
            />
          }
        />
      }
      chart={
        <DonutChart
          centerLabel="EMI"
          centerValue={fmt(result.emi, 0)}
          slices={[
            { label: "Principal", value: principal, color: "#3d9b84" },
            { label: "Interest", value: Math.max(0, result.interest), color: "#e07a3d" },
          ]}
        />
      }
    >
      <h2>Loan details</h2>
      <InputSlider
        label="Principal amount"
        value={principal}
        min={10000}
        max={10000000}
        step={10000}
        unit="₹"
        onChange={setPrincipal}
      />
      <InputSlider
        label="Annual interest rate"
        value={rate}
        min={1}
        max={30}
        step={0.1}
        unit="%"
        onChange={setRate}
      />
      <InputSlider
        label="Tenure"
        value={years}
        min={1}
        max={30}
        step={0.5}
        unit="years"
        onChange={setYears}
      />
    </CalculatorShell>
  );
}

export default function EmiPage() {
  return (
    <Suspense fallback={<div className="wrap tool-page"><p className="meta">Loading…</p></div>}>
      <EmiInner />
    </Suspense>
  );
}
