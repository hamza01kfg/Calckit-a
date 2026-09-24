/**
 * Input validation for CalcKit.
 * Uses Zod when available; falls back to pure JS so the app never crashes
 * if node_modules is incomplete.
 */

const XSS_RE = /[<>]|javascript:|on\w+\s*=|data:\s*text\/html/i;

/** Sanitize plain text — strip tags and control chars */
export function sanitizeText(input: unknown, maxLen = 200): string {
  if (input == null) return "";
  let s = String(input);
  if (XSS_RE.test(s)) {
    s = s.replace(/[<>]/g, "").replace(/javascript:/gi, "");
  }
  s = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
  return s.slice(0, maxLen).trim();
}

export type NumberSchemaOpts = {
  min?: number;
  max?: number;
  defaultValue?: number;
};

function coerceNumber(input: unknown): number {
  if (typeof input === "number") return input;
  if (typeof input === "string") {
    const cleaned = input.replace(/[^\d.+\-eE]/g, "").trim();
    if (
      cleaned === "" ||
      cleaned === "-" ||
      cleaned === "." ||
      cleaned === "+"
    ) {
      return NaN;
    }
    return Number(cleaned);
  }
  return NaN;
}

/** Validate / clamp numeric calculator inputs */
export function parseSafeNumber(
  input: unknown,
  opts: NumberSchemaOpts = {}
): number {
  const min = opts.min ?? -Number.MAX_SAFE_INTEGER;
  const max = opts.max ?? Number.MAX_SAFE_INTEGER;
  const fallback =
    opts.defaultValue ?? (Number.isFinite(min) && min > -1e15 ? min : 0);

  let n = coerceNumber(input);
  if (!Number.isFinite(n)) return fallback;
  if (n < min) n = min;
  if (n > max) n = max;
  return n;
}

export type NumberSchema = NumberSchemaOpts;

export type FeedbackPayload = {
  toolId: string;
  vote: "up" | "down";
  note: string;
  ts: number;
};

const TOOL_ID_RE = /^[a-z0-9\-]+$/i;

/** Validate feedback payload (Zod-compatible shape, pure JS) */
export function parseFeedback(input: unknown):
  | { success: true; data: FeedbackPayload }
  | { success: false; error: string } {
  if (!input || typeof input !== "object") {
    return { success: false, error: "Invalid body" };
  }
  const o = input as Record<string, unknown>;
  const toolId = typeof o.toolId === "string" ? o.toolId.trim() : "";
  if (!toolId || toolId.length > 64 || !TOOL_ID_RE.test(toolId)) {
    return { success: false, error: "Invalid toolId" };
  }
  if (o.vote !== "up" && o.vote !== "down") {
    return { success: false, error: "Invalid vote" };
  }
  const note = sanitizeText(o.note ?? "", 300);
  const ts =
    typeof o.ts === "number" && Number.isFinite(o.ts) && o.ts > 0
      ? Math.floor(o.ts)
      : Date.now();

  return {
    success: true,
    data: { toolId, vote: o.vote, note, ts },
  };
}

/** @deprecated use parseFeedback — kept for ToolFeedback imports */
export const feedbackSchema = {
  safeParse(input: unknown) {
    const r = parseFeedback(input);
    if (r.success) return { success: true as const, data: r.data };
    return {
      success: false as const,
      error: { message: r.error },
    };
  },
};
