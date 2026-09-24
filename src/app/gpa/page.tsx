"use client";

import { useMemo, useState } from "react";
import { gpaPoints } from "@/lib/calculators";
import CalculatorShell from "@/components/CalculatorShell";
import ResultCard from "@/components/ui/ResultCard";
import ResultActions from "@/components/ui/ResultActions";

type Row = { name: string; letter: string; credits: string };

export default function GpaPage() {
  const [rows, setRows] = useState<Row[]>([
    { name: "Course 1", letter: "A", credits: "3" },
    { name: "Course 2", letter: "B+", credits: "3" },
  ]);

  const { gpa, totalCredits } = useMemo(() => {
    let points = 0;
    let credits = 0;
    rows.forEach((row) => {
      const cr = +row.credits || 0;
      const gp = gpaPoints(row.letter);
      if (gp != null && cr > 0) {
        points += gp * cr;
        credits += cr;
      }
    });
    return {
      gpa: credits ? points / credits : null,
      totalCredits: credits,
    };
  }, [rows]);

  const addRow = () => {
    setRows((r) => [...r, { name: "", letter: "A", credits: "3" }]);
  };

  const update = (i: number, field: keyof Row, value: string) => {
    setRows((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  };

  const letters = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"];

  const copyText =
    gpa !== null
      ? `GPA: ${gpa.toFixed(2)} (4.0 scale)\nCredits: ${totalCredits}\n` +
        rows
          .map((r) => `${r.name || "Course"}: ${r.letter} (${r.credits} cr)`)
          .join("\n")
      : "No GPA yet";

  return (
    <CalculatorShell
      title="GPA Calculator"
      description="Grade point average on 4.0 scale — live as you edit courses."
      toolId="gpa"
      result={
        gpa !== null ? (
          <ResultCard
            title="GPA Calculation Result"
            headlineLabel="Your GPA"
            headlineValue={gpa.toFixed(2)}
            metaLine={`${totalCredits} total credits · 4.0 scale`}
            breakdown={[
              { label: "Total Credits", value: String(totalCredits), icon: "#" },
              { label: "Courses", value: String(rows.length), icon: "Σ" },
              { label: "Scale", value: "4.0", icon: "%" },
            ]}
            actions={
              <ResultActions
                copyText={copyText}
                path="/gpa"
                pdfTitle="GPA Calculation Result"
                pdfHeadline={{ label: "Your GPA", value: gpa.toFixed(2) }}
                pdfRows={[
                  { label: "GPA", value: gpa.toFixed(2) },
                  { label: "Total Credits", value: String(totalCredits) },
                  { label: "Courses", value: String(rows.length) },
                  { label: "Scale", value: "4.0" },
                  ...rows.map((r, i) => ({
                    label: r.name || `Course ${i + 1}`,
                    value: `${r.letter} (${r.credits} cr)`,
                  })),
                ]}
              />
            }
          />
        ) : (
          <div className="meta">Add courses with credits</div>
        )
      }
    >
      <h2>Courses</h2>
      {rows.map((row, i) => (
        <div key={i} className="row" style={{ marginBottom: 10 }}>
          <input
            placeholder="Course"
            value={row.name}
            onChange={(e) => update(i, "name", e.target.value)}
          />
          <select value={row.letter} onChange={(e) => update(i, "letter", e.target.value)}>
            {letters.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            step="0.5"
            value={row.credits}
            onChange={(e) => update(i, "credits", e.target.value)}
            placeholder="Credits"
          />
        </div>
      ))}
      <button type="button" className="ghost" onClick={addRow}>
        + Add course
      </button>
    </CalculatorShell>
  );
}
