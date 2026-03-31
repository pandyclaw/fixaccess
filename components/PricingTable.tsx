"use client";

import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Try it out with basic scans",
    features: ["3 scans per month", "Basic issue detection", "WCAG 2.1 coverage", "Score & summary report"],
    cta: "Start Free",
    href: "/",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For developers & small teams",
    features: ["Unlimited scans", "AI fix code for all issues", "Full violation details", "PDF export reports", "Priority support", "API access"],
    cta: "Start Pro Trial",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    highlighted: true,
  },
  {
    name: "Agency",
    price: "$99",
    period: "/month",
    description: "For agencies managing multiple sites",
    features: ["Everything in Pro", "50 monitored sites", "Weekly automated scans", "White-label reports", "Team collaboration", "Dedicated support"],
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
      if (data.url) window.location.href = data.url;
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={`relative rounded-xl p-6 flex flex-col ${
            plan.highlighted
              ? "bg-blue-600 text-white shadow-xl ring-2 ring-blue-600"
              : "bg-white border border-slate-200"
          }`}
        >
          {plan.highlighted && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
              MOST POPULAR
            </span>
          )}
          <div className={`text-sm mb-1 ${plan.highlighted ? "text-blue-200" : "text-slate-500"}`}>{plan.description}</div>
          <h3 className={`text-xl font-bold ${plan.highlighted ? "text-white" : "text-slate-900"}`}>{plan.name}</h3>
          <div className="mt-2 flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-bold">{plan.price}</span>
            <span className={`text-sm ${plan.highlighted ? "text-blue-200" : "text-slate-500"}`}>{plan.period}</span>
          </div>
          <ul className="space-y-3 flex-1 mb-6">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm">
                <Check className={`h-4 w-4 shrink-0 mt-0.5 ${plan.highlighted ? "text-blue-200" : "text-green-500"}`} />
                <span className={plan.highlighted ? "text-white" : "text-slate-700"}>{feature}</span>
              </li>
            ))}
          </ul>
          <button
            className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors ${
              plan.highlighted
                ? "bg-white text-blue-600 hover:bg-blue-50"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            onClick={() => {
              if (plan.priceId) handleCheckout(plan.priceId);
              else if (plan.href) window.location.href = plan.href;
            }}
          >
            {plan.cta}
          </button>
        </div>
      ))}
    </div>
  );
}
