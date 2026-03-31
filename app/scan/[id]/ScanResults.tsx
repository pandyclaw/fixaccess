"use client";

import { useState } from "react";
import { ArrowLeft, ExternalLink, Shield } from "lucide-react";
import { ScoreCircle } from "@/components/ScoreCircle";
import { IssueCard } from "@/components/IssueCard";
import type { Violation } from "@/lib/scanner";

interface ScanResultsProps {
  scanId: string;
  url: string;
  score: number;
  violations: Violation[];
  createdAt: string;
}

const impactColors: Record<string, string> = {
  critical: "bg-red-50 text-red-700 border-red-200",
  serious: "bg-orange-50 text-orange-700 border-orange-200",
  moderate: "bg-amber-50 text-amber-700 border-amber-200",
  minor: "bg-blue-50 text-blue-700 border-blue-200",
};

const tabs = ["all", "critical", "serious", "moderate", "minor"] as const;

export function ScanResults({ url, score, violations, createdAt }: ScanResultsProps) {
  const [activeTab, setActiveTab] = useState("all");

  const counts = {
    critical: violations.filter((v) => v.impact === "critical").length,
    serious: violations.filter((v) => v.impact === "serious").length,
    moderate: violations.filter((v) => v.impact === "moderate").length,
    minor: violations.filter((v) => v.impact === "minor").length,
  };

  const filtered =
    activeTab === "all"
      ? violations
      : violations.filter((v) => v.impact === activeTab);

  const hasLockedIssues = violations.some(
    (v) => v.impact === "critical" || v.impact === "serious"
  );

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="text-xl font-bold text-slate-900">FixAccess</span>
          </a>
          <a href="/dashboard" className="text-sm text-slate-600 hover:text-slate-900">Dashboard</a>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-12">
          <div className="relative">
            <ScoreCircle score={score} size={140} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-slate-900 hover:text-blue-600 flex items-center gap-1.5 font-medium"
              >
                {url} <ExternalLink className="h-4 w-4 text-slate-400" />
              </a>
            </div>
            <p className="text-sm text-slate-500">
              Scanned on {new Date(createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              {violations.length} {violations.length === 1 ? "issue" : "issues"} found &middot;{" "}
              {violations.reduce((acc, v) => acc + v.nodes.length, 0)} affected elements
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {(["critical", "serious", "moderate", "minor"] as const).map((impact) => (
            <div
              key={impact}
              className={`rounded-xl border p-4 text-center ${impactColors[impact]}`}
            >
              <span className="text-xs font-semibold uppercase tracking-wider">
                {impact}
              </span>
              <p className="text-2xl font-bold mt-1">{counts[impact]}</p>
            </div>
          ))}
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-1 border-b border-slate-200 mb-6">
          {tabs.map((tab) => {
            const count = tab === "all" ? violations.length : counts[tab];
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? "text-blue-600 border-blue-600"
                    : "text-slate-500 border-transparent hover:text-slate-700"
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>

        {/* Violations List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No {activeTab} issues found.
            </div>
          ) : (
            filtered.map((violation) => (
              <IssueCard key={violation.id} violation={violation} isPro={true} />
            ))
          )}
        </div>

        {/* Bottom CTA */}
        {hasLockedIssues && (
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-900">Unlock all fix code</p>
              <p className="text-sm text-slate-600 mt-1">Get AI-generated fixes for every violation on your site.</p>
            </div>
            <a
              href="/pricing"
              className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              Upgrade to Pro &mdash; $29/mo
            </a>
          </div>
        )}

        {/* Run Another */}
        <div className="text-center mt-12 pb-8">
          <a
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2.5 rounded-lg transition-colors"
          >
            Run Another Scan
          </a>
        </div>
      </div>
    </div>
  );
}
