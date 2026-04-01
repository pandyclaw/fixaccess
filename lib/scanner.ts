import { AxePuppeteer } from "@axe-core/puppeteer";

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
        case "critical": score -= 10; break;
        case "serious": score -= 5; break;
        case "moderate": score -= 2; break;
        case "minor": score -= 1; break;
      }
    }
  }
  return Math.max(0, Math.min(100, score));
}

async function getBrowser() {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteerCore = (await import("puppeteer-core")).default;
    return puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport as any,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless as any,
    });
  } else {
    const puppeteer = (await import("puppeteer")).default;
    return puppeteer.launch({ headless: true });
  }
}

export async function scanUrl(url: string): Promise<ScanResult> {
  const normalizedUrl = normalizeUrl(url);
  const start = Date.now();
  const browser = await getBrowser();

  try {
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (compatible; FixAccess Scanner/1.0)");
    await page.goto(normalizedUrl, { waitUntil: "domcontentloaded", timeout: 30000 });

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

    return {
      url: normalizedUrl,
      score: calculateScore(violations),
      violations,
      passes: results.passes.length,
      scanTime: Date.now() - start,
      timestamp: new Date().toISOString(),
    };
  } finally {
    await browser.close();
  }
}
