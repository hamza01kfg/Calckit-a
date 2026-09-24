import type { Metadata } from "next";

export const SITE_URL = "https://calckit-a.netlify.app";
export const SITE_NAME = "CalcKit";

export function meta(
  title: string,
  description: string,
  path: string,
  keywords?: string[]
): Metadata {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  return {
    title,
    description,
    keywords: keywords ?? [],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "education",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    other: {
      "theme-color": "#1c1914",
    },
  };
}

export const PAGE_SEO: Record<
  string,
  { title: string; description: string; path: string; keywords: string[] }
> = {
  home: {
    title: "CalcKit — Free Online Calculator Tools (EMI, SIP, BMI & More)",
    description:
      "Free online calculators for EMI, SIP, compound interest, BMI, age, GPA, currency, tax, discount and more. Fast, private, no signup.",
    path: "/",
    keywords: ["free calculator", "EMI calculator", "SIP calculator", "BMI", "online tools"],
  },
  emi: {
    title: "EMI Calculator — Free Loan EMI Online | CalcKit",
    description:
      "Calculate monthly EMI, total interest and total payment for home, car or personal loans. Free EMI calculator with live results.",
    path: "/emi",
    keywords: ["EMI calculator", "loan EMI", "monthly installment", "home loan calculator"],
  },
  sip: {
    title: "SIP Calculator — Mutual Fund SIP Returns | CalcKit",
    description:
      "Estimate SIP maturity value, total invested and gains. Free systematic investment plan calculator with live updates.",
    path: "/sip",
    keywords: ["SIP calculator", "mutual fund SIP", "investment calculator"],
  },
  bmi: {
    title: "BMI Calculator — Body Mass Index Online | CalcKit",
    description:
      "Check your BMI and health category (underweight, normal, overweight, obese). Free Body Mass Index calculator.",
    path: "/bmi",
    keywords: ["BMI calculator", "body mass index", "healthy weight"],
  },
  age: {
    title: "Age Calculator — Exact Age from Date of Birth | CalcKit",
    description:
      "Calculate exact age in years, months and days from your date of birth. Free online age calculator.",
    path: "/age",
    keywords: ["age calculator", "date of birth age", "exact age"],
  },
  basic: {
    title: "Basic Calculator — Free Online Math Calculator | CalcKit",
    description: "Simple arithmetic calculator for everyday calculations. Fast and mobile-friendly.",
    path: "/basic",
    keywords: ["basic calculator", "online calculator", "math calculator"],
  },
  percentage: {
    title: "Percentage Calculator — % of, Change & More | CalcKit",
    description: "Calculate percentage of a number, what percent X is of Y, and percent change. Free tool.",
    path: "/percentage",
    keywords: ["percentage calculator", "percent change", "what percent"],
  },
  compound: {
    title: "Compound Interest Calculator — Free Online | CalcKit",
    description:
      "Calculate compound interest with optional regular deposits. See future value, invested amount and interest earned.",
    path: "/compound",
    keywords: ["compound interest calculator", "CI calculator", "future value"],
  },
  "simple-interest": {
    title: "Simple Interest Calculator — Free Online | CalcKit",
    description: "Calculate simple interest and total amount using P × R × T / 100. Free SI calculator.",
    path: "/simple-interest",
    keywords: ["simple interest calculator", "SI calculator"],
  },
  cagr: {
    title: "CAGR Calculator — Compound Annual Growth Rate | CalcKit",
    description: "Find CAGR between beginning and ending investment values over years. Free CAGR tool.",
    path: "/cagr",
    keywords: ["CAGR calculator", "annual growth rate"],
  },
  roi: {
    title: "ROI Calculator — Return on Investment | CalcKit",
    description: "Calculate return on investment percentage from invested and returned amounts.",
    path: "/roi",
    keywords: ["ROI calculator", "return on investment"],
  },
  inflation: {
    title: "Inflation Calculator — Future Value of Money | CalcKit",
    description: "See how inflation affects the value of money over time. Free inflation calculator.",
    path: "/inflation",
    keywords: ["inflation calculator", "purchasing power"],
  },
  currency: {
    title: "Currency Converter — Live Exchange Rates | CalcKit",
    description: "Convert between USD, PKR, INR, EUR and more with live mid-market rates.",
    path: "/currency",
    keywords: ["currency converter", "exchange rate", "PKR USD"],
  },
  tax: {
    title: "Tax Calculator — Add or Extract Tax | CalcKit",
    description: "Add tax to a net amount or extract tax from a tax-inclusive price. Free tax calculator.",
    path: "/tax",
    keywords: ["tax calculator", "GST calculator", "VAT"],
  },
  discount: {
    title: "Discount Calculator — Sale Price Online | CalcKit",
    description: "Calculate discount amount and final sale price from original price and percent off.",
    path: "/discount",
    keywords: ["discount calculator", "sale price"],
  },
  date: {
    title: "Date Difference Calculator — Days Between Dates | CalcKit",
    description: "Find days, weeks, months and years between two dates. Free date calculator.",
    path: "/date",
    keywords: ["date difference", "days between dates"],
  },
  unit: {
    title: "Unit Converter — Length, Weight, Temperature | CalcKit",
    description: "Convert length, weight and temperature units instantly. Free unit converter.",
    path: "/unit",
    keywords: ["unit converter", "kg to lb", "cm to inch"],
  },
  gpa: {
    title: "GPA Calculator — 4.0 Scale Online | CalcKit",
    description: "Calculate grade point average on a 4.0 scale from course grades and credits.",
    path: "/gpa",
    keywords: ["GPA calculator", "grade point average"],
  },
  amortization: {
    title: "Loan Amortization Schedule Calculator | CalcKit",
    description: "Generate full loan amortization schedule with principal, interest and balance per month.",
    path: "/amortization",
    keywords: ["amortization calculator", "loan schedule"],
  },
  "credit-card": {
    title: "Credit Card Payoff Calculator | CalcKit",
    description: "Estimate months to pay off credit card debt and total interest with fixed monthly payments.",
    path: "/credit-card",
    keywords: ["credit card payoff", "debt calculator"],
  },
  "savings-goal": {
    title: "Savings Goal Calculator — Monthly Savings | CalcKit",
    description: "Find how much to save monthly to reach a financial goal with expected returns.",
    path: "/savings-goal",
    keywords: ["savings goal calculator", "monthly savings"],
  },
  margin: {
    title: "Margin and Markup Calculator | CalcKit",
    description: "Calculate profit, margin percentage and markup from cost and selling price.",
    path: "/margin",
    keywords: ["margin calculator", "markup calculator"],
  },
  breakeven: {
    title: "Break-even Calculator — Units & Revenue | CalcKit",
    description: "Calculate break-even units and revenue from fixed costs, price and variable cost.",
    path: "/breakeven",
    keywords: ["break-even calculator", "break even point"],
  },
  "pv-fv": {
    title: "Present Value and Future Value Calculator | CalcKit",
    description: "Convert between present value and future value using interest rate and years.",
    path: "/pv-fv",
    keywords: ["present value", "future value calculator"],
  },
  about: {
    title: "About CalcKit — Free Calculator Tools",
    description: "Learn about CalcKit, our free online calculator suite and how we keep tools private and fast.",
    path: "/about",
    keywords: ["about CalcKit"],
  },
  contact: {
    title: "Contact CalcKit",
    description: "Contact CalcKit for feedback, questions or partnership inquiries.",
    path: "/contact",
    keywords: ["contact CalcKit"],
  },
  privacy: {
    title: "Privacy Policy — CalcKit",
    description: "How CalcKit handles data, cookies, ads and third-party services.",
    path: "/privacy",
    keywords: ["privacy policy"],
  },
  terms: {
    title: "Terms of Use — CalcKit",
    description: "Terms and conditions for using CalcKit free calculator tools.",
    path: "/terms",
    keywords: ["terms of service"],
  },
};
