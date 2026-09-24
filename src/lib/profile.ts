export type UserProfile = {
  name: string;
  deviceId: string;
  cloudSync: boolean;
};

const KEY = "calckit-profile-v1";

function newId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `dev-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw) as UserProfile;
      if (p?.deviceId) return p;
    }
  } catch {
    /* ignore */
  }
  const fresh: UserProfile = { name: "", deviceId: newId(), cloudSync: false };
  try {
    localStorage.setItem(KEY, JSON.stringify(fresh));
  } catch {
    /* ignore */
  }
  return fresh;
}

export function saveProfile(p: UserProfile) {
  localStorage.setItem(KEY, JSON.stringify(p));
}
