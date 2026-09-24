"use client";

import Link from "next/link";
import { useLang } from "./LanguageProvider";
import SearchModal from "./SearchModal";
import { useTheme } from "./ThemeProvider";
import { BrandLogo, UiIcon } from "./Icon";

export default function Header() {
  const { lang, setLang, t } = useLang();
  const { theme, toggle } = useTheme();

  return (
    <header>
      <div className="wrap nav">
        <Link className="brand" href="/">
          <BrandLogo size={34} />
          <span className="brand-text">{t("brand")}</span>
        </Link>
        <nav className="nav-links">
          <Link href="/#tools" className="nav-item">
            <UiIcon name="home" size={16} />
            <span>{t("allTools")}</span>
          </Link>
          <Link href="/blog" className="nav-item">
            <UiIcon name="blog" size={16} />
            <span>{t("blog")}</span>
          </Link>
          <Link href="/#finance" className="nav-item">
            <UiIcon name="file-text" size={16} />
            <span>{t("finance")}</span>
          </Link>
          <Link href="/emi">EMI</Link>
          <Link href="/sip">SIP</Link>
          <Link href="/account" className="nav-item">
            <UiIcon name="account" size={16} />
            <span>{t("account")}</span>
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
              {theme === "light" ? t("dark") : t("light")}
            </span>
          </button>
          <div className="lang-switch" role="group" aria-label="Language">
            <span className="lang-icon" aria-hidden>
              <UiIcon name="language" size={16} />
            </span>
            <button
              type="button"
              className={lang === "en" ? "lang-btn is-active" : "lang-btn"}
              onClick={() => setLang("en")}
            >
              EN
            </button>
            <button
              type="button"
              className={lang === "ur" ? "lang-btn is-active" : "lang-btn"}
              onClick={() => setLang("ur")}
            >
              اردو
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
