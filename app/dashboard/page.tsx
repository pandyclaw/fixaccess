import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getScoreColor } from "@/lib/score";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const userId = (session.user as { id?: string }).id;
  const scans = await prisma.scan.findMany({
    where: { userId: userId || undefined },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

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
        <h1 className="text-3xl font-bold text-white mb-8">Your Scans</h1>

        {scans.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-zinc-500 mb-4">No scans yet. Run your first scan!</p>
            <a href="/" className="text-emerald-400 hover:text-emerald-300 text-sm">
              Go to scanner →
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {scans.map((scan) => {
              const color = getScoreColor(scan.score);
              return (
                <a
                  key={scan.id}
                  href={`/scan/${scan.id}`}
                  className="flex items-center gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800/50 transition-colors"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2"
                    style={{ borderColor: color, color }}
                  >
                    {scan.score}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-200 truncate flex items-center gap-1.5">
                      {scan.url} <ExternalLink className="h-3 w-3 text-zinc-500 shrink-0" />
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {new Date(scan.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
