import type { Metadata } from "next";
import { meta, PAGE_SEO } from "@/lib/seo";

const s = PAGE_SEO.privacy;
export const metadata: Metadata = meta(s.title, s.description, s.path, s.keywords);

export default function PrivacyPage() {
  return (
    <div className="wrap tool-page">
      <div className="tool-head">
        <h1>Privacy Policy</h1>
        <p>Last updated: September 2026</p>
      </div>
      <div className="panel seo-prose" style={{ maxWidth: 720 }}>
        <p>
          CalcKit (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) provides free online calculator tools.
          This Privacy Policy explains what information we collect, how we use it,
          and your choices. By using CalcKit you agree to this policy.
        </p>

        <h2>1. Calculator inputs</h2>
        <p>
          Most calculators run entirely in your browser. Loan amounts, ages, BMI
          values and similar inputs are processed on your device and are not sent
          to our servers for storage. We do not create accounts for these core tools
          unless you later choose a feature that requires one.
        </p>

        <h2>2. Contact form</h2>
        <p>
          If you use the contact form, we receive the name, email and message you
          submit so we can reply. That data is processed through our email delivery
          provider (for example EmailJS) according to their terms.
        </p>

        <h2>3. Cookies and similar technologies</h2>
        <p>
          We may use cookies and local storage for language preference, recent
          calculation history on your device, and essential site functions.
          Advertising partners may also set cookies as described below.
        </p>

        <h2>4. Advertising (including Google Ads)</h2>
        <p>
          CalcKit may show advertisements, including ads served by Google AdSense
          or similar networks. These partners may use cookies, device identifiers
          and browsing data to show relevant ads and measure performance, in
          accordance with their own privacy policies. Google&apos;s use of data is
          described at{" "}
          <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
            Google Advertising Policies
          </a>
          . You can manage ad preferences through Google Ads Settings and your
          browser controls.
        </p>

        <h2>5. Third-party APIs</h2>
        <p>
          The currency converter may request live rates from a third-party exchange
          rate API when you are online. That provider processes the request needed
          to return rates.
        </p>

        <h2>6. Analytics</h2>
        <p>
          We may use privacy-conscious or standard analytics to understand traffic
          and improve the site (for example page views and approximate region).
          Where required, we will update this policy with the provider name.
        </p>

        <h2>7. Children</h2>
        <p>
          CalcKit is a general-audience tool site. We do not knowingly collect
          personal information from children under 13.
        </p>

        <h2>8. Your choices</h2>
        <p>
          You can clear site data in your browser, block cookies, or use
          ad-blocking tools. Contact form messages can be followed up by emailing
          us if you need data removed from our inbox.
        </p>

        <h2>9. Changes</h2>
        <p>
          We may update this policy from time to time. The &quot;Last updated&quot; date
          at the top will change when we do. Continued use means you accept the
          revised policy.
        </p>

        <h2>10. Contact</h2>
        <p>
          Questions about privacy: use our{" "}
          <a href="/contact">Contact page</a>.
        </p>
      </div>
    </div>
  );
}
