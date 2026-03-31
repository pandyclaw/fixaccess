"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface FixCodeProps {
  code: string;
  language?: string;
}

export function FixCode({ code, language = "html" }: FixCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-1.5 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-slate-800 transition-colors"
      >
        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
      </button>
      <pre className="bg-slate-900 border border-slate-700 rounded-lg p-4 overflow-x-auto">
        <code className={`language-${language} text-sm text-slate-300`}>{code}</code>
      </pre>
    </div>
  );
}
