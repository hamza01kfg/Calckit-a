"use client";

import { UiIcon } from "../Icon";

import { useState } from "react";

export type PdfTableColumn = { key: string; label: string };
export type PdfTableRow = Record<string, string | number>;

type Props = {
  copyText: string;
  shareParams?: Record<string, string | number>;
  path?: string;
  /** Optional CSV rows: header + data lines */
  csvRows?: string[][];
  pdfTitle?: string;
  /** Optional structured rows for prettier PDF card */
  pdfRows?: { label: string; value: string }[];
  pdfHeadline?: { label: string; value: string };
  /** Optional full table (e.g. amortization schedule) */
  pdfTable?: {
    columns: PdfTableColumn[];
    rows: PdfTableRow[];
    caption?: string;
  };
};

function downloadBlob(filename: string, content: string | Blob, mime?: string) {
  const blob =
    content instanceof Blob ? content : new Blob([content], { type: mime || "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

/** Draw premium glass result card → PNG (no external libs) */
function renderResultCardPng(opts: {
  title: string;
  headlineLabel?: string;
  headlineValue?: string;
  rows?: { label: string; value: string }[];
  footerNote?: string;
}): Promise<Blob> {
  const dpr = Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio || 1 : 2);
  const width = 720;
  const pad = 36;
  const rows = opts.rows || [];
  const hasHero = !!(opts.headlineLabel || opts.headlineValue);

  // Dynamic height
  let contentH = 56; // title
  if (hasHero) contentH += 110;
  contentH += rows.length * 56 + (rows.length ? 16 : 0);
  contentH += 48; // footer
  const height = pad * 2 + contentH + 40;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);

  // Background
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, "#05080f");
  bg.addColorStop(0.5, "#0a1220");
  bg.addColorStop(1, "#071018");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Soft glow behind card
  const glow = ctx.createRadialGradient(width * 0.7, 80, 10, width * 0.65, 100, 280);
  glow.addColorStop(0, "rgba(45, 212, 191, 0.18)");
  glow.addColorStop(1, "rgba(45, 212, 191, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // Card
  const cx = 28;
  const cy = 28;
  const cw = width - 56;
  const ch = height - 56;
  roundRect(ctx, cx, cy, cw, ch, 24);
  const cardGrad = ctx.createLinearGradient(cx, cy, cx + cw, cy + ch);
  cardGrad.addColorStop(0, "rgba(18, 28, 36, 0.96)");
  cardGrad.addColorStop(1, "rgba(12, 20, 32, 0.98)");
  ctx.fillStyle = cardGrad;
  ctx.fill();
  ctx.strokeStyle = "rgba(45, 212, 191, 0.35)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Inner top glow line
  ctx.save();
  roundRect(ctx, cx, cy, cw, ch, 24);
  ctx.clip();
  const topGlow = ctx.createLinearGradient(cx, cy, cx, cy + 120);
  topGlow.addColorStop(0, "rgba(45, 212, 191, 0.08)");
  topGlow.addColorStop(1, "rgba(45, 212, 191, 0)");
  ctx.fillStyle = topGlow;
  ctx.fillRect(cx, cy, cw, 120);
  ctx.restore();

  let y = cy + 28;

  // Badge + title
  roundRect(ctx, cx + 24, y, 36, 36, 10);
  const badgeGrad = ctx.createLinearGradient(cx + 24, y, cx + 60, y + 36);
  badgeGrad.addColorStop(0, "#0d9488");
  badgeGrad.addColorStop(1, "#0f766e");
  ctx.fillStyle = badgeGrad;
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 18px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("∑", cx + 42, y + 19);

  ctx.textAlign = "left";
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "600 16px system-ui, sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText(opts.title, cx + 72, y + 18);
  y += 52;

  // Hero
  if (hasHero) {
    roundRect(ctx, cx + 24, y, cw - 48, 96, 16);
    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
    ctx.fill();
    ctx.strokeStyle = "rgba(45, 212, 191, 0.15)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#94a3b8";
    ctx.font = "500 13px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(opts.headlineLabel || "Result", cx + 40, y + 18);

    ctx.fillStyle = "#5eead4";
    ctx.font = "600 36px ui-monospace, 'IBM Plex Mono', monospace";
    ctx.fillText(opts.headlineValue || "—", cx + 40, y + 42);
    y += 112;
  }

  // Rows
  for (const row of rows) {
    roundRect(ctx, cx + 24, y, cw - 48, 48, 12);
    ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#94a3b8";
    ctx.font = "500 14px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(row.label, cx + 40, y + 24);

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "600 14px ui-monospace, monospace";
    ctx.textAlign = "right";
    ctx.fillText(row.value, cx + cw - 40, y + 24);
    y += 56;
  }

  // Footer
  y = cy + ch - 36;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.beginPath();
  ctx.moveTo(cx + 24, y - 12);
  ctx.lineTo(cx + cw - 24, y - 12);
  ctx.stroke();

  ctx.fillStyle = "#64748b";
  ctx.font = "500 11px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  const dateStr = new Date().toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
  ctx.fillText(dateStr, cx + 24, y);
  ctx.textAlign = "right";
  ctx.fillText(opts.footerNote || "CalcKit · Estimates only", cx + cw - 24, y);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("PNG failed"));
      },
      "image/png",
      1
    );
  });
}

