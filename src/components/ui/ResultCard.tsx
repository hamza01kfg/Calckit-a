"use client";

import { ReactNode } from "react";

export type BreakdownItem = {
  label: string;
  value: string;
  icon?: string;
};

type Props = {
  title?: string;
  headlineLabel: string;
  headlineValue: string;
  metaLine?: string;
  breakdown?: BreakdownItem[];
  actions?: ReactNode;
  accent?: "green" | "orange";
};

/**
 * Premium glass result card — fintech dashboard style
 */
export default function ResultCard({
  title = "Calculation Result",
  headlineLabel,
  headlineValue,
  metaLine,
  breakdown = [],
  actions,
  accent = "green",
}: Props) {
  return (
    <div className={`fx-card fx-card--${accent}`}>
      <div className="fx-card__glow" aria-hidden />
      <div className="fx-card__inner">
        <div className="fx-card__head">
          <span className="fx-card__badge" aria-hidden>
            ∑
          </span>
          <span className="fx-card__title">{title}</span>
        </div>

        <div className="fx-card__hero">
          <div className="fx-card__hero-label">{headlineLabel}</div>
          <div className="fx-card__hero-value">{headlineValue}</div>
          {metaLine ? <div className="fx-card__meta">{metaLine}</div> : null}
        </div>

        {breakdown.length > 0 && (
          <div className="fx-card__breakdown">
            <div className="fx-card__breakdown-label">Breakdown</div>
            <div className="fx-card__grid">
              {breakdown.map((b) => (
                <div key={b.label} className="fx-card__stat">
                  <div className="fx-card__stat-label">
                    {b.icon ? <span className="fx-card__stat-icon">{b.icon}</span> : null}
                    {b.label}
                  </div>
                  <div className="fx-card__stat-value">{b.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {actions ? <div className="fx-card__actions">{actions}</div> : null}
      </div>
    </div>
  );
}
