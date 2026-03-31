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
        className="absolute top-3 right-3 p-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
      >
        {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
      </button>
      <pre className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 overflow-x-auto">
        <code className={`language-${language} text-sm text-zinc-300`}>{code}</code>
      </pre>
    </div>
  );
}
