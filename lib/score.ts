export function getScoreColor(score: number): string {
  if (score >= 80) return "#10b981";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Good";
  if (score >= 50) return "Needs Work";
  if (score >= 25) return "Poor";
  return "Critical";
}

export function getImpactBadgeColor(impact: string): string {
  switch (impact) {
    case "critical":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "serious":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case "moderate":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "minor":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    default:
      return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
  }
}
