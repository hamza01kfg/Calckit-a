"use client";

import { useMemo, useState } from "react";
import { savingsGoalCalc, fmt } from "@/lib/calculators";
import CalculatorShell from "@/components/CalculatorShell";
import InputSlider from "@/components/ui/InputSlider";
import ResultCard from "@/components/ui/ResultCard";
import ResultActions from "@/components/ui/ResultActions";

export default function SavingsGoalPage() {
  const [goal, setGoal] = useState(500000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(5);
  const [current, setCurrent] = useState(0);
  const result = useMemo(
    () => savingsGoalCalc(goal, rate, years, current),
    [goal, rate, years, current]
  );

  return (
    <CalculatorShell
      title="Savings Goal Calculator"
      description="Live monthly savings needed for your goal."
      toolId="savings-goal"
      result={
        <ResultCard
          title="Savings Goal Result"
          headlineLabel="Monthly Savings Needed"
          headlineValue={`₹${fmt(result.monthly)}`}
          metaLine={`Goal ₹${fmt(goal, 0)} · ${rate}% · ${years} years`}
          breakdown={[
            { label: "Total Months", value: String(result.months), icon: "#" },
            { label: "Goal Amount", value: `₹${fmt(goal)}`, icon: "₹" },
            { label: "Current Savings", value: `₹${fmt(current)}`, icon: "↓" },
            { label: "Expected Return", value: `${rate}% p.a.`, icon: "%" },
          ]}
          actions={
            <ResultActions
              copyText={`Monthly ₹${fmt(result.monthly)} for ${result.months} months\nGoal ₹${fmt(goal)}\nCurrent ₹${fmt(current)}\nRate ${rate}%`}
              path="/savings-goal"
              shareParams={{ goal, rate, years, current }}
              pdfTitle="Savings Goal Result"
              pdfHeadline={{ label: "Monthly Savings Needed", value: `₹${fmt(result.monthly)}` }}
              pdfRows={[
                { label: "Goal Amount", value: `₹${fmt(goal)}` },
                { label: "Current Savings", value: `₹${fmt(current)}` },
                { label: "Expected Return", value: `${rate}% p.a.` },
                { label: "Years", value: String(years) },
                { label: "Total Months", value: String(result.months) },
                { label: "Monthly Savings", value: `₹${fmt(result.monthly)}` },
              ]}
            />
          }
        />
      }
    >
      <InputSlider label="Goal amount" value={goal} min={1000} max={50000000} step={1000} unit="₹" onChange={setGoal} />
      <InputSlider label="Current savings" value={current} min={0} max={50000000} step={1000} unit="₹" onChange={setCurrent} />
      <InputSlider label="Expected return" value={rate} min={0} max={30} step={0.1} unit="%" onChange={setRate} />
      <InputSlider label="Years" value={years} min={1} max={40} step={1} onChange={setYears} />
    </CalculatorShell>
  );
}
