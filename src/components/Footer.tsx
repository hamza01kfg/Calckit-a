"use client";

import Link from "next/link";
import { useLang } from "./LanguageProvider";
import { BrandLogo, UiIcon } from "./Icon";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer>
      <div className="wrap foot">
        <div className="foot-brand">
          <BrandLogo size={28} />
          <span>
            © {new Date().getFullYear()} CalcKit — {t("footerCopy")}
          </span>
        </div>
        <div className="foot-links">
          <Link href="/about" className="nav-item">
            <UiIcon name="info" size={14} />
            {t("about")}
          </Link>
          <Link href="/privacy" className="nav-item">
            <UiIcon name="shield" size={14} />
            {t("privacy")}
          </Link>
          <Link href="/terms" className="nav-item">
            <UiIcon name="file-text" size={14} />
            {t("terms")}
          </Link>
          <Link href="/contact" className="nav-item">
            <UiIcon name="mail" size={14} />
            {t("contact")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
