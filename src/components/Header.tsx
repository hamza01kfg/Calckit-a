"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "./LanguageProvider";
import SearchModal from "./SearchModal";
import { useTheme } from "./ThemeProvider";
import { BrandLogo, UiIcon } from "./Icon";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { lang, setLang, t } = useLang();
  const { theme, toggle } = useTheme();

  return (
    <header>
      <div className="wrap nav">
        <Link className="brand" href="/">
          <BrandLogo size={34} />
          <span className="brand-text">CalcKit</span>
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="hamburger">
            {isMenuOpen ? "✕" : "☰"}
          </span>
        </button>

        <nav className={`nav-links ${isMenuOpen ? "is-open" : ""}`}>
          <Link href="/#tools" className="nav-item" onClick={() => setIsMenuOpen(false)}>
            <UiIcon name="home" size={16} />
            <span>All Tools</span>
          </Link>
          <Link href="/blog" className="nav-item" onClick={() => setIsMenuOpen(false)}>
            <UiIcon name="blog" size={16} />
            <span>Blog</span>
          </Link>
          <Link href="/#finance" className="nav-item" onClick={() => setIsMenuOpen(false)}>
            <UiIcon name="file-text" size={16} />
            <span>Finance</span>
          </Link>
          <Link href="/emi" className="nav-item" onClick={() => setIsMenuOpen(false)}>EMI</Link>
          <Link href="/sip" className="nav-item" onClick={() => setIsMenuOpen(false)}>SIP</Link>
          <Link href="/account" className="nav-item" onClick={() => setIsMenuOpen(false)}>
            <UiIcon name="account" size={16} />
            <span>Account</span>
          </Link>
        </nav>

        <div className="nav-actions">
          <SearchModal />
          <button
            type="button"
            className="ghost theme-toggle"
            onClick={toggle}
            title="Toggle dark / light"
          >
            <UiIcon name={theme === "light" ? "moon" : "sun"} size={18} />
            <span className="theme-label">
              {theme === "light" ? "Dark" : "Light"}
            </span>
          </button>
        <div className="lang-switch" role="group" aria-label="Language">
          <button
            type="button"
            className="lang-trigger"
            onClick={() => setIsLangOpen(!isLangOpen)}
            aria-expanded={isLangOpen}
          >
            <span className="lang-icon" aria-hidden>
              <UiIcon name="language" size={16} />
            </span>
            <span className="current-lang">{lang === "en" ? "EN" : "Urdu"}</span>
            <UiIcon name="chevron-down" size={12} className={isLangOpen ? "rotate" : ""} />
          </button>

          {isLangOpen && (
            <div className="lang-dropdown">
              <button className="lang-btn" onClick={() => { setLang("ur"); setIsLangOpen(false); }}>Urdu</button>
              <button className="lang-btn" onClick={() => { setLang("en"); setIsLangOpen(false); }}>English</button>
              <button className="lang-btn" onClick={() => { setLang("hi"); setIsLangOpen(false); }}>Hindi</button>
              <button className="lang-btn" onClick={() => { setLang("ar"); setIsLangOpen(false); }}>Arabic</button>
              <button className="lang-btn" onClick={() => { setLang("id"); setIsLangOpen(false); }}>Indonesian</button>
              <button className="lang-btn" onClick={() => { setLang("tl"); setIsLangOpen(false); }}>Filipino</button>
              <button className="lang-btn" onClick={() => { setLang("pt"); setIsLangOpen(false); }}>Portuguese</button>
              <button className="lang-btn" onClick={() => { setLang("es"); setIsLangOpen(false); }}>Spanish</button>
              <button className="lang-btn" onClick={() => { setLang("vi"); setIsLangOpen(false); }}>Vietnamese</button>
              <button className="lang-btn" onClick={() => { setLang("bn"); setIsLangOpen(false); }}>Bengali</button>
              <button className="lang-btn" onClick={() => { setLang("zh"); setIsLangOpen(false); }}>Chinese</button>
              <button className="lang-btn" onClick={() => { setLang("ja"); setIsLangOpen(false); }}>Japanese</button>
            </div>
          )}
        </div>
        </div>
      </div>
    </header>
  );
}
