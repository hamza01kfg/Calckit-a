export type ToolItem = {
  href: string;
  title: string;
  desc: string;
  tag: string;
  /** emoji fallback */
  icon: string;
  /** SVG under /icons/tools/ */
  iconSrc: string;
  /** false = hidden from home/search/nav (page still works if opened) */
  featured?: boolean;
};

/** Full catalog (including hidden) — for admin / future */
export const ALL_TOOLS: ToolItem[] = [
  // —— Featured (homepage order) ——
  { href: "/emi", title: "EMI Calculator", desc: "Loan monthly installment", tag: "Finance", icon: "🏦", iconSrc: "/icons/tools/emi-calculator.svg", featured: true },
  { href: "/sip", title: "SIP Calculator", desc: "Systematic investment", tag: "Finance", icon: "📈", iconSrc: "/icons/tools/sip-calculator.svg", featured: true },
  { href: "/bmi", title: "BMI Calculator", desc: "Body Mass Index", tag: "Everyday", icon: "⚖️", iconSrc: "/icons/tools/bmi-calculator.svg", featured: true },
  { href: "/age", title: "Age Calculator", desc: "Exact age from DOB", tag: "Everyday", icon: "🎂", iconSrc: "/icons/tools/age-calculator.svg", featured: true },
  { href: "/percentage", title: "Percentage", desc: "% of and change", tag: "Everyday", icon: "%", iconSrc: "/icons/tools/percentage.svg", featured: true },
  { href: "/currency", title: "Currency Converter", desc: "Live rates", tag: "Finance", icon: "💱", iconSrc: "/icons/tools/currency-converter.svg", featured: true },
  { href: "/discount", title: "Discount Calculator", desc: "Sale price", tag: "Finance", icon: "🏷️", iconSrc: "/icons/tools/discount-calculator.svg", featured: true },
  { href: "/compound", title: "Compound Interest", desc: "Growth over time", tag: "Finance", icon: "💹", iconSrc: "/icons/tools/compound-interest.svg", featured: true },
  { href: "/tax", title: "Tax Calculator", desc: "Add or extract tax", tag: "Finance", icon: "🧾", iconSrc: "/icons/tools/tax-calculator.svg", featured: true },
  // optional 10th — set featured: true if you want it on home
  { href: "/unit", title: "Unit Converter", desc: "Length weight temp", tag: "Utility", icon: "📐", iconSrc: "/icons/tools/unit-converter.svg", featured: false },
  // —— Hidden for now ——
  { href: "/basic", title: "Basic Calculator", desc: "Simple arithmetic", tag: "Everyday", icon: "∑", iconSrc: "/icons/tools/basic-calculator.svg", featured: false },
  { href: "/gpa", title: "GPA Calculator", desc: "4.0 scale GPA", tag: "Education", icon: "🎓", iconSrc: "/icons/tools/gpa-calculator.svg", featured: false },
  { href: "/date", title: "Date Difference", desc: "Days between dates", tag: "Utility", icon: "📅", iconSrc: "/icons/tools/date-difference.svg", featured: false },
  { href: "/simple-interest", title: "Simple Interest", desc: "Basic interest", tag: "Finance", icon: "💰", iconSrc: "/icons/tools/simple-interest.svg", featured: false },
  { href: "/cagr", title: "CAGR Calculator", desc: "Annual growth rate", tag: "Finance", icon: "📊", iconSrc: "/icons/tools/cagr-calculator.svg", featured: false },
  { href: "/roi", title: "ROI Calculator", desc: "Return on investment", tag: "Finance", icon: "🎯", iconSrc: "/icons/tools/roi-calculator.svg", featured: false },
  { href: "/inflation", title: "Inflation Calculator", desc: "Future value", tag: "Finance", icon: "📉", iconSrc: "/icons/tools/inflation-calculator.svg", featured: false },
  { href: "/savings-goal", title: "Savings Goal", desc: "Monthly savings needed", tag: "Finance", icon: "🎯", iconSrc: "/icons/tools/savings-goal.svg", featured: false },
  { href: "/credit-card", title: "Credit Card Payoff", desc: "Payoff time", tag: "Finance", icon: "💳", iconSrc: "/icons/tools/credit-card-payoff.svg", featured: false },
  { href: "/amortization", title: "Amortization", desc: "Payment schedule", tag: "Finance", icon: "📋", iconSrc: "/icons/tools/amortization.svg", featured: false },
  { href: "/margin", title: "Margin / Markup", desc: "Profit margin", tag: "Business", icon: "📦", iconSrc: "/icons/tools/margin-markup.svg", featured: false },
  { href: "/breakeven", title: "Break-even", desc: "Break-even units", tag: "Business", icon: "⚖️", iconSrc: "/icons/tools/break-even.svg", featured: false },
  { href: "/pv-fv", title: "Present / Future Value", desc: "PV and FV", tag: "Finance", icon: "🔮", iconSrc: "/icons/tools/present-future-value.svg", featured: false },
];

/** Homepage + search + public nav — only featured tools, fixed order */
export const TOOLS: ToolItem[] = ALL_TOOLS.filter((t) => t.featured === true);
