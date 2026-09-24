"use client";

import { UiIcon } from "./Icon";

import { useEffect, useState } from "react";
import { feedbackSchema, sanitizeText } from "@/lib/validation";

const STORAGE_KEY = "calckit-feedback-v1";
const AGG_KEY = "calckit-feedback-agg-v1";

type Vote = "up" | "down";

type Stored = {
  toolId: string;
  vote: Vote;
  note?: string;
  ts: number;
};

function readMine(toolId: string): Vote | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const map = JSON.parse(raw) as Record<string, Stored>;
    return map[toolId]?.vote ?? null;
  } catch {
    return null;
  }
}

function saveMine(entry: Stored) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const map = (raw ? JSON.parse(raw) : {}) as Record<string, Stored>;
    map[entry.toolId] = entry;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* private mode */
  }
}

function bumpAgg(toolId: string, vote: Vote, prev: Vote | null) {
  try {
    const raw = localStorage.getItem(AGG_KEY);
    const agg = (raw ? JSON.parse(raw) : {}) as Record<
      string,
      { up: number; down: number }
    >;
    if (!agg[toolId]) agg[toolId] = { up: 0, down: 0 };
    if (prev === "up") agg[toolId].up = Math.max(0, agg[toolId].up - 1);
    if (prev === "down") agg[toolId].down = Math.max(0, agg[toolId].down - 1);
    if (vote === "up") agg[toolId].up += 1;
    if (vote === "down") agg[toolId].down += 1;
    localStorage.setItem(AGG_KEY, JSON.stringify(agg));
    return agg[toolId];
  } catch {
    return { up: 0, down: 0 };
  }
}

function readAgg(toolId: string) {
  try {
    const raw = localStorage.getItem(AGG_KEY);
    if (!raw) return { up: 0, down: 0 };
    const agg = JSON.parse(raw) as Record<string, { up: number; down: number }>;
    return agg[toolId] || { up: 0, down: 0 };
  } catch {
    return { up: 0, down: 0 };
  }
}

async function postToServer(payload: Stored): Promise<"ok" | "fail"> {
  try {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return "fail";
    return "ok";
  } catch {
    return "fail";
  }
}

type Props = {
  toolId: string;
  toolTitle?: string;
};

export default function ToolFeedback({ toolId, toolTitle }: Props) {
  const [vote, setVote] = useState<Vote | null>(null);
  const [counts, setCounts] = useState({ up: 0, down: 0 });
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "thanks" | "offline">(
    "idle"
  );

  useEffect(() => {
    setVote(readMine(toolId));
    setCounts(readAgg(toolId));
  }, [toolId]);

  const submit = async (next: Vote) => {
    const prev = vote;
    if (prev === next || status === "saving") return;

    const payload = {
      toolId,
      vote: next,
      note: sanitizeText(note, 300),
      ts: Date.now(),
    };

    const parsed = feedbackSchema.safeParse(payload);
    if (!parsed.success) return;

    const data = parsed.data as Stored;
    setStatus("saving");
    saveMine(data);
    const c = bumpAgg(toolId, next, prev);
    setVote(next);
    setCounts(c);
    setShowNote(next === "down");

    const server = await postToServer(data);
    setStatus(server === "ok" ? "thanks" : "offline");
    setTimeout(() => setStatus("idle"), 2800);
  };

  const saveNote = async () => {
    if (!vote || status === "saving") return;
    const payload = {
      toolId,
      vote,
      note: sanitizeText(note, 300),
      ts: Date.now(),
    };
    const parsed = feedbackSchema.safeParse(payload);
    if (!parsed.success) return;
    setStatus("saving");
    saveMine(parsed.data as Stored);
    const server = await postToServer(parsed.data as Stored);
    setShowNote(false);
    setStatus(server === "ok" ? "thanks" : "offline");
    setTimeout(() => setStatus("idle"), 2800);
  };

  return (
    <div className="tool-feedback" role="group" aria-label="Was this helpful?">
      <div className="tool-feedback__row">
        <span className="tool-feedback__label">
          {toolTitle ? `${toolTitle} — ` : ""}Was this helpful?
        </span>
        <button
          type="button"
          className={`tool-feedback__btn ${vote === "up" ? "is-active is-up" : ""}`}
          onClick={() => void submit("up")}
          aria-pressed={vote === "up"}
          disabled={status === "saving"}
          title="Helpful"
        >
          <UiIcon name="thumbs-up" size={18} />
          {counts.up > 0 ? (
            <span className="tool-feedback__count">{counts.up}</span>
          ) : null}
        </button>
        <button
          type="button"
          className={`tool-feedback__btn ${vote === "down" ? "is-active is-down" : ""}`}
          onClick={() => void submit("down")}
          aria-pressed={vote === "down"}
          disabled={status === "saving"}
          title="Needs improvement"
        >
          <UiIcon name="thumbs-down" size={18} />
          {counts.down > 0 ? (
            <span className="tool-feedback__count">{counts.down}</span>
          ) : null}
        </button>
        {!showNote && (
          <button
            type="button"
            className="tool-feedback__link tool-feedback__note-btn"
            onClick={() => setShowNote(true)}
          >
            <UiIcon name="file-text" size={16} />
            <span>Add note</span>
          </button>
        )}
      </div>

      {showNote && (
        <div className="tool-feedback__note">
          <label htmlFor={`fb-note-${toolId}`}>Optional feedback</label>
          <textarea
            id={`fb-note-${toolId}`}
            rows={2}
            maxLength={300}
            placeholder="What can we improve?"
            value={note}
            onChange={(e) => setNote(sanitizeText(e.target.value, 300))}
          />
          <div className="tool-feedback__note-actions">
            <button
              type="button"
              className="btn-action"
              onClick={() => void saveNote()}
              disabled={status === "saving"}
            >
              {status === "saving" ? "Saving…" : "Save note"}
            </button>
            <button
              type="button"
              className="tool-feedback__link"
              onClick={() => setShowNote(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {status === "thanks" && (
        <p className="tool-feedback__thanks" role="status">
          Thanks — feedback saved.
        </p>
      )}
      {status === "offline" && (
        <p className="tool-feedback__thanks tool-feedback__thanks--warn" role="status">
          Saved on this device. Server sync failed (check connection / storage).
        </p>
      )}
    </div>
  );
}
