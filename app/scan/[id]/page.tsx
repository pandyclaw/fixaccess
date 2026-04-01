import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ScanResults } from "./ScanResults";
import type { Violation } from "@/lib/scanner";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ScanPage({ params }: PageProps) {
  const { id } = await params;
  const scan = await prisma.scan.findUnique({ where: { id } });

  if (!scan) {
    notFound();
  }

  // Determine if viewer is Pro
  let isPro = false;
  let scansRemaining: number | null = null;
  const FREE_SCAN_LIMIT = 3;

  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      isPro = user?.subscription === "pro";
      if (!isPro) {
        scansRemaining = Math.max(0, FREE_SCAN_LIMIT - (user?.scanCount ?? 0));
      }
    }
  } catch {
    // Unauthenticated — free view
  }

  const violations: Violation[] = JSON.parse(scan.violations);
  const fixes: Record<string, string> = JSON.parse(
    (scan as typeof scan & { fixes?: string }).fixes ?? "{}"
  );

  return (
    <ScanResults
      scanId={scan.id}
      url={scan.url}
      score={scan.score}
      violations={violations}
      fixes={fixes}
      isPro={isPro}
      scansRemaining={scansRemaining}
      freeLimit={FREE_SCAN_LIMIT}
      createdAt={scan.createdAt.toISOString()}
    />
  );
}
