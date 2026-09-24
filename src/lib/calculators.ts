export function fmt(n: number, d = 2): string {
  if (!isFinite(n)) return "—";
  return Number(n).toLocaleString(undefined, {
    maximumFractionDigits: d,
    minimumFractionDigits: 0,
  });
}

export function daysBetween(a: string, b: string): number {
  const ms = Math.abs(new Date(b).getTime() - new Date(a).getTime());
  return Math.floor(ms / 86400000);
}

export function ageFrom(dateStr: string) {
  const birth = new Date(dateStr);
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();
  if (days < 0) {
    months -= 1;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  const totalDays = daysBetween(dateStr, now.toISOString().slice(0, 10));
  return { years, months, days, totalDays };
}

export function bmiCalc(kg: number, cm: number) {
  const m = cm / 100;
  const bmi = kg / (m * m);
  let label = "Underweight";
  if (bmi >= 18.5 && bmi < 25) label = "Normal";
  else if (bmi >= 25 && bmi < 30) label = "Overweight";
  else if (bmi >= 30) label = "Obese";
  return { bmi, label };
}

export function emiCalc(p: number, annual: number, years: number) {
  const n = years * 12;
  const r = annual / 12 / 100;
  const emi =
    r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const total = emi * n;
  return { emi, total, interest: total - p, months: n };
}

export function sipCalc(pmt: number, annual: number, years: number) {
  const r = annual / 12 / 100;
  const n = years * 12;
  const fv =
    r === 0 ? pmt * n : pmt * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const invested = pmt * n;
  return { fv, invested, gain: fv - invested };
}

export function simpleInterest(p: number, rate: number, years: number) {
  const interest = (p * rate * years) / 100;
  return { interest, total: p + interest };
}

export function cagrCalc(begin: number, end: number, years: number) {
  if (begin <= 0 || years <= 0) return 0;
  return (Math.pow(end / begin, 1 / years) - 1) * 100;
}

export function roiCalc(invested: number, returned: number) {
  if (invested === 0) return 0;
  return ((returned - invested) / invested) * 100;
}

export function inflationCalc(amount: number, rate: number, years: number) {
  return amount * Math.pow(1 + rate / 100, years);
}

export function discountCalc(price: number, percent: number) {
  const save = (price * percent) / 100;
  return { save, final: price - save };
}

export function gpaPoints(letter: string): number | null {
  const map: Record<string, number> = {
    "A+": 4,
    A: 4,
    "A-": 3.7,
    "B+": 3.3,
    B: 3,
    "B-": 2.7,
    "C+": 2.3,
    C: 2,
    "C-": 1.7,
    D: 1,
    F: 0,
  };
  return map[letter] ?? null;
}

export const UNITS: Record<string, Record<string, number | string>> = {
  Length: {
    m: 1,
    km: 1000,
    cm: 0.01,
    mm: 0.001,
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mi: 1609.344,
  },
  Weight: {
    kg: 1,
    g: 0.001,
    mg: 1e-6,
    lb: 0.453592,
    oz: 0.0283495,
    ton: 1000,
  },
  Temperature: { C: "C", F: "F", K: "K" },
};

export function convertTemp(v: number, from: string, to: string): number {
  let c = v;
  if (from === "F") c = ((v - 32) * 5) / 9;
  if (from === "K") c = v - 273.15;
  if (to === "C") return c;
  if (to === "F") return (c * 9) / 5 + 32;
  return c + 273.15;
}

export function compoundFV(
  p: number,
  pmt: number,
  annual: number,
  years: number,
  freq: number
) {
  const n = freq;
  const r = annual / 100 / n;
  const periods = years * n;
  const fvP = r === 0 ? p : p * Math.pow(1 + r, periods);
  const fvA =
    r === 0 ? pmt * periods : pmt * ((Math.pow(1 + r, periods) - 1) / r);
  const invested = p + pmt * periods;
  const fv = fvP + fvA;
  return { fv, invested, gain: fv - invested, periods };
}

export function marginCalc(cost: number, sell: number) {
  const profit = sell - cost;
  const margin = sell ? (profit / sell) * 100 : 0;
  const markup = cost ? (profit / cost) * 100 : 0;
  return { profit, margin, markup };
}

export function breakevenCalc(fixed: number, price: number, variable: number) {
  const contrib = price - variable;
  const units = contrib > 0 ? Math.ceil(fixed / contrib) : Infinity;
  return {
    units,
    contrib,
    revenue: isFinite(units) ? units * price : Infinity,
  };
}

export function savingsGoalCalc(
  goal: number,
  rate: number,
  years: number,
  current = 0
) {
  const months = years * 12;
  const r = rate / 100 / 12;
  const fvCurrent =
    r === 0 ? current : current * Math.pow(1 + r, months);
  const remaining = Math.max(0, goal - fvCurrent);
  const pmt =
    r === 0
      ? remaining / months
      : (remaining * r) / (Math.pow(1 + r, months) - 1);
  return { monthly: pmt, months, remaining };
}

export function creditCardPayoff(
  balance: number,
  rate: number,
  payment: number
) {
  const r = rate / 100 / 12;
  if (payment <= balance * r) {
    return { months: Infinity, totalInterest: Infinity, totalPaid: Infinity };
  }
  let bal = balance;
  let months = 0;
  let totalInterest = 0;
  while (bal > 0.01 && months < 600) {
    const interest = bal * r;
    totalInterest += interest;
    bal = bal + interest - payment;
    months++;
  }
  return {
    months,
    totalInterest,
    totalPaid: balance + totalInterest,
  };
}

export function amortSchedule(
  principal: number,
  annual: number,
  years: number
) {
  const n = years * 12;
  const r = annual / 12 / 100;
  const emi =
    r === 0
      ? principal / n
      : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const rows: {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }[] = [];
  let bal = principal;
  for (let i = 1; i <= n; i++) {
    const interest = bal * r;
    const prin = emi - interest;
    bal = Math.max(0, bal - prin);
    rows.push({
      month: i,
      payment: emi,
      principal: prin,
      interest,
      balance: bal,
    });
  }
  return { emi, rows, totalInterest: emi * n - principal };
}
