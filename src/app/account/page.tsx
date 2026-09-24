"use client";

import { useEffect, useState } from "react";
import { loadProfile, saveProfile, type UserProfile } from "@/lib/profile";
import { useLang } from "@/components/LanguageProvider";

const HISTORY_KEY = "calckit-history";

export default function AccountPage() {
  const { t } = useLang();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  if (!profile) {
    return (
      <div className="wrap tool-page">
        <p className="meta">Loading…</p>
      </div>
    );
  }

  const persist = (next: UserProfile) => {
    setProfile(next);
    saveProfile(next);
  };

  const syncNow = async () => {
    setBusy(true);
    setMsg("");
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      const items = raw ? JSON.parse(raw) : [];
      const res = await fetch("/api/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-device-id": profile.deviceId,
        },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setMsg(data.error || "Sync failed — set Upstash on server");
      } else {
        setMsg(`Synced ${data.count ?? items.length} history items to cloud`);
      }
    } catch {
      setMsg("Network error");
    } finally {
      setBusy(false);
    }
  };

  const pullCloud = async () => {
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/history", {
        headers: { "x-device-id": profile.deviceId },
        cache: "no-store",
      });
      const data = await res.json();
      if (!data.ok) {
        setMsg(data.error || "Pull failed");
        return;
      }
      if (Array.isArray(data.items) && data.items.length) {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(data.items));
        setMsg(`Restored ${data.items.length} items from cloud`);
      } else {
        setMsg(data.hint || "No cloud history yet");
      }
    } catch {
      setMsg("Network error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="wrap tool-page" style={{ maxWidth: 560 }}>
      <div className="tool-head">
        <h1>{t("accountTitle")}</h1>
        <p>{t("accountSub")}</p>
      </div>

      <div className="panel">
        <label>
          {t("name")}
          <input
            type="text"
            maxLength={40}
            value={profile.name}
            placeholder="Optional display name"
            onChange={(e) => persist({ ...profile, name: e.target.value })}
          />
        </label>

        <label style={{ marginTop: 12 }}>
          {t("deviceId")}
          <input type="text" readOnly value={profile.deviceId} />
        </label>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 16,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={profile.cloudSync}
            onChange={(e) =>
              persist({ ...profile, cloudSync: e.target.checked })
            }
          />
          <span>
            {profile.cloudSync ? t("cloudOn") : t("cloudOff")} — uses same
            Upstash Redis as feedback when configured
          </span>
        </label>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18 }}>
          <button type="button" onClick={() => setMsg("Profile saved on this device")}>
            {t("saveProfile")}
          </button>
          <button type="button" className="ghost" disabled={busy} onClick={() => void syncNow()}>
            {t("syncNow")} ↑
          </button>
          <button type="button" className="ghost" disabled={busy} onClick={() => void pullCloud()}>
            Restore ↓
          </button>
        </div>

        {msg ? (
          <p className="meta" style={{ marginTop: 14 }}>
            {msg}
          </p>
        ) : null}
      </div>

      <div className="panel" style={{ marginTop: 16 }}>
        <h2>About optional login</h2>
        <p className="meta">
          Full email/Google login will come in a later update.
          This page gives <strong>device-based cloud history</strong> without
          passwords — enough for most calculator users. Add NextAuth later if
          you need shared accounts across phones with email sign-in.
        </p>
      </div>
    </div>
  );
}
