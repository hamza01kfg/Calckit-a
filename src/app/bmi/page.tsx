"use client";

import { useMemo, useState } from "react";
import { bmiCalc, fmt } from "@/lib/calculators";
import CalculatorShell from "@/components/CalculatorShell";
import InputSlider from "@/components/ui/InputSlider";
import ResultCard from "@/components/ui/ResultCard";
import ResultActions from "@/components/ui/ResultActions";

function gaugeColor(label: string) {
  if (label === "Normal") return "#3d9b84";
  if (label === "Underweight") return "#3b82f6";
  if (label === "Overweight") return "#e0a354";
  return "#e07a3d";
}

function gaugeWidth(bmi: number) {
  const pct = Math.min(100, Math.max(0, ((bmi - 12) / 28) * 100));
  return `${pct}%`;
}

export default function BmiPage() {
  const [kg, setKg] = useState(70);
  const [cm, setCm] = useState(170);
  const result = useMemo(() => bmiCalc(kg, cm), [kg, cm]);

  return (
    <CalculatorShell
      title="BMI Calculator"
      description="Live Body Mass Index with premium result card and health gauge."
      toolId="bmi"
      result={
        <>
          <ResultCard
            title="BMI Result"
            headlineLabel="Your BMI"
            headlineValue={fmt(result.bmi, 1)}
            metaLine={`${kg} kg · ${cm} cm · ${result.label}`}
            accent={result.label === "Normal" ? "green" : "orange"}
            breakdown={[
              { label: "Category", value: result.label },
              { label: "Weight", value: `${kg} kg` },
              { label: "Height", value: `${cm} cm` },
            ]}
            actions={
              <ResultActions
                copyText={`BMI: ${fmt(result.bmi, 1)} (${result.label})\nWeight: ${kg} kg\nHeight: ${cm} cm`}
                path="/bmi"
                shareParams={{ kg, cm }}
                pdfTitle="BMI Calculation Result"
                pdfHeadline={{ label: "Your BMI", value: fmt(result.bmi, 1) }}
                pdfRows={[
                  { label: "Category", value: result.label },
                  { label: "Weight", value: `${kg} kg` },
                  { label: "Height", value: `${cm} cm` },
                ]}
              />
            }
          />
          <div className="gauge-bar" style={{ marginTop: 14 }}>
            <div
              className="gauge-fill"
              style={{ width: gaugeWidth(result.bmi), background: gaugeColor(result.label) }}
            />
          </div>
        </>
      }
    >
      <h2>Your details</h2>
      <InputSlider label="Weight" value={kg} min={30} max={200} step={0.5} unit="kg" onChange={setKg} />
      <InputSlider label="Height" value={cm} min={100} max={230} step={1} unit="cm" onChange={setCm} />
    </CalculatorShell>
  );
}
