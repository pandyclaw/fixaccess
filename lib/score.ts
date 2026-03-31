export function getScoreColor(score: number): string {
  if (score >= 80) return "#22c55e";
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
      return "bg-red-50 text-red-700 border-red-200";
    case "serious":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "moderate":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "minor":
      return "bg-blue-50 text-blue-700 border-blue-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}
