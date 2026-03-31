"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, ExternalLink, Lock } from "lucide-react";
import { FixCode } from "./FixCode";
import type { Violation } from "@/lib/scanner";

interface IssueCardProps {
  violation: Violation;
  fix?: string;
  isPro?: boolean;
}

const impactBadge: Record<string, string> = {
  critical: "bg-red-50 text-red-700 border-red-200",
  serious: "bg-orange-50 text-orange-700 border-orange-200",
  moderate: "bg-amber-50 text-amber-700 border-amber-200",
  minor: "bg-blue-50 text-blue-700 border-blue-200",
};

export function IssueCard({ violation, fix, isPro = true }: IssueCardProps) {
  const [expanded, setExpanded] = useState(false);
  const badge = impactBadge[violation.impact] || "bg-slate-50 text-slate-700 border-slate-200";
  const needsUpgrade = !isPro && (violation.impact === "critical" || violation.impact === "serious");

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 transition-colors"
      >
        {expanded ? (
          <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
        )}
        <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-semibold border capitalize shrink-0 ${badge}`}>
          {violation.impact}
        </span>
        <span className="text-sm text-slate-900 flex-1">{violation.help}</span>
        <span className="text-xs text-slate-400 border border-slate-200 px-2 py-0.5 rounded-md shrink-0">
          {violation.nodes.length} {violation.nodes.length === 1 ? "element" : "elements"}
        </span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-slate-200 pt-4">
          <p className="text-sm text-slate-600">{violation.description}</p>

          <div>
            <h4 className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Affected Elements</h4>
            {violation.nodes.slice(0, 3).map((node, i) => (
              <pre key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-2 overflow-x-auto">
                <code className="text-xs text-slate-700">{node.html}</code>
              </pre>
            ))}
            {violation.nodes.length > 3 && (
              <p className="text-xs text-slate-400">+ {violation.nodes.length - 3} more elements</p>
            )}
          </div>

          <a
            href={violation.helpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            WCAG Guideline <ExternalLink className="h-3 w-3" />
          </a>

          {fix && (
            <div className="relative">
              <h4 className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">AI Fix Suggestion</h4>
              {needsUpgrade ? (
                <div className="relative">
                  <div className="blur-sm pointer-events-none">
                    <FixCode code={fix} />
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 rounded-lg">
                    <Lock className="h-5 w-5 text-slate-400 mb-2" />
                    <p className="text-sm text-slate-600">Upgrade to Pro to see fix code</p>
                    <a href="/pricing" className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium">
                      View Plans &rarr;
                    </a>
                  </div>
                </div>
              ) : (
                <FixCode code={fix} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
