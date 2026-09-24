"use client";

import { useMemo, useState } from "react";
import { ageFrom, fmt } from "@/lib/calculators";
import CalculatorShell from "@/components/CalculatorShell";
import ResultCard from "@/components/ui/ResultCard";
import ResultActions from "@/components/ui/ResultActions";

export default function AgePage() {
  const [dob, setDob] = useState("2000-01-01");
  const result = useMemo(() => (dob ? ageFrom(dob) : null), [dob]);

  return (
    <CalculatorShell
      title="Age Calculator"
      description="Exact age from date of birth — updates as you change the date."
      toolId="age"
      result={
        result ? (
          <ResultCard
            title="Age Calculation Result"
            headlineLabel="Your Age"
            headlineValue={`${result.years}y ${result.months}m ${result.days}d`}
            metaLine={`Date of birth: ${dob}`}
            breakdown={[
              { label: "Years", value: String(result.years), icon: "Y" },
              { label: "Months", value: String(result.months), icon: "M" },
              { label: "Days", value: String(result.days), icon: "D" },
              { label: "Total days lived", value: fmt(result.totalDays, 0), icon: "#" },
            ]}
            actions={
              <ResultActions
                copyText={`Age: ${result.years}y ${result.months}m ${result.days}d\nTotal days: ${result.totalDays}\nDOB: ${dob}`}
                path="/age"
                shareParams={{ dob }}
                pdfTitle="Age Calculation Result"
                pdfHeadline={{
                  label: "Your Age",
                  value: `${result.years}y ${result.months}m ${result.days}d`,
                }}
                pdfRows={[
                  { label: "Date of Birth", value: dob },
                  { label: "Years", value: String(result.years) },
                  { label: "Months", value: String(result.months) },
                  { label: "Days", value: String(result.days) },
                  { label: "Total Days Lived", value: fmt(result.totalDays, 0) },
                ]}
              />
            }
          />
        ) : (
          <div className="meta">Select date of birth</div>
        )
      }
    >
      <h2>Date of birth</h2>
      <label>Select date</label>
      <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
    </CalculatorShell>
  );
}
