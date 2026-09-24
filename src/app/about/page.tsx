import type { Metadata } from "next";
import { meta, PAGE_SEO } from "@/lib/seo";

const s = PAGE_SEO.about;
export const metadata: Metadata = meta(s.title, s.description, s.path, s.keywords);

export default function AboutPage() {
  return (
    <div className="wrap tool-page">
      <div className="tool-head">
        <h1>About CalcKit</h1>
        <p>Free calculator tools — fast, clear, no signup required.</p>
      </div>
      <div className="panel seo-prose" style={{ maxWidth: 720 }}>
        <p>
          CalcKit is a free suite of online calculators for everyday math and
          personal finance. Our goal is simple: give you accurate, easy-to-use
          tools without forcing an account or burying results behind walls.
        </p>
        <h2>What we offer</h2>
        <p>
          You will find loan and investment tools such as EMI, SIP, compound
          interest, CAGR and amortization; health and education helpers such as
          BMI, age and GPA; plus utilities like currency conversion, percentage,
          discount, tax and unit conversion.
        </p>
        <h2>Privacy-first calculations</h2>
        <p>
          Core calculators run in your browser. We do not need your loan amount
          or BMI stored on our servers for the tool to work. See our{" "}
          <a href="/privacy">Privacy Policy</a> for cookies, ads and contact
          form details.
        </p>
        <h2>Advertising</h2>
        <p>
          Free tools are supported by advertising, which may include Google Ads
          or similar networks. Ads help us keep calculators free for everyone.
        </p>
        <h2>Feedback</h2>
        <p>
          Found a bug or want a new calculator? Reach out on the{" "}
          <a href="/contact">Contact</a> page. We improve CalcKit based on real
          usage and user suggestions.
        </p>
      </div>
    </div>
  );
}
