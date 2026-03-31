import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ScanNotFound() {
  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Scan Not Found</h1>
        <p className="text-zinc-500 mb-8">This scan may have expired or the ID is invalid.</p>
        <a href="/">
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </a>
      </div>
    </div>
  );
}
