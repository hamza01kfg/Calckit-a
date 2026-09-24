"use client";

import { useMemo, useState } from "react";
import { daysBetween, fmt } from "@/lib/calculators";
import CalculatorShell from "@/components/CalculatorShell";
import ResultCard from "@/components/ui/ResultCard";
import ResultActions from "@/components/ui/ResultActions";

export default function DatePage() {
  const [d1, setD1] = useState("2020-01-01");
  const [d2, setD2] = useState(() => new Date().toISOString().slice(0, 10));

  const result = useMemo(() => {
    if (!d1 || !d2) return null;
    const days = daysBetween(d1, d2);
    return {
      days,
      weeks: days / 7,
      months: days / 30.437,
      years: days / 365.25,
    };
  }, [d1, d2]);

  return (
    <CalculatorShell
      title="Date Difference"
      description="Days, weeks, months and years between two dates — live."
      toolId="date"
      result={
        result ? (
          <ResultCard
            title="Date Difference Result"
            headlineLabel="Days Between"
            headlineValue={fmt(result.days, 0)}
            metaLine={`${d1} → ${d2}`}
            breakdown={[
              { label: "Weeks", value: fmt(result.weeks, 2), icon: "W" },
              { label: "Months (avg)", value: fmt(result.months, 2), icon: "M" },
              { label: "Years (avg)", value: fmt(result.years, 2), icon: "Y" },
            ]}
            actions={
              <ResultActions
                copyText={`${fmt(result.days, 0)} days between ${d1} and ${d2}\nWeeks: ${fmt(result.weeks, 2)}\nMonths: ${fmt(result.months, 2)}\nYears: ${fmt(result.years, 2)}`}
                path="/date"
                shareParams={{ d1, d2 }}
                pdfTitle="Date Difference Result"
                pdfHeadline={{ label: "Days Between", value: fmt(result.days, 0) }}
                pdfRows={[
                  { label: "From Date", value: d1 },
                  { label: "To Date", value: d2 },
                  { label: "Days", value: fmt(result.days, 0) },
                  { label: "Weeks", value: fmt(result.weeks, 2) },
                  { label: "Months (avg)", value: fmt(result.months, 2) },
                  { label: "Years (avg)", value: fmt(result.years, 2) },
                ]}
              />
            }
          />
        ) : (
          <div className="meta">Select both dates</div>
        )
      }
    >
      <h2>Dates</h2>
      <label>From date</label>
      <input type="date" value={d1} onChange={(e) => setD1(e.target.value)} />
      <label>To date</label>
      <input type="date" value={d2} onChange={(e) => setD2(e.target.value)} />
    </CalculatorShell>
  );
}
