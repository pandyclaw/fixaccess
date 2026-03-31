import { ArrowLeft, Shield } from "lucide-react";

export default function ScanNotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Shield className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-slate-900">FixAccess</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Scan Not Found</h1>
        <p className="text-slate-500 mb-8">This scan may have expired or the ID is invalid.</p>
        <a
          href="/"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </a>
      </div>
    </div>
  );
}
