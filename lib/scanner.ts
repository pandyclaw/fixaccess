import puppeteer from "puppeteer";
import AxePuppeteer from "@axe-core/puppeteer";

export interface ViolationNode {
  html: string;
  target: string[];
  failureSummary: string;
}

export interface Violation {
  id: string;
  impact: string;
  description: string;
  help: string;
  helpUrl: string;
  tags: string[];
  nodes: ViolationNode[];
}

export interface ScanResult {
  url: string;
  score: number;
  violations: Violation[];
  passes: number;
  scanTime: number;
  timestamp: string;
}

function normalizeUrl(url: string): string {
  let normalized = url.trim();
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = "https://" + normalized;
  }
  return normalized;
}

function calculateScore(violations: Violation[]): number {
  let score = 100;
  for (const v of violations) {
    for (const _node of v.nodes) {
      switch (v.impact) {
        case "critical":
          score -= 10;
          break;
        case "serious":
          score -= 6;
          break;
        case "moderate":
          score -= 3;
          break;
        case "minor":
          score -= 1;
          break;
      }
    }
  }
  return Math.max(0, Math.min(100, score));
}

export async function scanUrl(url: string): Promise<ScanResult> {
  const normalizedUrl = normalizeUrl(url);
  const startTime = Date.now();

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  try {
    const page = await browser.newPage();
    await page.goto(normalizedUrl, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    const results = await new AxePuppeteer(page).analyze();

    const violations: Violation[] = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact || "minor",
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      tags: v.tags,
      nodes: v.nodes.map((n) => ({
        html: n.html,
        target: n.target.map(String),
        failureSummary: n.failureSummary || "",
      })),
    }));

    const score = calculateScore(violations);
    const scanTime = Date.now() - startTime;

    return {
      url: normalizedUrl,
      score,
      violations,
      passes: results.passes.length,
      scanTime,
      timestamp: new Date().toISOString(),
    };
  } finally {
    await browser.close();
  }
}
