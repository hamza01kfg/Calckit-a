"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HowToUse from "./HowToUse";
import ToolSeoContent from "./ToolSeoContent";
import ToolFeedback from "./ToolFeedback";
import AiInsightCard from "./AiInsightCard";
import { UiIcon } from "./Icon";

type Props = {
  title: string;
  description: string;
  toolId: string;
  children: ReactNode;
  result?: ReactNode;
  chart?: ReactNode;
  /** Optional structured data for AI tip */
  aiInputs?: Record<string, string | number>;
  aiResult?: string;
};

export default function CalculatorShell({
  title,
  description,
  toolId,
  children,
  result,
  chart,
  aiInputs,
  aiResult,
}: Props) {
  const router = useRouter();

  return (
    <div className="wrap tool-page">
      <div className="tool-nav" role="navigation" aria-label="Tool navigation">
        <button
          type="button"
          className="tool-nav__back"
          onClick={() => {
            if (typeof window !== "undefined" && window.history.length > 1) {
              router.back();
            } else {
              router.push("/");
            }
          }}
        >
          <UiIcon name="back" size={16} />
          <span>Back</span>
        </button>
        <Link href="/" className="tool-nav__home">
          <UiIcon name="home" size={16} />
          <span>All tools</span>
        </Link>
      </div>

      <div className="tool-head">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div className="calc-shell">
        <div className="calc-main">
          <div className="panel">{children}</div>
        </div>
        <div className="calc-side">
          {result && (
            <div className="panel result fx-result-wrap">
              {result}
              <ToolFeedback toolId={toolId} toolTitle={title} />
              <AiInsightCard
                toolId={toolId}
                inputs={aiInputs || {}}
                result={aiResult || title}
              />
            </div>
          )}
          {chart && (
            <div className="panel">
              <h3 className="chart-title">Visual breakdown</h3>
              {chart}
            </div>
          )}
        </div>
      </div>

      <HowToUse toolId={toolId} />
      <ToolSeoContent toolId={toolId} />
    </div>
  );
}
