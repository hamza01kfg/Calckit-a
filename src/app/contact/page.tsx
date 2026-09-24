import ContactForm from "@/components/ContactForm";
import AdSlot from "@/components/AdSlot";

export default function ContactPage() {
  return (
    <div className="wrap tool-page">
      <div className="tool-head">
        <h1>Contact Us</h1>
        <p>
          Questions, feedback or bug reports — send a message. For privacy and
          advertising details, see our Privacy Policy.
        </p>
      </div>
      <div className="ad-desktop">
        <AdSlot variant="leaderboard" />
      </div>
      <div className="ad-mobile">
        <AdSlot variant="mobile" />
      </div>
      <ContactForm />
      <div className="panel seo-prose" style={{ maxWidth: 520, marginTop: 20 }}>
        <p>
          We aim to respond when possible. Do not send passwords or sensitive
          financial account numbers through this form. CalcKit may use cookies
          and show ads; details are in the{" "}
          <a href="/privacy">Privacy Policy</a> and{" "}
          <a href="/terms">Terms of Use</a>.
        </p>
      </div>
    </div>
  );
}
