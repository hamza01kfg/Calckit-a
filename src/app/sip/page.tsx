"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { sipCalc, fmt } from "@/lib/calculators";
import CalculatorShell from "@/components/CalculatorShell";
import InputSlider from "@/components/ui/InputSlider";
import DonutChart from "@/components/ui/DonutChart";
import AreaChart from "@/components/ui/AreaChart";
import ResultCard from "@/components/ui/ResultCard";
import ResultActions from "@/components/ui/ResultActions";
import { useCalcHistory } from "@/hooks/useCalcHistory";

function growthPoints(pmt: number, annual: number, years: number) {
  const points = [];
  for (let y = 1; y <= Math.max(1, Math.round(years)); y++) {
    const r = sipCalc(pmt, annual, y);
    points.push({
      label: `Y${y}`,
      invested: r.invested,
      value: r.fv,
    });
  }
  return points;
}

function SipInner() {
  const params = useSearchParams();
  const { push } = useCalcHistory();
  const [pmt, setPmt] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  useEffect(() => {
    const m = params.get("monthly");
    const r = params.get("rate");
    const y = params.get("years");
    if (m) setPmt(Number(m) || 5000);
    if (r) setRate(Number(r) || 12);
    if (y) setYears(Number(y) || 10);
  }, [params]);

  const result = useMemo(() => sipCalc(pmt, rate, years), [pmt, rate, years]);
  const points = useMemo(() => growthPoints(pmt, rate, years), [pmt, rate, years]);

  useEffect(() => {
    const id = setTimeout(() => {
      push({
        tool: "SIP",
        title: "SIP Calculator",
        summary: `FV ${fmt(result.fv)} · ${fmt(pmt)}/mo · ${rate}% · ${years}y`,
        href: `/sip?monthly=${pmt}&rate=${rate}&years=${years}`,
      });
    }, 800);
    return () => clearTimeout(id);
  }, [result.fv, pmt, rate, years, push]);

  const copyText = `SIP Future value: ${fmt(result.fv)}\nInvested: ${fmt(result.invested)}\nGain: ${fmt(result.gain)}\nMonthly: ${fmt(pmt)}\nRate: ${rate}%\nYears: ${years}`;

  return (
    <CalculatorShell
      title="SIP Calculator"
      description="Live SIP projection with growth chart — invested vs portfolio value over years."
      toolId="sip"
      result={
        <ResultCard
          title="SIP Calculation Result"
          headlineLabel="Maturity Value"
          headlineValue={`₹${fmt(result.fv)}`}
          metaLine={`Monthly: ₹${fmt(pmt, 0)}  ·  Rate: ${rate}%  ·  Tenure: ${years} Years`}
          breakdown={[
            { label: "Total Invested", value: `₹${fmt(result.invested)}`, icon: "↓" },
            { label: "Estimated Gain", value: `₹${fmt(result.gain)}`, icon: "↑" },
            { label: "Months", value: String(years * 12), icon: "#" },
          ]}
          actions={
            <ResultActions
              copyText={copyText}
              path="/sip"
              shareParams={{ monthly: pmt, rate, years }}
              pdfTitle="SIP Calculation Result"
              pdfHeadline={{ label: "Maturity Value", value: `₹${fmt(result.fv)}` }}
              pdfRows={[
                { label: "Monthly SIP", value: `₹${fmt(pmt)}` },
                { label: "Expected Return", value: `${rate}% p.a.` },
                { label: "Tenure", value: `${years} years` },
                { label: "Total Invested", value: `₹${fmt(result.invested)}` },
                { label: "Estimated Gain", value: `₹${fmt(result.gain)}` },
              ]}
              csvRows={[
                ["Field", "Value"],
                ["Monthly SIP", String(pmt)],
                ["Rate %", String(rate)],
                ["Years", String(years)],
                ["Future value", String(result.fv)],
                ["Invested", String(result.invested)],
                ["Gain", String(result.gain)],
              ]}
            />
          }
        />
      }
      chart={
        <>
          <DonutChart
            centerLabel="Gain"
            centerValue={fmt(result.gain, 0)}
            slices={[
              { label: "Invested", value: result.invested, color: "#1f6b5a" },
              { label: "Gains", value: Math.max(0, result.gain), color: "#c45c26" },
            ]}
          />
          <h3 className="chart-title" style={{ marginTop: 16 }}>Growth over time</h3>
          <AreaChart points={points} />
        </>
      }
    >
      <h2>Investment details</h2>
      <InputSlider label="Monthly investment" value={pmt} min={500} max={200000} step={500} unit="₹" onChange={setPmt} />
      <InputSlider label="Expected annual return" value={rate} min={1} max={30} step={0.5} unit="%" onChange={setRate} />
      <InputSlider label="Tenure" value={years} min={1} max={40} step={1} unit="years" onChange={setYears} />
    </CalculatorShell>
  );
}

export default function SipPage() {
  return (
    <Suspense fallback={<div className="wrap tool-page"><p className="meta">Loading…</p></div>}>
      <SipInner />
    </Suspense>
  );
}
