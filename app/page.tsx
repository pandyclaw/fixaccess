"use client";

import { useState } from "react";
import Link from "next/link";
import { PricingTable } from "@/components/PricingTable";
import {
  ArrowRight,
  Globe,
  Shield,
  Zap,
  AlertTriangle,
  Users,
  Clock,
  ChevronDown,
} from "lucide-react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Scan failed");
        return;
      }

      window.location.href = `/scan/${data.scanId}`;
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      id: "wcag",
      q: "What is WCAG?",
      a: "WCAG (Web Content Accessibility Guidelines) is the international standard for web accessibility, published by the W3C. It defines how to make web content accessible to people with disabilities, including visual, auditory, motor, and cognitive impairments. The current version is WCAG 2.1 with three conformance levels: A, AA, and AAA.",
    },
    {
      id: "deadline",
      q: "What is the April 2026 deadline?",
      a: "In April 2024, the DOJ published a final rule under Title II of the ADA requiring state and local government websites to meet WCAG 2.1 Level AA. Large entities must comply by April 2026, smaller ones by April 2027. Private businesses face increasing litigation risk under Title III.",
    },
    {
      id: "comply",
      q: "What happens if I don\u2019t comply?",
      a: "Non-compliant websites face ADA lawsuits (over 4,000 filed in 2023 alone), DOJ enforcement actions, fines up to $75,000 for first violations and $150,000 for subsequent ones, and loss of customers who can\u2019t use your site.",
    },
    {
      id: "how",
      q: "How does FixAccess work?",
      a: "FixAccess uses Puppeteer to load your page in a real browser, then runs axe-core \u2014 the industry standard accessibility testing engine \u2014 to check against 80+ WCAG rules. Our AI then generates specific code fixes for each violation found.",
    },
    {
      id: "fix",
      q: "How do I fix the issues?",
      a: "Each violation comes with AI-generated fix code that you can copy and paste into your codebase. The fixes include corrected HTML, CSS, and ARIA attributes with explanatory comments. For Pro users, all violations include fix code \u2014 free users get fixes for the most critical issues.",
    },
  ];

  const steps = [
    {
      num: "1",
      icon: Globe,
      title: "Enter Your URL",
      description: "Paste your website URL and click scan. No signup needed.",
    },
    {
      num: "2",
      icon: Zap,
      title: "Instant Scan",
      description:
        "We crawl your page and run 80+ WCAG accessibility checks in seconds.",
    },
    {
      num: "3",
      icon: Shield,
      title: "AI Fix Code",
      description:
        "Get ready-to-use code fixes for every accessibility issue found.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-slate-900">FixAccess</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#how-it-works"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              FAQ
            </a>
            <Link
              href="/dashboard"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Dashboard
            </Link>
          </div>
          <button
            onClick={() =>
              document
                .getElementById("scanner")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Free Scan
          </button>
        </div>
      </nav>

      {/* Urgency Banner */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-center gap-2 text-sm text-amber-800">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
          <span>
            <span className="font-medium">
              ADA compliance deadline: April 2026.
            </span>{" "}
            96% of websites fail WCAG standards.
          </span>
        </div>
      </div>

      {/* Hero */}
      <section className="pt-20 pb-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
            Your website might be{" "}
            <span className="text-red-600">breaking the law.</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            Most websites fail WCAG accessibility standards. Starting April
            2026, non-compliance means lawsuits. Scan your site in 30 seconds
            and get AI-generated fix code.
          </p>

          {/* Scanner Form */}
          <form
            id="scanner"
            onSubmit={handleScan}
            className="mt-10 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
          >
            <div className="flex-1 relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter your website URL..."
                className="w-full pl-10 h-12 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="h-12 px-8 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-base rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Scanning...
                </>
              ) : (
                <>Scan Free &rarr;</>
              )}
            </button>
          </form>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <p className="mt-3 text-xs text-slate-400">
            No signup required &middot; Results in under 30 seconds &middot;
            Free for 3 scans/month
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 text-center">
          <div>
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <p className="text-3xl font-bold text-slate-900">1B+</p>
            <p className="text-sm text-slate-500 mt-1">
              People with disabilities worldwide
            </p>
          </div>
          <div>
            <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-3" />
            <p className="text-3xl font-bold text-slate-900">96%</p>
            <p className="text-sm text-slate-500 mt-1">
              Of websites fail WCAG standards
            </p>
          </div>
          <div>
            <Clock className="h-8 w-8 text-red-500 mx-auto mb-3" />
            <p className="text-3xl font-bold text-slate-900">4,600+</p>
            <p className="text-sm text-slate-500 mt-1">
              ADA lawsuits filed in 2023
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map(({ num, icon: Icon, title, description }) => (
              <div key={title} className="text-center relative">
                <div className="relative mx-auto mb-4 w-14 h-14">
                  <span className="absolute -top-4 -left-3 text-7xl font-black text-slate-100 select-none leading-none">
                    {num}
                  </span>
                  <div className="relative w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <Icon className="h-7 w-7 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {title}
                </h3>
                <p className="text-sm text-slate-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">
            Simple Pricing
          </h2>
          <p className="text-slate-500 text-center mb-12">
            Start free. Upgrade when you need more.
          </p>
          <PricingTable />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-2">
            {faqs.map((faq) => (
              <div key={faq.id} className="border border-slate-200 rounded-xl">
                <button
                  onClick={() =>
                    setOpenFaq(openFaq === faq.id ? null : faq.id)
                  }
                  className="w-full flex items-center justify-between px-5 py-4 text-left text-slate-900 hover:text-slate-700 font-medium"
                >
                  {faq.q}
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform ${openFaq === faq.id ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === faq.id && (
                  <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-bold text-slate-900">FixAccess</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-700">
              Privacy
            </a>
            <a href="#" className="hover:text-slate-700">
              Terms
            </a>
            <a href="#" className="hover:text-slate-700">
              Contact
            </a>
            <a
              href="https://www.w3.org/WAI/standards-guidelines/wcag/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-700"
            >
              WCAG Reference
            </a>
          </div>
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} FixAccess. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
