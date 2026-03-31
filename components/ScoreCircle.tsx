"use client";

import { getScoreColor, getScoreLabel } from "@/lib/score";

interface ScoreCircleProps {
  score: number;
  size?: number;
}

export function ScoreCircle({ score, size = 120 }: ScoreCircleProps) {
  const r = size * 0.4;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - score / 100);
  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#27272a"
          strokeWidth={8}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-3xl font-bold" style={{ color }}>{score}</span>
        <span className="text-xs text-zinc-500">/ 100</span>
      </div>
      <span className="text-sm font-medium" style={{ color }}>{label}</span>
    </div>
  );
}
