import { NextResponse } from "next/server";
import { scanUrl } from "@/lib/scanner";
import { generateFix } from "@/lib/ai-fixer";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const maxDuration = 60;

const FREE_SCAN_LIMIT = 3;

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Get session and user
    let userId: string | null = null;
    let isPro = false;
    let user = null;

    try {
      const session = await getServerSession(authOptions);
      userId = (session?.user as { id?: string })?.id || null;
      if (userId) {
        user = await prisma.user.findUnique({ where: { id: userId } });
        isPro = user?.subscription === "pro";
      }
    } catch {
      // No session — treat as anonymous free user
    }

    // Enforce free scan limit for logged-in free users
    if (userId && user && !isPro) {
      const now = new Date();
      const resetDate = new Date(user.scanResetDate);
      const monthDiff =
        (now.getFullYear() - resetDate.getFullYear()) * 12 +
        (now.getMonth() - resetDate.getMonth());

      // Reset count if a new month has passed
      if (monthDiff >= 1) {
        await prisma.user.update({
          where: { id: userId },
          data: { scanCount: 0, scanResetDate: now },
        });
        user = { ...user, scanCount: 0, scanResetDate: now };
      }

      if (user.scanCount >= FREE_SCAN_LIMIT) {
        return NextResponse.json(
          {
            error: `Free plan limit reached. You've used all ${FREE_SCAN_LIMIT} free scans this month.`,
            limitReached: true,
            upgradeUrl: "/pricing",
          },
          { status: 403 }
        );
      }
    }

    // Run the scan
    const result = await scanUrl(url);

    // Only generate AI fixes for Pro users
    let fixes: Record<string, string> = {};
    if (isPro) {
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
      fixes = Object.fromEntries(fixEntries);
    }

    // Save scan to DB
    const scan = await prisma.scan.create({
      data: {
        url: result.url,
        score: result.score,
        violations: JSON.stringify(result.violations),
        fixes: JSON.stringify(fixes),
        userId,
      },
    });

    // Increment scan count for logged-in free users
    if (userId && !isPro) {
      await prisma.user.update({
        where: { id: userId },
        data: { scanCount: { increment: 1 } },
      });
    }

    const scansUsed = userId && !isPro ? (user?.scanCount ?? 0) + 1 : null;
    const scansRemaining =
      scansUsed !== null ? Math.max(0, FREE_SCAN_LIMIT - scansUsed) : null;

    return NextResponse.json({
      scanId: scan.id,
      ...result,
      fixes,
      isPro,
      scansUsed,
      scansRemaining,
      freeLimit: FREE_SCAN_LIMIT,
    });
  } catch (error) {
    console.error("Scan error:", error);
    const message = error instanceof Error ? error.message : "Scan failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
