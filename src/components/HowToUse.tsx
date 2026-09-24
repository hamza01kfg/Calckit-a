"use client";

import { useLang } from "./LanguageProvider";
import { getHowTo } from "@/lib/toolDescriptions";

export default function HowToUse({ toolId }: { toolId: string }) {
  const { lang, t } = useLang();
  const steps = getHowTo(toolId, lang);

  return (
    <div className="panel" style={{ marginTop: 20 }}>
      <h2 style={{ marginBottom: 12 }}>{t("howToUse")}</h2>
      <ol style={{ paddingLeft: 20, color: "var(--muted)", lineHeight: 1.7 }}>
        {steps.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>
    </div>
  );
}
