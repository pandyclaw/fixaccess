"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Try it out with basic scans",
    features: [
      "3 scans per month",
      "Basic issue detection",
      "WCAG 2.1 coverage",
      "Score & summary report",
    ],
    cta: "Start Free",
    href: "/",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For developers & small teams",
    features: [
      "Unlimited scans",
      "AI fix code for all issues",
      "Full violation details",
      "PDF export reports",
      "Priority support",
      "API access",
    ],
    cta: "Start Pro Trial",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    highlighted: true,
  },
  {
    name: "Agency",
    price: "$99",
    period: "/month",
    description: "For agencies managing multiple sites",
    features: [
      "Everything in Pro",
      "50 monitored sites",
      "Weekly automated scans",
      "White-label reports",
      "Team collaboration",
      "Dedicated support",
    ],
    cta: "Start Agency Trial",
    priceId: process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID,
    highlighted: false,
  },
];

export function PricingTable() {
  const handleCheckout = async (priceId: string) => {
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={`rounded-2xl p-6 flex flex-col ${
            plan.highlighted
              ? "bg-zinc-900 border-2 border-emerald-500/50 relative"
              : "bg-zinc-900/50 border border-zinc-800"
          }`}
        >
          {plan.highlighted && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-xs font-bold px-3 py-1 rounded-full">
              Most Popular
            </span>
          )}
          <h3 className="text-lg font-semibold text-zinc-200">{plan.name}</h3>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-4xl font-bold text-white">{plan.price}</span>
            <span className="text-zinc-500">{plan.period}</span>
          </div>
          <p className="mt-2 text-sm text-zinc-500">{plan.description}</p>
          <ul className="mt-6 space-y-3 flex-1">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-zinc-300">
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                {feature}
              </li>
            ))}
          </ul>
          <Button
            className={`mt-6 w-full ${
              plan.highlighted
                ? "bg-emerald-500 hover:bg-emerald-600 text-black font-semibold"
                : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
            }`}
            onClick={() => {
              if (plan.priceId) handleCheckout(plan.priceId);
              else if (plan.href) window.location.href = plan.href;
            }}
          >
            {plan.cta}
          </Button>
        </div>
      ))}
    </div>
  );
}
