"use client";

import type { ReactNode } from "react";
import { LanguageProvider, useLang } from "./LanguageProvider";
import { ThemeProvider } from "./ThemeProvider";
import Header from "./Header";
import Footer from "./Footer";
import HistoryBar from "./HistoryBar";
import PwaRegister from "./PwaRegister";
import Analytics from "./Analytics";
import TrafficBeacon from "./TrafficBeacon";

function ContentWrapper({ children }: { children: ReactNode }) {
  const { dir } = useLang();
  return <main dir={dir}>{children}</main>;
}

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Header />
        <ContentWrapper>{children}</ContentWrapper>
        <HistoryBar />
        <Footer />
        <PwaRegister />
        <Analytics />
        <TrafficBeacon />
      </LanguageProvider>
    </ThemeProvider>
  );
}
