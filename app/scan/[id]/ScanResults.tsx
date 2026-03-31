"use client";

import { useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScoreCircle } from "@/components/ScoreCircle";
import { IssueCard } from "@/components/IssueCard";
import { getImpactBadgeColor } from "@/lib/score";
import type { Violation } from "@/lib/scanner";

interface ScanResultsProps {
  scanId: string;
  url: string;
  score: number;
  violations: Violation[];
  createdAt: string;
}

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

  return (
    <div className="min-h-screen bg-[#09090b]">
      <nav className="border-b border-zinc-800/50 bg-[#09090b]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-xl font-bold text-emerald-400">FixAccess</span>
          </a>
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
                className="text-lg text-zinc-200 hover:text-white flex items-center gap-1.5"
              >
                {url} <ExternalLink className="h-4 w-4 text-zinc-500" />
              </a>
            </div>
            <p className="text-sm text-zinc-500">
              Scanned on {new Date(createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-sm text-zinc-500 mt-1">
              {violations.length} {violations.length === 1 ? "issue" : "issues"} found ·{" "}
              {violations.reduce((acc, v) => acc + v.nodes.length, 0)} affected elements
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {(["critical", "serious", "moderate", "minor"] as const).map((impact) => (
            <div
              key={impact}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center"
            >
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${getImpactBadgeColor(impact)} mb-2`}>
                {impact}
              </span>
              <p className="text-2xl font-bold text-white">{counts[impact]}</p>
            </div>
          ))}
        </div>

        {/* Violations List */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-zinc-900 border border-zinc-800 mb-6">
            <TabsTrigger value="all" className="data-[state=active]:bg-zinc-700">
              All ({violations.length})
            </TabsTrigger>
            <TabsTrigger value="critical" className="data-[state=active]:bg-zinc-700">
              Critical ({counts.critical})
            </TabsTrigger>
            <TabsTrigger value="serious" className="data-[state=active]:bg-zinc-700">
              Serious ({counts.serious})
            </TabsTrigger>
            <TabsTrigger value="moderate" className="data-[state=active]:bg-zinc-700">
              Moderate ({counts.moderate})
            </TabsTrigger>
            <TabsTrigger value="minor" className="data-[state=active]:bg-zinc-700">
              Minor ({counts.minor})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-zinc-500">
                No {activeTab} issues found.
              </div>
            ) : (
              filtered.map((violation) => (
                <IssueCard key={violation.id} violation={violation} isPro={true} />
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <div className="text-center mt-16 pb-8">
          <a href="/">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-8">
              Run Another Scan
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
