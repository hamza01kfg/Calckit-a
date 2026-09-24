"use client";

import { useEffect } from "react";

/** Loads GA4 only when NEXT_PUBLIC_GA_MEASUREMENT_ID is set (G-XXXXXXXX). */
export default function Analytics() {
  useEffect(() => {
    const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    if (!gaId || !gaId.startsWith("G-")) return;
    if (document.getElementById("ga4-src")) return;

    const s = document.createElement("script");
    s.id = "ga4-src";
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(s);

    const inline = document.createElement("script");
    inline.id = "ga4-init";
    inline.text = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}', { anonymize_ip: true });
    `;
    document.head.appendChild(inline);
  }, []);

  return null;
}
