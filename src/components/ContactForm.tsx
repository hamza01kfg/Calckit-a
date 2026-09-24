"use client";

import { useState, FormEvent } from "react";
import { useLang } from "./LanguageProvider";

const EMAILJS_SERVICE_ID = "service_mmt882l";
const EMAILJS_TEMPLATE_ID = "template_rqvrxoh";
const EMAILJS_PUBLIC_KEY = "q_cI26sBuHJYeJ7OG";

export default function ContactForm() {
  const { t } = useLang();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setStatus("sending");
    try {
      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: {
            from_name: name,
            from_email: email,
            message,
            reply_to: email,
          },
        }),
      });
      if (!res.ok) throw new Error("fail");
      setStatus("ok");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("err");
    }
  };

  return (
    <form onSubmit={onSubmit} className="panel" style={{ maxWidth: 520 }}>
      <label>{t("name")}</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="Your name"
      />
      <label>{t("email")}</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="you@email.com"
      />
      <label>{t("message")}</label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        rows={5}
        placeholder="Your message…"
        style={{
          width: "100%",
          border: "1px solid var(--line)",
          borderRadius: 12,
          padding: "12px 14px",
          font: "inherit",
          marginBottom: 14,
          resize: "vertical",
        }}
      />
      <button type="submit" disabled={status === "sending"} style={{ width: "100%" }}>
        {status === "sending" ? t("sending") : t("sendMessage")}
      </button>
      {status === "ok" && (
        <p style={{ marginTop: 12, color: "var(--ok)" }}>{t("sent")}</p>
      )}
      {status === "err" && (
        <p style={{ marginTop: 12, color: "var(--warn)" }}>{t("sendError")}</p>
      )}
    </form>
  );
}
