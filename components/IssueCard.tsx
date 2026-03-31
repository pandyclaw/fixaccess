"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, ExternalLink, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FixCode } from "./FixCode";
import { getImpactBadgeColor } from "@/lib/score";
import type { Violation } from "@/lib/scanner";

interface IssueCardProps {
  violation: Violation;
  fix?: string;
  isPro?: boolean;
}

export function IssueCard({ violation, fix, isPro = true }: IssueCardProps) {
  const [expanded, setExpanded] = useState(false);
  const badgeColor = getImpactBadgeColor(violation.impact);
  const needsUpgrade = !isPro && (violation.impact === "critical" || violation.impact === "serious");

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-zinc-800/50 transition-colors"
      >
        {expanded ? (
          <ChevronDown className="h-4 w-4 text-zinc-500 shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 text-zinc-500 shrink-0" />
        )}
        <Badge variant="outline" className={`${badgeColor} border text-xs shrink-0`}>
          {violation.impact}
        </Badge>
        <span className="text-sm text-zinc-200 flex-1">{violation.help}</span>
        <Badge variant="outline" className="text-xs text-zinc-500 border-zinc-700 shrink-0">
          {violation.nodes.length} {violation.nodes.length === 1 ? "element" : "elements"}
        </Badge>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-zinc-800 pt-4">
          <p className="text-sm text-zinc-400">{violation.description}</p>

          <div>
            <h4 className="text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">Affected Elements</h4>
            {violation.nodes.slice(0, 3).map((node, i) => (
              <pre key={i} className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 mb-2 overflow-x-auto">
                <code className="text-xs text-zinc-400">{node.html}</code>
              </pre>
            ))}
            {violation.nodes.length > 3 && (
              <p className="text-xs text-zinc-600">+ {violation.nodes.length - 3} more elements</p>
            )}
          </div>

          <a
            href={violation.helpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300"
          >
            WCAG Guideline <ExternalLink className="h-3 w-3" />
          </a>

          {fix && (
            <div className="relative">
              <h4 className="text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">AI Fix Suggestion</h4>
              {needsUpgrade ? (
                <div className="relative">
                  <div className="blur-sm pointer-events-none">
                    <FixCode code={fix} />
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/80 rounded-lg">
                    <Lock className="h-5 w-5 text-zinc-500 mb-2" />
                    <p className="text-sm text-zinc-400">Upgrade to Pro to see fix code</p>
                    <a href="/pricing" className="mt-2 text-xs text-emerald-400 hover:text-emerald-300">
                      View Plans →
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
