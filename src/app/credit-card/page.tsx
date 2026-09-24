"use client";

import { useMemo, useState } from "react";
import { creditCardPayoff, fmt } from "@/lib/calculators";
import CalculatorShell from "@/components/CalculatorShell";
import InputSlider from "@/components/ui/InputSlider";
import ResultCard from "@/components/ui/ResultCard";
import ResultActions from "@/components/ui/ResultActions";

export default function CreditCardPage() {
  const [balance, setBalance] = useState(50000);
  const [rate, setRate] = useState(24);
  const [payment, setPayment] = useState(5000);
  const result = useMemo(
    () => creditCardPayoff(balance, rate, payment),
    [balance, rate, payment]
  );

  return (
    <CalculatorShell
      title="Credit Card Payoff"
      description="Live payoff time and total interest."
      toolId="credit-card"
      result={
        isFinite(result.months) ? (
          <ResultCard
            title="Credit Card Payoff Result"
            headlineLabel="Months to Pay Off"
            headlineValue={String(result.months)}
            metaLine={`Balance ₹${fmt(balance, 0)} · ${rate}% · Pay ₹${fmt(payment, 0)}/mo`}
            accent="orange"
            breakdown={[
              { label: "Total Interest", value: `₹${fmt(result.totalInterest)}`, icon: "%" },
              { label: "Total Paid", value: `₹${fmt(result.totalPaid)}`, icon: "Σ" },
              { label: "Current Balance", value: `₹${fmt(balance)}`, icon: "₹" },
            ]}
            actions={
              <ResultActions
                copyText={`${result.months} months to pay off\nInterest ₹${fmt(result.totalInterest)}\nTotal paid ₹${fmt(result.totalPaid)}`}
                path="/credit-card"
                shareParams={{ balance, rate, payment }}
                pdfTitle="Credit Card Payoff Result"
                pdfHeadline={{ label: "Months to Pay Off", value: String(result.months) }}
                pdfRows={[
                  { label: "Balance", value: `₹${fmt(balance)}` },
                  { label: "APR", value: `${rate}%` },
                  { label: "Monthly Payment", value: `₹${fmt(payment)}` },
                  { label: "Months", value: String(result.months) },
                  { label: "Total Interest", value: `₹${fmt(result.totalInterest)}` },
                  { label: "Total Paid", value: `₹${fmt(result.totalPaid)}` },
                ]}
              />
            }
          />
        ) : (
          <div className="meta">Payment too low — debt never pays off.</div>
        )
      }
    >
      <InputSlider label="Balance" value={balance} min={0} max={5000000} step={1000} unit="₹" onChange={setBalance} />
      <InputSlider label="Annual rate" value={rate} min={0} max={60} step={0.1} unit="%" onChange={setRate} />
      <InputSlider label="Monthly payment" value={payment} min={0} max={500000} step={100} unit="₹" onChange={setPayment} />
    </CalculatorShell>
  );
}
