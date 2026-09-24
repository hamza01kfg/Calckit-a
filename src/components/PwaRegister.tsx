"use client";

import { useEffect, useState } from "react";

export default function PwaRegister() {
  const [deferred, setDeferred] = useState<any>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Never register SW in development — breaks HMR / webpack chunks
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch(() => {});

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onBip);
    return () => window.removeEventListener("beforeinstallprompt", onBip);
  }, []);

  if (!show || !deferred) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        left: 16,
        right: 16,
        maxWidth: 420,
        margin: "0 auto",
        zIndex: 9999,
        background: "var(--ink, #0a0e0c)",
        color: "#fff",
        padding: "12px 16px",
        borderRadius: 12,
        display: "flex",
        gap: 10,
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 8px 24px rgba(0,0,0,.25)",
      }}
    >
      <span style={{ fontSize: 14 }}>Install CalcKit App?</span>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          style={{ padding: "6px 12px", borderRadius: 8, border: 0, cursor: "pointer" }}
          onClick={() => setShow(false)}
        >
          Later
        </button>
        <button
          type="button"
          style={{
            padding: "6px 12px",
            borderRadius: 8,
            border: 0,
            cursor: "pointer",
            background: "#0d9488",
            color: "#fff",
          }}
          onClick={async () => {
            deferred.prompt();
            setShow(false);
            setDeferred(null);
          }}
        >
          Install
        </button>
      </div>
    </div>
  );
}
