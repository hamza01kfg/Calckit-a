import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/ai-advisor
 * GEMINI_API_KEY + GEMINI_MODEL from Netlify env only.
 */

type Body = {
  toolId?: string;
  inputs?: Record<string, string | number>;
  result?: string;
  lang?: string;
};

const TOOL_ID_RE = /^[a-z0-9\-]{1,40}$/i;
const MAX_RESULT = 800;
const MAX_INPUT_KEYS = 12;

const hits = new Map<string, { n: number; t: number }>();

function clientKey(req: NextRequest): string {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

function rateLimit(key: string, limit = 20, windowMs = 60_000): boolean {
  const now = Date.now();
  const cur = hits.get(key);
  if (!cur || now - cur.t > windowMs) {
    hits.set(key, { n: 1, t: now });
    return true;
  }
  if (cur.n >= limit) return false;
  cur.n += 1;
  return true;
}

function sanitizeInputs(raw: unknown): Record<string, string | number> {
  if (!raw || typeof raw !== "object") return {};
  const out: Record<string, string | number> = {};
  let i = 0;
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (i >= MAX_INPUT_KEYS) break;
    const key = String(k).replace(/[^\w.\- ]/g, "").slice(0, 40);
    if (!key) continue;
    if (typeof v === "number" && Number.isFinite(v)) out[key] = v;
    else if (typeof v === "string") out[key] = v.replace(/[<>]/g, "").slice(0, 80);
    i++;
  }
  return out;
}

function looksIncomplete(text: string): boolean {
  const t = text.trim();
  if (t.length < 40) return true;
  if (/[(\[{,:\-–—]\s*$/.test(t)) return true;
  // ends mid-sentence without punctuation
  if (!/[.!?۔؟]\s*$/.test(t)) return true;
  return false;
}

function fallbackAdvice(
  toolId: string,
  inputs: Record<string, string | number>,
  lang: string
): string {
  const isUr = lang === "ur";
  if (toolId === "emi" || toolId === "loan") {
    return isUr
      ? "Agar mumkin ho to monthly payment thora barhaein — total interest kam ho sakta hai aur loan jaldi khatam. Extra payment pehle principal par lagaye."
      : "If possible, raise the monthly payment slightly — total interest often drops and the loan finishes sooner. Apply extra payments to principal first.";
  }
  if (toolId === "sip") {
    return isUr
      ? "SIP mein regularity aur time compound growth ka asasi hissa hain. Monthly amount thora barha kar long horizon rakhna aksar behtar result deta hai. Yeh estimate hai, guarantee nahi."
      : "With SIP, consistency and time matter most. A slightly higher monthly amount over a longer horizon usually helps more than chasing returns. This is an estimate, not a guarantee.";
  }
  if (toolId === "compound") {
    return isUr
      ? "Compound interest time ke sath tezi se badhta hai. Rate aur tenure dono check karein — chhota rate bhi lambi muddat pe bada farq la sakta hai."
      : "Compound growth accelerates with time. Check both rate and tenure — even a modest rate can matter a lot over long periods.";
  }
  if (toolId === "roi") {
    return isUr
      ? "Basic ROI time ignore karta hai. Do investments compare karte waqt tenure bhi dekhein; time-aware metric ke liye CAGR behtar ho sakta hai."
      : "Basic ROI ignores time. When comparing investments, also look at how long money was locked; for time-aware returns, CAGR is often more useful.";
  }
  if (toolId === "bmi") {
    return isUr
      ? "BMI ek rough health indicator hai — athletes aur kuch medical cases mein misleading ho sakta hai. Bari change se pehle doctor se mashwara lein."
      : "BMI is a rough indicator — it can mislead for athletes and some medical cases. For major changes, talk to a clinician.";
  }
  if (toolId === "tax" || toolId === "discount" || toolId === "percentage") {
    return isUr
      ? "Numbers dobara check karein. Tax/discount rules region ke hisaab se alag ho sakte hain — yeh general calculator hai."
      : "Double-check the numbers. Tax and discount rules vary by region — this is a general calculator only.";
  }
  if (toolId === "currency") {
    return isUr
      ? "Exchange rates change hote rehte hain. Badi transfer se pehle bank/fintech ka live rate confirm karein."
      : "Exchange rates move constantly. Confirm the live rate with your bank or provider before a large transfer.";
  }
  if (toolId === "age") {
    return isUr
      ? "Age exact DOB se nikalti hai. Official forms pe document wali date use karein."
      : "Age is calculated from the date of birth you enter. For official forms, use the date on your documents.";
  }
  return isUr
    ? "Yeh estimate hai — apne numbers dobara check karein. Bari faisle se pehle qualified advisor se mashwara lein."
    : "This is an estimate — double-check your numbers. For major decisions, consult a qualified advisor.";
}

async function callGemini(
  apiKey: string,
  model: string,
  system: string,
  userPrompt: string
): Promise<{ text: string; status: number; rawErr: string }> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const gRes = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: `${system}\n\n${userPrompt}` }] }],
      generationConfig: {
        temperature: 0.35,
        maxOutputTokens: 512,
        // discourage cut-offs
        stopSequences: [],
      },
    }),
  });

  if (!gRes.ok) {
    const errText = await gRes.text().catch(() => "");
    return { text: "", status: gRes.status, rawErr: errText.slice(0, 300) };
  }

  const data = (await gRes.json()) as {
    candidates?: {
      finishReason?: string;
      content?: { parts?: { text?: string }[] };
    }[];
  };
  const cand = data.candidates?.[0];
  const text =
    cand?.content?.parts?.map((p) => p.text || "").join("").trim() || "";
  // MAX_TOKENS / SAFETY often = incomplete
  if (cand?.finishReason && cand.finishReason !== "STOP") {
    console.error("Gemini finishReason", cand.finishReason, text.slice(0, 80));
  }
  return { text, status: 200, rawErr: "" };
}

