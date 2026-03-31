import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ScanResults } from "./ScanResults";
import type { Violation } from "@/lib/scanner";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ScanPage({ params }: PageProps) {
  const { id } = await params;
  const scan = await prisma.scan.findUnique({ where: { id } });

  if (!scan) {
    notFound();
  }

  const violations: Violation[] = JSON.parse(scan.violations);

  return (
    <ScanResults
      scanId={scan.id}
      url={scan.url}
      score={scan.score}
      violations={violations}
      createdAt={scan.createdAt.toISOString()}
    />
  );
}
