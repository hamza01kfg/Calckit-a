"use client";

import { useEffect, useMemo, useState } from "react";
import { UNITS, convertTemp, fmt } from "@/lib/calculators";
import CalculatorShell from "@/components/CalculatorShell";
import ResultCard from "@/components/ui/ResultCard";
import ResultActions from "@/components/ui/ResultActions";

export default function UnitPage() {
  const [type, setType] = useState("Length");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("ft");
  const [val, setVal] = useState(1);

  useEffect(() => {
    const keys = Object.keys(UNITS[type]);
    setFrom(keys[0]);
    setTo(keys[1] || keys[0]);
  }, [type]);

  const out = useMemo(() => {
    if (type === "Temperature") return `${fmt(convertTemp(val, from, to), 4)} ${to}`;
    const factorFrom = UNITS[type][from] as number;
    const factorTo = UNITS[type][to] as number;
    return `${fmt((val * factorFrom) / factorTo, 6)} ${to}`;
  }, [type, from, to, val]);

  return (
    <CalculatorShell
      title="Unit Converter"
      description="Live length, weight and temperature conversion."
      toolId="unit"
      result={
        <ResultCard
          title="Unit Conversion Result"
          headlineLabel="Converted Value"
          headlineValue={out}
          metaLine={`${val} ${from} → ${to} (${type})`}
          breakdown={[
            { label: "Input", value: `${val} ${from}`, icon: "#" },
            { label: "Type", value: type, icon: "↔" },
            { label: "From → To", value: `${from} → ${to}`, icon: "Σ" },
          ]}
          actions={
            <ResultActions
              copyText={`${val} ${from} = ${out} (${type})`}
              path="/unit"
              shareParams={{ type, from, to, val }}
              pdfTitle="Unit Conversion Result"
              pdfHeadline={{ label: "Converted Value", value: out }}
              pdfRows={[
                { label: "Type", value: type },
                { label: "Input", value: `${val} ${from}` },
                { label: "From", value: from },
                { label: "To", value: to },
                { label: "Result", value: out },
              ]}
            />
          }
        />
      }
    >
      <h2>Convert</h2>
      <label>Type</label>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option>Length</option>
        <option>Weight</option>
        <option>Temperature</option>
      </select>
      <label>Value</label>
      <input type="number" inputMode="decimal" value={val} onChange={(e) => setVal(Number(e.target.value) || 0)} />
      <div className="row">
        <div>
          <label>From</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)}>
            {Object.keys(UNITS[type]).map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
        </div>
        <div>
          <label>To</label>
          <select value={to} onChange={(e) => setTo(e.target.value)}>
            {Object.keys(UNITS[type]).map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>
    </CalculatorShell>
  );
}
