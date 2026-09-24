"use client";

import type { ReactNode } from "react";
import { LanguageProvider } from "./LanguageProvider";
import { ThemeProvider } from "./ThemeProvider";
import Header from "./Header";
import Footer from "./Footer";
import HistoryBar from "./HistoryBar";
import PwaRegister from "./PwaRegister";
import Analytics from "./Analytics";
import TrafficBeacon from "./TrafficBeacon";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Header />
        <main>{children}</main>
        <HistoryBar />
        <Footer />
        <PwaRegister />
        <Analytics />
        <TrafficBeacon />
      </LanguageProvider>
    </ThemeProvider>
  );
}
