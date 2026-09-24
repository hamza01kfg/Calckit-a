"use client";

import { useCallback, useEffect, useState } from "react";

export type HistoryItem = {
  id: string;
  tool: string;
  title: string;
  summary: string;
  href: string;
  at: number;
};

const KEY = "calckit-history";

export function useCalcHistory() {
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const push = useCallback((item: Omit<HistoryItem, "id" | "at">) => {
    setItems((prev) => {
      const next: HistoryItem[] = [
        { ...item, id: `${Date.now()}`, at: Date.now() },
        ...prev.filter((x) => x.href !== item.href || x.summary !== item.summary),
      ].slice(0, 5);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    localStorage.removeItem(KEY);
  }, []);

  return { items, push, clear };
}
