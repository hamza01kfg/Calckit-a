"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Lightweight pageview ping for admin traffic panel */
export default function TrafficBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    const t = window.setTimeout(() => {
      fetch("/api/traffic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: pathname }),
        keepalive: true,
      }).catch(() => {});
    }, 800);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return null;
}
