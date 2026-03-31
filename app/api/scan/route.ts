import { NextResponse } from "next/server";
import { scanUrl } from "@/lib/scanner";
import { generateFix } from "@/lib/ai-fixer";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const result = await scanUrl(url);

    const topViolations = result.violations
      .filter((v) => v.impact === "critical" || v.impact === "serious")
      .slice(0, 5);

    const fixEntries = await Promise.all(
      topViolations.map(async (v) => {
        try {
          const fix = await generateFix(v);
          return [v.id, fix] as const;
        } catch {
          return [v.id, "// Fix generation failed"] as const;
        }
      })
    );

    const fixes: Record<string, string> = Object.fromEntries(fixEntries);

    let userId: string | null = null;
    try {
      const session = await getServerSession(authOptions);
      userId = (session?.user as { id?: string })?.id || null;
    } catch {
      // No session
    }

    const scan = await prisma.scan.create({
      data: {
        url: result.url,
        score: result.score,
        violations: JSON.stringify(result.violations),
        userId,
      },
    });

    return NextResponse.json({
      scanId: scan.id,
      ...result,
      fixes,
    });
  } catch (error) {
    console.error("Scan error:", error);
    const message = error instanceof Error ? error.message : "Scan failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
