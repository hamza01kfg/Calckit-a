"use client";

import { useMemo, useState } from "react";
import { amortSchedule, fmt } from "@/lib/calculators";
import CalculatorShell from "@/components/CalculatorShell";
import InputSlider from "@/components/ui/InputSlider";
import ResultCard from "@/components/ui/ResultCard";
import ResultActions from "@/components/ui/ResultActions";
import DonutChart from "@/components/ui/DonutChart";

export default function AmortizationPage() {
  const [principal, setPrincipal] = useState(1000000);
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(10);
  const data = useMemo(
    () => amortSchedule(principal, rate, years),
    [principal, rate, years]
  );

  const totalPaid = data.emi * years * 12;
  const totalInterest = data.totalInterest;

  const copyText = [
    `Loan Amortization Summary`,
    `Principal: ₹${fmt(principal)}`,
    `Rate: ${rate}% p.a.`,
    `Tenure: ${years} years (${years * 12} months)`,
    `Monthly EMI: ₹${fmt(data.emi)}`,
    `Total Interest: ₹${fmt(totalInterest)}`,
    `Total Payable: ₹${fmt(totalPaid)}`,
  ].join("\n");

  const csvRows: string[][] = [
    ["Month", "Payment", "Principal", "Interest", "Balance"],
    ...data.rows.map((r) => [
      String(r.month),
      String(Math.round(r.payment * 100) / 100),
      String(Math.round(r.principal * 100) / 100),
      String(Math.round(r.interest * 100) / 100),
      String(Math.round(r.balance * 100) / 100),
    ]),
  ];

  // Yearly summary rows for cleaner PDF when tenure is long
  const yearlyRows = useMemo(() => {
    const out: {
      year: number;
      payment: number;
      principal: number;
      interest: number;
      balance: number;
    }[] = [];
    for (let y = 1; y <= years; y++) {
      const slice = data.rows.slice((y - 1) * 12, y * 12);
      if (!slice.length) break;
      out.push({
        year: y,
        payment: slice.reduce((s, r) => s + r.payment, 0),
        principal: slice.reduce((s, r) => s + r.principal, 0),
        interest: slice.reduce((s, r) => s + r.interest, 0),
        balance: slice[slice.length - 1].balance,
      });
    }
    return out;
  }, [data.rows, years]);

  const useYearlyInPdf = years * 12 > 60;

  return (
    <>
      <CalculatorShell
        title="Loan Amortization"
        description="Full payment schedule — EMI, principal vs interest, and printable table."
        toolId="amortization"
        result={
          <ResultCard
            title="Amortization Summary"
            headlineLabel="Monthly EMI"
            headlineValue={`₹${fmt(data.emi)}`}
            metaLine={`Principal: ₹${fmt(principal, 0)}  ·  Rate: ${rate}%  ·  ${years} Years`}
            breakdown={[
              { label: "Principal", value: `₹${fmt(principal)}`, icon: "₹" },
              { label: "Total Interest", value: `₹${fmt(totalInterest)}`, icon: "%" },
              { label: "Total Payable", value: `₹${fmt(totalPaid)}`, icon: "Σ" },
              { label: "Months", value: String(years * 12), icon: "#" },
            ]}
            actions={
              <ResultActions
                copyText={copyText}
                path="/amortization"
                shareParams={{ principal, rate, years }}
                pdfTitle="Loan Amortization Schedule"
                pdfHeadline={{ label: "Monthly EMI", value: `₹${fmt(data.emi)}` }}
                pdfRows={[
                  { label: "Principal Amount", value: `₹${fmt(principal)}` },
                  { label: "Interest Rate", value: `${rate}% p.a.` },
                  { label: "Tenure", value: `${years} years (${years * 12} months)` },
                  { label: "Total Interest", value: `₹${fmt(totalInterest)}` },
                  { label: "Total Payable", value: `₹${fmt(totalPaid)}` },
                ]}
                pdfTable={
                  useYearlyInPdf
                    ? {
                        caption: `Yearly summary (${years} years) — full monthly CSV available via Download CSV`,
                        columns: [
                          { key: "year", label: "Year" },
                          { key: "payment", label: "Payment" },
                          { key: "principal", label: "Principal" },
                          { key: "interest", label: "Interest" },
                          { key: "balance", label: "Balance" },
                        ],
                        rows: yearlyRows.map((r) => ({
                          year: r.year,
                          payment: fmt(r.payment),
                          principal: fmt(r.principal),
                          interest: fmt(r.interest),
                          balance: fmt(r.balance),
                        })),
                      }
                    : {
                        caption: `Monthly schedule — ${years * 12} payments`,
                        columns: [
                          { key: "month", label: "#" },
                          { key: "payment", label: "Payment" },
                          { key: "principal", label: "Principal" },
                          { key: "interest", label: "Interest" },
                          { key: "balance", label: "Balance" },
                        ],
                        rows: data.rows.map((r) => ({
                          month: r.month,
                          payment: fmt(r.payment),
                          principal: fmt(r.principal),
                          interest: fmt(r.interest),
                          balance: fmt(r.balance),
                        })),
                      }
                }
                csvRows={csvRows}
              />
            }
          />
        }
        chart={
          <DonutChart
            centerLabel="EMI"
            centerValue={fmt(data.emi, 0)}
            slices={[
              { label: "Principal", value: principal, color: "#3d9b84" },
              { label: "Interest", value: Math.max(0, totalInterest), color: "#e07a3d" },
            ]}
          />
        }
      >
        <h2>Loan details</h2>
        <InputSlider
          label="Principal amount"
          value={principal}
          min={10000}
          max={50000000}
          step={10000}
          unit="₹"
          onChange={setPrincipal}
        />
        <InputSlider
          label="Annual interest rate"
          value={rate}
          min={0.1}
          max={30}
          step={0.1}
          unit="%"
          onChange={setRate}
        />
        <InputSlider
          label="Tenure"
          value={years}
          min={1}
          max={40}
          step={1}
          unit="years"
          onChange={setYears}
        />
      </CalculatorShell>

      <div className="wrap" style={{ marginTop: -10, marginBottom: 48 }}>
        <div className="panel">
          <h2>Full monthly schedule</h2>
          <p className="meta" style={{ marginBottom: 14 }}>
            {years * 12} payments · scroll to view · PDF includes{" "}
            {useYearlyInPdf ? "yearly summary" : "full monthly table"} · CSV has every month
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Payment</th>
                  <th>Principal</th>
                  <th>Interest</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((r) => (
                  <tr key={r.month}>
                    <td>{r.month}</td>
                    <td>{fmt(r.payment)}</td>
                    <td>{fmt(r.principal)}</td>
                    <td>{fmt(r.interest)}</td>
                    <td>{fmt(r.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
