"use client";

import { parseSafeNumber, type NumberSchemaOpts } from "@/lib/validation";

interface InputSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
  /** Optional extra clamp rules (Zod-backed) */
  schema?: NumberSchemaOpts;
}

export default function InputSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
  schema,
}: InputSliderProps) {
  const rules: NumberSchemaOpts = {
    min,
    max,
    defaultValue: min,
    ...schema,
  };

  const safe = parseSafeNumber(value, rules);

  const commit = (raw: unknown) => {
    onChange(parseSafeNumber(raw, rules));
  };

  return (
    <div className="slider-field">
      <div className="slider-top">
        <label>{label}</label>
        <div className="slider-value-box">
          <input
            type="number"
            inputMode="decimal"
            value={Number.isFinite(safe) ? safe : min}
            min={min}
            max={max}
            step={step}
            onChange={(e) => commit(e.target.value)}
            onBlur={(e) => commit(e.target.value)}
            aria-label={label}
          />
          {unit ? <span className="slider-unit">{unit}</span> : null}
        </div>
      </div>
      <input
        type="range"
        className="slider-range"
        min={min}
        max={max}
        step={step}
        value={Math.min(Math.max(safe, min), max)}
        onChange={(e) => commit(e.target.value)}
        aria-label={`${label} slider`}
      />
      <div className="slider-minmax">
        <span>
          {min.toLocaleString()}
          {unit ? ` ${unit}` : ""}
        </span>
        <span>
          {max.toLocaleString()}
          {unit ? ` ${unit}` : ""}
        </span>
      </div>
    </div>
  );
}
