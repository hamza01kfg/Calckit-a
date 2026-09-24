"use client";

import { useEffect, useState } from "react";
import { fmt } from "@/lib/calculators";
import CalculatorShell from "@/components/CalculatorShell";
import ResultCard from "@/components/ui/ResultCard";
import ResultActions from "@/components/ui/ResultActions";

const CODES = [
  "USD", "EUR", "GBP", "PKR", "INR", "AED", "SAR", "CAD", "AUD", "JPY",
  "CNY", "TRY", "CHF", "NZD", "SGD", "MYR", "THB", "BDT", "KWD", "QAR",
];

type RatesPayload = {
  base: string;
  rates: Record<string, number>;
  updated?: string;
  source?: string;
};

const cache = new Map<string, { at: number; data: RatesPayload }>();
const CACHE_MS = 60 * 60 * 1000; // 1 hour

async function fetchRates(base: string): Promise<RatesPayload> {
  const hit = cache.get(base);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.data;

  // Primary: open.er-api.com (no key)
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${base}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.rates) {
        const payload: RatesPayload = {
          base,
          rates: data.rates,
          updated: data.time_last_update_utc || data.time_last_update_unix,
          source: "open.er-api.com",
        };
        cache.set(base, { at: Date.now(), data: payload });
        return payload;
      }
    }
  } catch {
    /* fall through */
  }

  // Fallback: Frankfurter (ECB)
  const res2 = await fetch(
    `https://api.frankfurter.app/latest?from=${encodeURIComponent(base)}`,
    { cache: "no-store" }
  );
  if (!res2.ok) throw new Error("rates unavailable");
  const data2 = await res2.json();
  const payload: RatesPayload = {
    base,
    rates: { ...(data2.rates || {}), [base]: 1 },
    updated: data2.date,
    source: "frankfurter.app (ECB)",
  };
  cache.set(base, { at: Date.now(), data: payload });
  return payload;
}

export default function CurrencyPage() {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("PKR");
  const [amount, setAmount] = useState(100);
  const [out, setOut] = useState("…");
  const [meta, setMeta] = useState("");
  const [rateStr, setRateStr] = useState("");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setOut("…");
      try {
        const data = await fetchRates(from);
        const rate = data.rates[to];
        if (rate == null || !Number.isFinite(rate)) {
          throw new Error("pair missing");
        }
        const val = amount * rate;
        if (!cancelled) {
          setOut(`${fmt(val, 2)} ${to}`);
          setMeta(`1 ${from} = ${fmt(rate, 4)} ${to}`);
          setRateStr(fmt(rate, 4));
          setSource(
            [data.source, data.updated ? `updated ${data.updated}` : ""]
              .filter(Boolean)
              .join(" · ")
          );
        }
      } catch {
        if (!cancelled) {
          setOut("Offline");
          setMeta("Live rates need internet. Try again when online.");
          setRateStr("");
          setSource("");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    const t = setTimeout(run, 280);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [from, to, amount]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <CalculatorShell
      title="Currency Converter"
      description="Live mid-market rates with automatic fallback API. Cached 1 hour in-session."
      toolId="currency"
      result={
        <ResultCard
          title="Currency Conversion Result"
          headlineLabel={loading ? "Updating…" : "Converted Amount"}
          headlineValue={out}
          metaLine={meta || `${amount} ${from} → ${to}`}
          breakdown={[
            { label: "Amount", value: `${fmt(amount)} ${from}`, icon: "¤" },
            { label: "From → To", value: `${from} → ${to}`, icon: "↔" },
            {
              label: "Rate",
              value: rateStr ? `1 ${from} = ${rateStr} ${to}` : "—",
              icon: "%",
            },
          ]}
          actions={
            <ResultActions
              copyText={`${amount} ${from} = ${out}\n${meta}\n${source}`}
              path="/currency"
              shareParams={{ from, to, amount }}
              pdfTitle="Currency Conversion Result"
            />
          }
        />
      }
    >
      <h2>Convert</h2>
      <label>
        Amount
        <input
          type="number"
          min={0}
          step="any"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value) || 0)}
        />
      </label>
      <div className="row">
        <label>
          From
          <select value={from} onChange={(e) => setFrom(e.target.value)}>
            {CODES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label>
          To
          <select value={to} onChange={(e) => setTo(e.target.value)}>
            {CODES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button type="button" className="ghost" onClick={swap} style={{ marginTop: 8 }}>
        Swap currencies ↔
      </button>
      {source ? (
        <p className="meta" style={{ marginTop: 12 }}>
          Source: {source}
        </p>
      ) : null}
    </CalculatorShell>
  );
}
