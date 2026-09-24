import type { Metadata } from "next";
import { meta, PAGE_SEO } from "@/lib/seo";

const s = PAGE_SEO.terms;
export const metadata: Metadata = meta(s.title, s.description, s.path, s.keywords);

export default function TermsPage() {
  return (
    <div className="wrap tool-page">
      <div className="tool-head">
        <h1>Terms of Use</h1>
        <p>Last updated: September 2026</p>
      </div>
      <div className="panel seo-prose" style={{ maxWidth: 720 }}>
        <p>
          Welcome to CalcKit. By accessing or using this website you agree to
          these Terms of Use. If you do not agree, please do not use the site.
        </p>

        <h2>1. Service description</h2>
        <p>
          CalcKit provides free online calculators for education, personal
          planning and general information (for example EMI, SIP, BMI, age and
          unit conversion). Tools are provided &quot;as is&quot; without a paid support
          contract unless separately agreed.
        </p>

        <h2>2. Not professional advice</h2>
        <p>
          Results are estimates only. They are not financial, tax, medical,
          legal or investment advice. Always verify important decisions with a
          qualified professional and official sources.
        </p>

        <h2>3. Acceptable use</h2>
        <p>
          You agree not to misuse the site, attempt to disrupt service, scrape
          in a way that harms performance, or use tools for unlawful purposes.
          We may limit access if abuse is detected.
        </p>

        <h2>4. Intellectual property</h2>
        <p>
          CalcKit branding, layout and original content are protected. You may
          use the calculators for personal or educational purposes. You may not
          copy the site wholesale or present our tools as your own product
          without permission.
        </p>

        <h2>5. Advertising</h2>
        <p>
          The site may display third-party advertisements, including Google Ads.
          Ad networks have their own terms. We are not responsible for the
          content of third-party ads or external landing pages.
        </p>

        <h2>6. Disclaimer of warranties</h2>
        <p>
          We strive for accuracy but do not warrant that calculations are
          error-free or suitable for every jurisdiction or loan product. Browser
          differences and rounded values may affect results.
        </p>

        <h2>7. Limitation of liability</h2>
        <p>
          To the fullest extent allowed by law, CalcKit and its operators are
          not liable for any loss or damage arising from use of the tools or
          reliance on results.
        </p>

        <h2>8. Changes</h2>
        <p>
          We may change tools, features or these terms at any time. Continued
          use after changes means you accept the updated terms.
        </p>

        <h2>9. Contact</h2>
        <p>
          For questions about these terms, visit the{" "}
          <a href="/contact">Contact page</a>.
        </p>
      </div>
    </div>
  );
}
