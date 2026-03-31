import { ArrowLeft } from "lucide-react";
import { PricingTable } from "@/components/PricingTable";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#09090b]">
      <nav className="border-b border-zinc-800/50 bg-[#09090b]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-xl font-bold text-emerald-400">FixAccess</span>
          </a>
        </div>
      </nav>

      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white text-center mb-4">Choose Your Plan</h1>
          <p className="text-zinc-500 text-center mb-12 max-w-lg mx-auto">
            Start with a free scan. Upgrade to Pro for unlimited scans and AI fix code for every issue.
          </p>
          <PricingTable />
        </div>
      </div>

      <div className="py-16 px-4 border-t border-zinc-800/50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Common Questions</h2>
          <Accordion className="space-y-2">
            <AccordionItem value="trial" className="bg-zinc-900 border border-zinc-800 rounded-xl px-4">
              <AccordionTrigger className="text-zinc-200 hover:text-white">
                Is there a free trial?
              </AccordionTrigger>
              <AccordionContent className="text-zinc-400">
                Yes! The Free plan gives you 3 scans per month with basic issue detection. You can upgrade to Pro
                anytime for unlimited scans and full AI fix code.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="cancel" className="bg-zinc-900 border border-zinc-800 rounded-xl px-4">
              <AccordionTrigger className="text-zinc-200 hover:text-white">
                Can I cancel anytime?
              </AccordionTrigger>
              <AccordionContent className="text-zinc-400">
                Absolutely. Cancel your subscription at any time. You&apos;ll retain access until the end of your
                billing period.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <div className="py-12 px-4 border-t border-zinc-800/50 text-center">
        <p className="text-zinc-500">
          Questions? Contact us at{" "}
          <span className="text-emerald-400">support@fixaccess.com</span>
        </p>
      </div>
    </div>
  );
}
