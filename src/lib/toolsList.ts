export type ToolItem = {
  href: string;
  title: string;
  desc: string;
  tag: string;
  /** emoji fallback */
  icon: string;
  /** SVG under /icons/tools/ */
  iconSrc: string;
};

export const TOOLS: ToolItem[] = [
  { href: "/basic", title: "Basic Calculator", desc: "Simple arithmetic", tag: "Everyday", icon: "∑", iconSrc: "/icons/tools/basic-calculator.svg" },
  { href: "/age", title: "Age Calculator", desc: "Exact age from DOB", tag: "Everyday", icon: "🎂", iconSrc: "/icons/tools/age-calculator.svg" },
  { href: "/bmi", title: "BMI Calculator", desc: "Body Mass Index", tag: "Everyday", icon: "⚖️", iconSrc: "/icons/tools/bmi-calculator.svg" },
  { href: "/percentage", title: "Percentage", desc: "% of and change", tag: "Everyday", icon: "%", iconSrc: "/icons/tools/percentage.svg" },
  { href: "/gpa", title: "GPA Calculator", desc: "4.0 scale GPA", tag: "Education", icon: "🎓", iconSrc: "/icons/tools/gpa-calculator.svg" },
  { href: "/currency", title: "Currency Converter", desc: "Live rates", tag: "Finance", icon: "💱", iconSrc: "/icons/tools/currency-converter.svg" },
  { href: "/tax", title: "Tax Calculator", desc: "Add or extract tax", tag: "Finance", icon: "🧾", iconSrc: "/icons/tools/tax-calculator.svg" },
  { href: "/discount", title: "Discount Calculator", desc: "Sale price", tag: "Finance", icon: "🏷️", iconSrc: "/icons/tools/discount-calculator.svg" },
  { href: "/date", title: "Date Difference", desc: "Days between dates", tag: "Utility", icon: "📅", iconSrc: "/icons/tools/date-difference.svg" },
  { href: "/unit", title: "Unit Converter", desc: "Length weight temp", tag: "Utility", icon: "📐", iconSrc: "/icons/tools/unit-converter.svg" },
  { href: "/emi", title: "EMI Calculator", desc: "Loan monthly installment", tag: "Finance", icon: "🏦", iconSrc: "/icons/tools/emi-calculator.svg" },
  { href: "/sip", title: "SIP Calculator", desc: "Systematic investment", tag: "Finance", icon: "📈", iconSrc: "/icons/tools/sip-calculator.svg" },
  { href: "/compound", title: "Compound Interest", desc: "Growth over time", tag: "Finance", icon: "💹", iconSrc: "/icons/tools/compound-interest.svg" },
  { href: "/simple-interest", title: "Simple Interest", desc: "Basic interest", tag: "Finance", icon: "💰", iconSrc: "/icons/tools/simple-interest.svg" },
  { href: "/cagr", title: "CAGR Calculator", desc: "Annual growth rate", tag: "Finance", icon: "📊", iconSrc: "/icons/tools/cagr-calculator.svg" },
  { href: "/roi", title: "ROI Calculator", desc: "Return on investment", tag: "Finance", icon: "🎯", iconSrc: "/icons/tools/roi-calculator.svg" },
  { href: "/inflation", title: "Inflation Calculator", desc: "Future value", tag: "Finance", icon: "📉", iconSrc: "/icons/tools/inflation-calculator.svg" },
  { href: "/savings-goal", title: "Savings Goal", desc: "Monthly savings needed", tag: "Finance", icon: "🎯", iconSrc: "/icons/tools/savings-goal.svg" },
  { href: "/credit-card", title: "Credit Card Payoff", desc: "Payoff time", tag: "Finance", icon: "💳", iconSrc: "/icons/tools/credit-card-payoff.svg" },
  { href: "/amortization", title: "Amortization", desc: "Payment schedule", tag: "Finance", icon: "📋", iconSrc: "/icons/tools/amortization.svg" },
  { href: "/margin", title: "Margin / Markup", desc: "Profit margin", tag: "Business", icon: "📦", iconSrc: "/icons/tools/margin-markup.svg" },
  { href: "/breakeven", title: "Break-even", desc: "Break-even units", tag: "Business", icon: "⚖️", iconSrc: "/icons/tools/break-even.svg" },
  { href: "/pv-fv", title: "Present / Future Value", desc: "PV and FV", tag: "Finance", icon: "🔮", iconSrc: "/icons/tools/present-future-value.svg" },
];