export async function POST(req: NextRequest) {
  try {
    const key = clientKey(req);
    if (!rateLimit(key)) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Try again in a minute." },
        { status: 429 }
      );
    }

    let body: Body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
    }

    const toolId = typeof body.toolId === "string" ? body.toolId.trim() : "";
    if (!toolId || !TOOL_ID_RE.test(toolId)) {
      return NextResponse.json({ ok: false, error: "Invalid toolId" }, { status: 400 });
    }

    const inputs = sanitizeInputs(body.inputs);
    const result =
      typeof body.result === "string"
        ? body.result.replace(/[<>]/g, "").slice(0, MAX_RESULT)
        : "";
    const lang = body.lang === "ur" ? "ur" : "en";
    const fb = fallbackAdvice(toolId, inputs, lang);

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ ok: true, source: "fallback", advice: fb });
    }

    const system =
      lang === "ur"
        ? "Tum short financial helper ho. EXACTLY 2 complete sentences in Roman Urdu/English mix. End every reply with a full stop. Never cut mid-sentence. No guarantees."
        : "You are a concise financial helper. Write EXACTLY 2 complete sentences. Always end with a period. Never stop mid-sentence or mid-word. General education only. No guarantees.";

    const userPrompt = [
      `Tool: ${toolId}`,
      `Inputs: ${JSON.stringify(inputs)}`,
      `Result summary: ${result || "(none)"}`,
      "Reply with exactly 2 finished sentences of practical insight. Under 70 words. Must end with a period.",
    ].join("\n");

    const rawModel = (process.env.GEMINI_MODEL || "gemini-3.5-flash").trim();
    const model =
      rawModel.replace(/[^a-zA-Z0-9._-]/g, "").slice(0, 64) || "gemini-3.5-flash";

    // Primary model
    let { text, status, rawErr } = await callGemini(apiKey, model, system, userPrompt);

    // If model fails (404/deprecated), try current Flash models
    const fallbacks = ["gemini-3.5-flash", "gemini-3.6-flash", "gemini-2.5-flash"].filter(
      (m) => m !== model
    );
    if (!text || status !== 200) {
      for (const fbModel of fallbacks) {
        console.error("Gemini primary failed", status, rawErr.slice(0, 120), "trying", fbModel);
        const retry = await callGemini(apiKey, fbModel, system, userPrompt);
        text = retry.text;
        status = retry.status;
        rawErr = retry.rawErr;
        if (text && status === 200) break;
      }
    }

    if (!text || looksIncomplete(text)) {
      console.error("Gemini incomplete/empty", { model, status, preview: text.slice(0, 100), rawErr: rawErr.slice(0, 120) });
      // Always return a COMPLETE tip — never truncated AI fragment
      return NextResponse.json({
        ok: true,
        source: "fallback",
        advice: fb,
      });
    }

    return NextResponse.json({
      ok: true,
      source: "gemini",
      advice: text.replace(/\s+/g, " ").trim().slice(0, 900),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
