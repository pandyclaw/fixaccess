"use client";

import { useState } from "react";
import { ArrowRight, Globe, Shield, Zap, Clock, AlertTriangle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PricingTable } from "@/components/PricingTable";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800/50 bg-[#09090b]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-emerald-400">FixAccess</span>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">Pricing</a>
            <a href="#faq" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">FAQ</a>
          </div>
          <Button
            onClick={() => document.getElementById("scanner")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-sm"
          >
            Free Scan
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-1.5 rounded-full mb-8">
            <AlertTriangle className="h-4 w-4" />
            ADA compliance deadline: April 2026
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight">
            Your website might be{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400">
              breaking the law.
            </span>
          </h1>
          <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">
            Most websites fail WCAG accessibility standards. Starting April 2026, non-compliance means lawsuits.
            Scan your site in 30 seconds and get AI-generated fix code.
          </p>

          {/* Scanner Form */}
          <form
            id="scanner"
            onSubmit={handleScan}
            className="mt-10 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
          >
            <div className="flex-1 relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter your website URL..."
                className="pl-10 h-12 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600 text-base"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-base"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Scanning...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Scan Now <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
          <p className="mt-3 text-xs text-zinc-600">No signup required · Results in 30 seconds</p>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-12 border-y border-zinc-800/50">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 text-center">
          <div>
            <Users className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
            <p className="text-3xl font-bold text-white">1B+</p>
            <p className="text-sm text-zinc-500 mt-1">People with disabilities worldwide</p>
          </div>
          <div>
            <AlertTriangle className="h-8 w-8 text-amber-400 mx-auto mb-3" />
            <p className="text-3xl font-bold text-white">96%</p>
            <p className="text-sm text-zinc-500 mt-1">Of websites fail WCAG standards</p>
          </div>
          <div>
            <Clock className="h-8 w-8 text-red-400 mx-auto mb-3" />
            <p className="text-3xl font-bold text-white">April 2026</p>
            <p className="text-sm text-zinc-500 mt-1">ADA compliance deadline</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Globe, title: "Enter Your URL", description: "Paste your website URL and click scan. No signup needed." },
              { icon: Zap, title: "Instant Scan", description: "We crawl your page and run 80+ WCAG accessibility checks in seconds." },
              { icon: Shield, title: "AI Fix Code", description: "Get ready-to-use code fixes for every accessibility issue found." },
            ].map(({ icon: Icon, title, description }) => (
              <div key={title} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-7 w-7 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-zinc-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-zinc-950/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">Simple Pricing</h2>
          <p className="text-zinc-500 text-center mb-12">Start free. Upgrade when you need more.</p>
          <PricingTable />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
          <Accordion className="space-y-2">
            <AccordionItem value="wcag" className="bg-zinc-900 border border-zinc-800 rounded-xl px-4">
              <AccordionTrigger className="text-zinc-200 hover:text-white">
                What is WCAG?
              </AccordionTrigger>
              <AccordionContent className="text-zinc-400">
                WCAG (Web Content Accessibility Guidelines) is the international standard for web accessibility,
                published by the W3C. It defines how to make web content accessible to people with disabilities,
                including visual, auditory, motor, and cognitive impairments. The current version is WCAG 2.1 with
                three conformance levels: A, AA, and AAA.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="deadline" className="bg-zinc-900 border border-zinc-800 rounded-xl px-4">
              <AccordionTrigger className="text-zinc-200 hover:text-white">
                What is the April 2026 deadline?
              </AccordionTrigger>
              <AccordionContent className="text-zinc-400">
                In April 2024, the DOJ published a final rule under Title II of the ADA requiring state and local
                government websites to meet WCAG 2.1 Level AA. Large entities must comply by April 2026, smaller
                ones by April 2027. Private businesses face increasing litigation risk under Title III.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="comply" className="bg-zinc-900 border border-zinc-800 rounded-xl px-4">
              <AccordionTrigger className="text-zinc-200 hover:text-white">
                What happens if I don&apos;t comply?
              </AccordionTrigger>
              <AccordionContent className="text-zinc-400">
                Non-compliant websites face ADA lawsuits (over 4,000 filed in 2023 alone), DOJ enforcement actions,
                fines up to $75,000 for first violations and $150,000 for subsequent ones, and loss of customers
                who can&apos;t use your site.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="how" className="bg-zinc-900 border border-zinc-800 rounded-xl px-4">
              <AccordionTrigger className="text-zinc-200 hover:text-white">
                How does FixAccess work?
              </AccordionTrigger>
              <AccordionContent className="text-zinc-400">
                FixAccess uses Puppeteer to load your page in a real browser, then runs axe-core — the industry
                standard accessibility testing engine — to check against 80+ WCAG rules. Our AI then generates
                specific code fixes for each violation found.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="fix" className="bg-zinc-900 border border-zinc-800 rounded-xl px-4">
              <AccordionTrigger className="text-zinc-200 hover:text-white">
                How do I fix the issues?
              </AccordionTrigger>
              <AccordionContent className="text-zinc-400">
                Each violation comes with AI-generated fix code that you can copy and paste into your codebase.
                The fixes include corrected HTML, CSS, and ARIA attributes with explanatory comments. For Pro users,
                all violations include fix code — free users get fixes for the most critical issues.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-lg font-bold text-emerald-400">FixAccess</span>
          <p className="text-sm text-zinc-600">© {new Date().getFullYear()} FixAccess. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