export default function ResultActions({
  copyText,
  shareParams,
  path,
  csvRows,
  pdfTitle = "CalcKit Result",
  pdfRows,
  pdfHeadline,
  pdfTable,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [msg, setMsg] = useState("");
  const [pngBusy, setPngBusy] = useState(false);

  const fileBase = `calckit-${(path || "result").replace(/\//g, "") || "result"}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setMsg("Copied!");
      setTimeout(() => {
        setCopied(false);
        setMsg("");
      }, 1500);
    } catch {
      setMsg("Copy failed");
    }
  };

  const share = async () => {
    const base = typeof window !== "undefined" ? window.location.origin : "";
    const p = path || (typeof window !== "undefined" ? window.location.pathname : "");
    const q = shareParams
      ? "?" +
        new URLSearchParams(
          Object.entries(shareParams).map(([k, v]) => [k, String(v)])
        ).toString()
      : "";
    const url = `${base}${p}${q}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "CalcKit", url, text: copyText });
        return;
      } catch {
        /* fall through */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setMsg("Link copied!");
      setTimeout(() => setMsg(""), 1500);
    } catch {
      setMsg("Share failed");
    }
  };

  const downloadCsv = () => {
    const rows =
      csvRows && csvRows.length > 0
        ? csvRows
        : copyText.split("\n").map((line) => [line]);
    const csv = rows
      .map((r) =>
        r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
    downloadBlob(`${fileBase}.csv`, csv, "text/csv;charset=utf-8");
    setMsg("CSV downloaded");
    setTimeout(() => setMsg(""), 1500);
  };

  const downloadPng = async () => {
    setPngBusy(true);
    setMsg("Creating PNG…");
    try {
      const rows =
        pdfRows && pdfRows.length > 0
          ? pdfRows
          : copyText
              .split("\n")
              .filter(Boolean)
              .map((line) => {
                const i = line.indexOf(":");
                if (i > 0) {
                  return {
                    label: line.slice(0, i).trim(),
                    value: line.slice(i + 1).trim(),
                  };
                }
                return { label: "", value: line };
              });

      const blob = await renderResultCardPng({
        title: pdfTitle,
        headlineLabel: pdfHeadline?.label,
        headlineValue: pdfHeadline?.value,
        rows,
        footerNote: "CalcKit · Estimates only",
      });
      downloadBlob(`${fileBase}.png`, blob);
      setMsg("PNG downloaded");
    } catch {
      setMsg("PNG failed");
    } finally {
      setPngBusy(false);
      setTimeout(() => setMsg(""), 2000);
    }
  };

  const downloadPdf = () => {
    const w = window.open("", "_blank", "width=900,height=1100");
    if (!w) {
      setMsg("Allow popups for PDF");
      return;
    }

    const dateStr = new Date().toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });

    let bodyHtml = "";
    if (pdfHeadline || (pdfRows && pdfRows.length > 0)) {
      const hero = pdfHeadline
        ? `<div class="hero">
            <div class="hero-label">${escapeHtml(pdfHeadline.label)}</div>
            <div class="hero-value">${escapeHtml(pdfHeadline.value)}</div>
          </div>`
        : "";
      const rows =
        pdfRows && pdfRows.length
          ? `<div class="grid">${pdfRows
              .map(
                (r) =>
                  `<div class="stat"><span class="stat-label">${escapeHtml(
                    r.label
                  )}</span><span class="stat-value">${escapeHtml(
                    r.value
                  )}</span></div>`
              )
              .join("")}</div>`
          : "";
      bodyHtml = hero + rows;
    } else {
      bodyHtml = `<div class="plain">${escapeHtml(copyText).replace(
        /\n/g,
        "<br/>"
      )}</div>`;
    }

    let tableHtml = "";
    if (pdfTable && pdfTable.rows.length > 0) {
      const cols = pdfTable.columns;
      const thead = cols
        .map((c) => `<th>${escapeHtml(c.label)}</th>`)
        .join("");
      const tbody = pdfTable.rows
        .map((row) => {
          const cells = cols
            .map((c) => {
              const v = row[c.key];
              const isNum =
                typeof v === "number" ||
                (typeof v === "string" && /^[\d,.\s₹%-]+$/.test(v));
              return `<td class="${isNum ? "num" : ""}">${escapeHtml(
                String(v ?? "")
              )}</td>`;
            })
            .join("");
          return `<tr>${cells}</tr>`;
        })
        .join("");
      const caption = pdfTable.caption
        ? `<div class="table-caption">${escapeHtml(pdfTable.caption)}</div>`
        : "";
      tableHtml = `
        <div class="table-block">
          ${caption}
          <div class="table-scroll">
            <table>
              <thead><tr>${thead}</tr></thead>
              <tbody>${tbody}</tbody>
            </table>
          </div>
        </div>`;
    }

    const wide = pdfTable ? "page page--wide" : "page";

    w.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>${escapeHtml(pdfTitle)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap" rel="stylesheet"/>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: "Sora", system-ui, sans-serif;
      background: linear-gradient(165deg, #0a0e0c 0%, #0f172a 45%, #0a1628 100%);
      color: #e8f0ed;
      min-height: 100vh;
      padding: 32px 20px 48px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page { max-width: 520px; margin: 0 auto; }
    .page--wide { max-width: 780px; }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 22px;
    }
    .logo {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      display: grid;
      place-items: center;
      background: linear-gradient(145deg, #0d9488, #0f766e);
      color: #fff;
      font-weight: 700;
      font-size: 18px;
      box-shadow: 0 4px 16px rgba(13, 148, 136, 0.4);
    }
    .brand-text { font-weight: 700; font-size: 1.15rem; letter-spacing: -0.02em; }
    .brand-sub { font-size: 12px; color: #8a9691; margin-top: 2px; }
    .card {
      background: linear-gradient(160deg, rgba(18, 25, 22, 0.95), rgba(15, 23, 42, 0.92));
      border: 1px solid rgba(45, 212, 191, 0.22);
      border-radius: 24px;
      padding: 26px 24px 22px;
      box-shadow:
        0 0 0 1px rgba(255,255,255,0.04) inset,
        0 24px 60px rgba(0,0,0,0.45),
        0 0 40px rgba(13, 148, 136, 0.12);
      position: relative;
      overflow: hidden;
    }
    .card::before {
      content: "";
      position: absolute;
      top: -40%;
      right: -20%;
      width: 70%;
      height: 70%;
      background: radial-gradient(circle, rgba(45, 212, 191, 0.12), transparent 65%);
      pointer-events: none;
    }
    .card-title {
      font-size: 11px;
      font-weight: 650;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #2dd4bf;
      margin-bottom: 16px;
      position: relative;
    }
    .hero {
      background: rgba(0,0,0,0.35);
      border: 1px solid rgba(45, 212, 191, 0.15);
      border-radius: 16px;
      padding: 18px 16px;
      margin-bottom: 16px;
      position: relative;
    }
    .hero-label { font-size: 12px; color: #8a9691; margin-bottom: 6px; font-weight: 500; }
    .hero-value {
      font-family: "IBM Plex Mono", ui-monospace, monospace;
      font-size: 1.75rem;
      font-weight: 600;
      color: #5eead4;
      letter-spacing: -0.02em;
      line-height: 1.2;
    }
    .grid { display: grid; gap: 8px; position: relative; }
    .stat {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 11px 13px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 12px;
    }
    .stat-label { font-size: 13px; color: #94a3b8; }
    .stat-value {
      font-family: "IBM Plex Mono", ui-monospace, monospace;
      font-size: 13.5px;
      font-weight: 600;
      color: #e2e8f0;
      text-align: right;
    }
    .plain {
      font-size: 14px;
      line-height: 1.7;
      color: #cbd5e1;
      position: relative;
      white-space: pre-wrap;
    }
    .table-block { margin-top: 22px; position: relative; }
    .table-caption {
      font-size: 11px;
      font-weight: 650;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #2dd4bf;
      margin-bottom: 10px;
    }
    .table-scroll { overflow-x: auto; border-radius: 14px; border: 1px solid rgba(255,255,255,0.08); }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11.5px;
      font-family: "IBM Plex Mono", ui-monospace, monospace;
    }
    thead th {
      background: rgba(45, 212, 191, 0.12);
      color: #5eead4;
      font-weight: 600;
      text-align: right;
      padding: 10px 12px;
      border-bottom: 1px solid rgba(45, 212, 191, 0.2);
      white-space: nowrap;
    }
    thead th:first-child { text-align: left; }
    tbody td {
      padding: 8px 12px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      color: #cbd5e1;
      text-align: right;
      white-space: nowrap;
    }
    tbody td:first-child { text-align: left; color: #94a3b8; }
    tbody td.num { font-variant-numeric: tabular-nums; }
    tbody tr:nth-child(even) { background: rgba(255,255,255,0.02); }
    .meta {
      margin-top: 18px;
      padding-top: 14px;
      border-top: 1px solid rgba(255,255,255,0.08);
      display: flex;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
      font-size: 11px;
      color: #64748b;
      position: relative;
    }
    .foot {
      margin-top: 24px;
      text-align: center;
      font-size: 11px;
      color: #64748b;
      line-height: 1.5;
    }
    .foot strong { color: #2dd4bf; font-weight: 600; }
    @media print {
      body { background: #0a0e0c; padding: 12px; }
      .card { box-shadow: none; }
      tbody tr { page-break-inside: avoid; }
      thead { display: table-header-group; }
    }
  </style>
</head>
<body>
  <div class="${wide}">
    <div class="brand">
      <div class="logo">∑</div>
      <div>
        <div class="brand-text">CalcKit</div>
        <div class="brand-sub">Free online calculators</div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">${escapeHtml(pdfTitle)}</div>
      ${bodyHtml}
      ${tableHtml}
      <div class="meta">
        <span>${escapeHtml(dateStr)}</span>
        <span>Estimates only · not advice</span>
      </div>
    </div>
    <div class="foot">
      Generated by <strong>CalcKit</strong> · Share this result from the tool page
    </div>
  </div>
  <script>window.onload=function(){setTimeout(function(){window.print()},220)}<\/script>
</body>
</html>`);
    w.document.close();
    setMsg("Print / Save as PDF");
    setTimeout(() => setMsg(""), 2200);
  };

  return (
    <div className="result-actions">
      <button type="button" className="btn-action" onClick={copy} title="Copy summary">
        {copied ? "✓ Copied" : (<><UiIcon name="copy" size={16} /> Copy</>)}
      </button>
      <button type="button" className="btn-action" onClick={share} title="Share link">
        <><UiIcon name="share" size={16} /> Share</>
      </button>
      <button
        type="button"
        className="btn-action btn-action--primary"
        onClick={downloadPdf}
        title="Download PDF"
      >
        <><UiIcon name="download-pdf" size={16} /> PDF</>
      </button>
      <button
        type="button"
        className="btn-action"
        onClick={downloadPng}
        disabled={pngBusy}
        title="Download PNG image of result card"
      >
        {pngBusy ? "…" : "🖼 PNG"}
      </button>
      <button type="button" className="btn-action ghost" onClick={downloadCsv} title="Download CSV">
        CSV
      </button>
      {msg ? <span className="action-msg">{msg}</span> : null}
    </div>
  );
}
