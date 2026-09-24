"use client";

/** Production-only external ad scripts. Keep out of React-managed calc tree. */
export default function AdLoader() {
  // Intentionally empty in this stable build.
  // Enable real network ads later with a dedicated layout portal + NEXT_PUBLIC_ADS=1.
  return null;
}
