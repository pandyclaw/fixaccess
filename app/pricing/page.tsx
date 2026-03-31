import { Shield } from "lucide-react";
import { PricingTable } from "@/components/PricingTable";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-bold text-slate-900">FixAccess</span>
          </Link>
          <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">← Back</Link>
        </div>
      </nav>

      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h1 className="text-4xl font-bold text-slate-900">Simple, Transparent Pricing</h1>
            <p className="mt-4 text-lg text-slate-600">Start free. No credit card required. Upgrade when you need more.</p>
          </div>
          <PricingTable />
          <div className="mt-12 text-center">
            <p className="text-sm text-slate-500">All plans include SSL encryption, GDPR compliance, and 99.9% uptime SLA.</p>
            <p className="text-sm text-slate-500 mt-2">Questions? <a href="mailto:hello@fixaccess.io" className="text-blue-600 hover:text-blue-700">Contact us</a></p>
          </div>
        </div>
      </section>
    </div>
  );
}
