import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/ai-advisor
 * Body: { toolId, inputs, result, lang? }
 * GEMINI_API_KEY must live only in server env (.env.local) — never in client code.
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

// simple in-memory rate limit (per server instance)
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
    if (typeof v === "number" && Number.isFinite(v)) {
      out[key] = v;
    } else if (typeof v === "string") {
      out[key] = v.replace(/[<>]/g, "").slice(0, 80);
    }
    i++;
  }
  return out;
}

function fallbackAdvice(toolId: string, inputs: Record<string, string | number>, lang: string): string {
  const isUr = lang === "ur";
  if (toolId === "emi" || toolId === "loan") {
    return isUr
      ? "Agar mumkin ho to monthly payment thora barhaein — total interest kam ho sakta hai aur loan jaldi khatam. Extra payment pehle principal par lagaye."
      : "If possible, raise the monthly payment slightly — total interest often drops and the loan finishes sooner. Apply extra payments to principal first.";
  }
  if (toolId === "sip" || toolId === "compound") {
    return isUr
      ? "Waqt aur regularity compound growth ka asasi hissa hain. Amount thora barha kar long horizon rakhna aksar behtar result deta hai."
      : "Time and consistency drive compound growth. A slightly higher contribution over a longer horizon usually helps more than chasing returns.";
  }
  return isUr
    ? "Yeh estimate hai — apne numbers dobara check karein. Bari faisle se pehle financial advisor se mashwara lein."
    : "This is an estimate — double-check your numbers. For major decisions, consult a qualified advisor.";
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

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      // No key: still return useful offline tip (never leak env errors to client beyond this)
      return NextResponse.json({
        ok: true,
        source: "fallback",
        advice: fallbackAdvice(toolId, inputs, lang),
      });
    }

    const system =
      lang === "ur"
        ? "Tum ek short financial helper ho. 2-3 jumle Roman Urdu/English mix mein do. Koi guarantee mat do. Sirf general education."
        : "You are a concise financial helper. Give 2-3 short sentences of general education only. No guarantees. No investment solicitation.";

    const userPrompt = [
      `Tool: ${toolId}`,
      `Inputs: ${JSON.stringify(inputs)}`,
      `Result summary: ${result || "(none)"}`,
      "Give one practical insight (e.g. effect of higher payment, longer tenure, or SIP increase). Keep under 60 words.",
    ].join("\n");

    // Gemini REST (v1beta) — model can be overridden via env
    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const gRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: `${system}\n\n${userPrompt}` }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 180,
        },
      }),
    });

    if (!gRes.ok) {
      const errText = await gRes.text().catch(() => "");
      console.error("Gemini error", gRes.status, errText.slice(0, 200));
      return NextResponse.json({
        ok: true,
        source: "fallback",
        advice: fallbackAdvice(toolId, inputs, lang),
      });
    }

    const data = (await gRes.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("").trim() ||
      "";

    if (!text) {
      return NextResponse.json({
        ok: true,
        source: "fallback",
        advice: fallbackAdvice(toolId, inputs, lang),
      });
    }

    return NextResponse.json({
      ok: true,
      source: "gemini",
      advice: text.slice(0, 600),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
