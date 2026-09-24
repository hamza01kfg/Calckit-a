type Block = {
  how: string;
  formula: string;
  example: string;
  faqs: { q: string; a: string }[];
};

const CONTENT: Record<string, Block> = {
  emi: {
    how: "An EMI (Equated Monthly Installment) is the fixed amount you pay each month toward a loan. It includes both principal repayment and interest. Lenders use the loan amount, annual interest rate and tenure in years to compute a level monthly payment so the loan is fully paid by the end of the term.",
    formula:
      "Monthly rate r = annual rate ÷ 12 ÷ 100. Number of months n = years × 12. EMI = P × r × (1+r)^n ÷ ((1+r)^n − 1), where P is principal. If r is zero, EMI is simply P ÷ n.",
    example:
      "For a loan of 500,000 at 12% for 5 years, n = 60 months and r = 0.01. The EMI is about 11,122 per month. Total payment is EMI × 60 and total interest is total payment minus principal.",
    faqs: [
      {
        q: "Does a longer tenure reduce total interest?",
        a: "No. A longer tenure usually lowers the monthly EMI but increases total interest paid over the life of the loan.",
      },
      {
        q: "Is this EMI the same as my bank offer?",
        a: "Banks may use slightly different day-count methods, fees or floating rates. Treat CalcKit results as an estimate and confirm with your lender.",
      },
      {
        q: "What is included in EMI?",
        a: "Standard EMI here covers principal and interest only. Processing fees, insurance or taxes may be extra.",
      },
    ],
  },
  sip: {
    how: "A Systematic Investment Plan (SIP) invests a fixed amount at regular intervals, usually monthly, into mutual funds or similar products. Returns are estimated using an expected annual rate compounded monthly so you can see projected maturity value.",
    formula:
      "Monthly rate r = annual rate ÷ 12 ÷ 100. Months n = years × 12. Future value FV = PMT × ((1+r)^n − 1) ÷ r × (1+r) when r > 0. Total invested = PMT × n. Gain = FV − invested.",
    example:
      "Investing 5,000 every month for 10 years at an assumed 12% annual return gives 120 payments. The projected maturity value is higher than the sum invested because of compounding.",
    faqs: [
      {
        q: "Is the return guaranteed?",
        a: "No. Market-linked SIP returns vary. The calculator uses an assumed rate for planning only.",
      },
      {
        q: "What if I miss a month?",
        a: "Real SIPs may allow pauses. This tool assumes fixed monthly contributions for the full tenure.",
      },
      {
        q: "SIP vs lumpsum?",
        a: "SIP spreads purchases over time (rupee-cost averaging). Lumpsum invests everything at once. Choice depends on cash flow and risk comfort.",
      },
    ],
  },
  bmi: {
    how: "Body Mass Index (BMI) is a screening number from height and weight. It is widely used to classify underweight, normal, overweight and obese ranges in adults, but it does not measure body fat directly.",
    formula: "BMI = weight (kg) ÷ (height in meters)². Height in meters = height in cm ÷ 100.",
    example:
      "Someone who weighs 70 kg and is 170 cm tall has height 1.7 m. BMI = 70 ÷ (1.7 × 1.7) ≈ 24.2, which falls in the normal range on the common WHO adult scale.",
    faqs: [
      {
        q: "Is BMI accurate for athletes?",
        a: "Muscular people can show a high BMI without high body fat. BMI is only a quick screen, not a diagnosis.",
      },
      {
        q: "What ranges does CalcKit use?",
        a: "Underweight below 18.5, normal 18.5–24.9, overweight 25–29.9, obese 30 and above (adult WHO-style bands).",
      },
      {
        q: "Should I change my diet based only on BMI?",
        a: "No. Discuss weight and health goals with a qualified clinician, especially if you have medical conditions.",
      },
    ],
  },
  age: {
    how: "The age calculator finds the difference between your date of birth and today, expressed in completed years, months and days, plus total days lived.",
    formula:
      "Years, months and days are computed by calendar difference with borrow rules when the current day or month is earlier than the birth day or month. Total days use the absolute day count between the two dates.",
    example:
      "If someone was born on 15 March 2000 and today is 15 March 2026, the completed age is 26 years, 0 months and 0 days.",
    faqs: [
      {
        q: "Does it use the local timezone?",
        a: "It uses your device date. Travel across midnight or timezones can change 'today' by one day.",
      },
      {
        q: "Leap years?",
        a: "Day counts respect the calendar, including February 29 in leap years.",
      },
    ],
  },
  compound: {
    how: "Compound interest earns interest on both principal and previously credited interest. This tool also supports regular deposits so you can model savings with recurring contributions.",
    formula:
      "With compounding frequency n per year, period rate r = annual rate ÷ n ÷ 100. Future value of principal and of an annuity of deposits are summed over years × n periods.",
    example:
      "Starting with 10,000, adding 500 each month, at 10% compounded monthly for 5 years produces a future value greater than total cash invested.",
    faqs: [
      {
        q: "What compounding frequency should I choose?",
        a: "Match your product: many savings accounts compound monthly or quarterly; check your statement.",
      },
      {
        q: "Are deposits assumed at period end?",
        a: "The model uses a standard future-value-of-annuity style assumption suitable for planning estimates.",
      },
    ],
  },
  currency: {
    how: "The currency converter multiplies your amount by a live mid-market rate from an exchange-rate API when you are online.",
    formula: "Converted amount = input amount × rate(from → to).",
    example: "If 1 USD = 280 PKR, then 100 USD converts to about 28,000 PKR.",
    faqs: [
      {
        q: "Why does my bank rate differ?",
        a: "Banks add spreads and fees. Mid-market rates are reference rates, not guaranteed deal prices.",
      },
      {
        q: "Offline use?",
        a: "Live conversion needs internet. Without it the tool cannot refresh rates.",
      },
    ],
  },

  percentage: {
    how: "Percentage tools answer three common questions: what is X percent of Y, what percent is X of Y, and what is the percent change from X to Y. These appear in discounts, marks, growth and finance.",
    formula: "X% of Y = (X/100)×Y. X as percent of Y = (X/Y)×100. Percent change = ((Y−X)/X)×100.",
    example: "25% of 200 is 50. 50 is 25% of 200. A price rising from 200 to 250 is a 25% increase.",
    faqs: [
      { q: "Is percent change the same as percentage points?", a: "No. A rate moving from 10% to 12% is a 2 percentage point rise, but a 20% relative change." },
      { q: "Can the result be over 100%?", a: "Yes. If a value more than doubles, percent change exceeds 100%." },
    ],
  },
  tax: {
    how: "This calculator either adds a tax rate on top of a net amount or extracts tax from a tax-inclusive price so you can see net and tax components.",
    formula: "Add mode: tax = amount×rate/100, total = amount+tax. Extract mode: net = amount÷(1+rate/100), tax = amount−net.",
    example: "Add 15% tax to 1,000 → tax 150, total 1,150. From a 1,150 inclusive price at 15%, net is 1,000.",
    faqs: [
      { q: "Is this GST or VAT specific?", a: "It is a generic rate tool. Official rules, exemptions and place-of-supply laws may differ." },
      { q: "Rounding?", a: "Results are rounded for display; authorities may require specific rounding rules." },
    ],
  },
  discount: {
    how: "Enter the original price and discount percent to see how much you save and the final payable price.",
    formula: "Save = price×percent/100. Final = price − save.",
    example: "A 1,000 item at 20% off saves 200; you pay 800.",
    faqs: [
      { q: "Stacked discounts?", a: "This tool applies one percent off the original price. Multiple sequential discounts need step-by-step application." },
    ],
  },
  "simple-interest": {
    how: "Simple interest grows only on the original principal, not on accumulated interest.",
    formula: "Interest = P×R×T/100. Total = P + interest.",
    example: "P=10,000, R=8%, T=3 years → interest 2,400, total 12,400.",
    faqs: [
      { q: "When is simple interest used?", a: "Some short-term loans or teaching examples use SI; many modern products use compound interest instead." },
    ],
  },
  cagr: {
    how: "CAGR is the steady annual growth rate that takes a beginning value to an ending value over a number of years.",
    formula: "CAGR = (End/Start)^(1/years) − 1, shown as a percentage.",
    example: "10,000 growing to 18,000 in 5 years has CAGR ≈ 12.47%.",
    faqs: [
      { q: "Does CAGR mean returns were smooth?", a: "No. CAGR is a smoothed path; actual yearly returns may have been volatile." },
    ],
  },
  roi: {
    how: "Return on investment compares profit to the amount invested.",
    formula: "ROI% = (Returned − Invested) ÷ Invested × 100.",
    example: "Invest 10,000 and get back 13,500 → profit 3,500 → ROI 35%.",
    faqs: [
      { q: "Does ROI include time?", a: "Basic ROI ignores how long money was invested. For time-aware metrics use CAGR or annualized returns." },
    ],
  },
  inflation: {
    how: "This tool projects how much money you would need in the future to match today’s purchasing power at a given inflation rate.",
    formula: "Future amount = present × (1 + rate/100)^years.",
    example: "10,000 at 6% inflation for 10 years ≈ 17,908 in future nominal terms for similar purchasing power.",
    faqs: [
      { q: "Is inflation constant?", a: "No. Real inflation varies; the rate here is an assumption for planning." },
    ],
  },
  unit: {
    how: "Convert length, weight or temperature between common units using standard conversion factors.",
    formula: "Length/weight: value × factor(from) ÷ factor(to). Temperature uses °C/°F/K conversion formulas.",
    example: "1 meter ≈ 3.2808 feet. 0°C = 32°F = 273.15 K.",
    faqs: [
      { q: "Are factors exact?", a: "Factors follow common SI definitions used in general-purpose converters." },
    ],
  },
  gpa: {
    how: "GPA averages grade points weighted by credit hours on a 4.0 scale.",
    formula: "GPA = Σ(grade points × credits) ÷ Σ(credits).",
    example: "A 3-credit A (4.0) and a 3-credit B+ (3.3) → points 21.9 over 6 credits → GPA 3.65.",
    faqs: [
      { q: "Do schools use the same scale?", a: "Scales differ (some use 4.3 or percentage maps). Match your institution’s chart when possible." },
    ],
  },
  amortization: {
    how: "An amortization schedule splits each EMI into interest and principal so the balance falls to zero by the final payment.",
    formula: "Each period: interest = balance × monthly rate; principal = EMI − interest; new balance = balance − principal.",
    example: "Early payments are interest-heavy; later payments retire more principal.",
    faqs: [
      { q: "Why does interest fall over time?", a: "As principal declines, interest on the remaining balance shrinks." },
    ],
  },
  "credit-card": {
    how: "Estimate how long a fixed monthly payment takes to clear a card balance at a stated annual rate, and how much interest accrues.",
    formula: "Monthly rate = annual/12/100. Balance compounds monthly; payment reduces balance until paid off (if payment covers interest).",
    example: "High rates mean small payments may barely cover interest; larger payments cut months and total interest.",
    faqs: [
      { q: "Why does it say debt never pays off?", a: "If the payment is less than or equal to the first month’s interest, the balance does not decline." },
    ],
  },
  "savings-goal": {
    how: "Find the monthly savings needed to reach a target amount given years, expected return and optional current savings.",
    formula: "Solve for payment in the future-value-of-annuity relationship after growing current savings to the horizon.",
    example: "A higher return or longer time reduces the required monthly amount for the same goal.",
    faqs: [
      { q: "Are returns guaranteed?", a: "No. The rate is an assumption for planning only." },
    ],
  },
  margin: {
    how: "Margin is profit as a share of selling price; markup is profit as a share of cost.",
    formula: "Profit = sell − cost. Margin% = profit/sell×100. Markup% = profit/cost×100.",
    example: "Cost 100, sell 150 → profit 50, margin 33.33%, markup 50%.",
    faqs: [
      { q: "Which should I use?", a: "Retail often quotes margin on price; purchasing may think in markup on cost." },
    ],
  },
  breakeven: {
    how: "Break-even is the sales volume where total contribution covers fixed costs.",
    formula: "Contribution per unit = price − variable cost. Break-even units = ceil(fixed ÷ contribution).",
    example: "Fixed 50,000, price 200, variable 80 → contribution 120 → about 417 units.",
    faqs: [
      { q: "What if price ≤ variable cost?", a: "Contribution is zero or negative; break-even is impossible without changing costs or price." },
    ],
  },
  "pv-fv": {
    how: "Present value discounts a future amount; future value grows a present amount at a compound rate.",
    formula: "FV = PV×(1+r)^n. PV = FV÷(1+r)^n, with r as decimal annual rate and n in years.",
    example: "10,000 at 8% for 5 years grows to about 14,693; the present value of 14,693 at 8% for 5 years is 10,000.",
    faqs: [
      { q: "Is compounding annual only?", a: "This simple tool uses annual compounding for clarity." },
    ],
  },
  basic: {
    how: "A standard four-function style calculator for addition, subtraction, multiplication and division in the browser.",
    formula: "Expressions are evaluated with ordinary operator precedence after converting × ÷ symbols.",
    example: "12 × 5 + 4 = 64.",
    faqs: [
      { q: "Is scientific mode included?", a: "This page focuses on everyday arithmetic. Use specialized tools for finance or unit conversion." },
    ],
  },
  date: {
    how: "Computes the span between two calendar dates in days and approximate weeks, months and years.",
    formula: "Days = absolute difference in UTC day counts. Weeks = days/7. Months ≈ days/30.437. Years ≈ days/365.25.",
    example: "From 1 Jan 2024 to 1 Jan 2025 is 366 days in a leap year span that includes Feb 29.",
    faqs: [
      { q: "Why approximate months?", a: "Months vary in length; averages are for intuition, not legal deadlines." },
    ],
  },

  default: {
    how: "This CalcKit tool takes your inputs and applies a clear mathematical formula in your browser so you can explore results instantly.",
    formula: "See the on-page fields: each input maps to a standard formula for that calculator type.",
    example:
      "Change one input at a time and watch the result update. Compare scenarios before you make a real-world decision.",
    faqs: [
      {
        q: "Do you store my numbers?",
        a: "Core calculations run locally in your browser. Read the Privacy Policy for cookies, ads and the contact form.",
      },
      {
        q: "Can I rely on this for legal or bank filings?",
        a: "No. Use results as estimates and confirm with official or professional sources.",
      },
    ],
  },
};

export default function ToolSeoContent({ toolId }: { toolId: string }) {
  const c = CONTENT[toolId] || CONTENT.default;
  return (
    <section className="panel seo-prose" style={{ marginTop: 24 }}>
      <h2>How this tool works</h2>
      <p>{c.how}</p>
      <h2>Formula</h2>
      <p>{c.formula}</p>
      <h2>Example</h2>
      <p>{c.example}</p>
      <h2>Frequently asked questions</h2>
      {c.faqs.map((f) => (
        <div key={f.q} style={{ marginBottom: 14 }}>
          <h3 style={{ fontSize: 16, marginBottom: 6 }}>{f.q}</h3>
          <p style={{ margin: 0 }}>{f.a}</p>
        </div>
      ))}
    </section>
  );
}
