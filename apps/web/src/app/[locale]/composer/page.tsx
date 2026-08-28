"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/lib/navigation";
import { Sparkles } from "lucide-react";
import { generateUUID } from "@/utils/id";

export default function ComposerSplashPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Preparing your composer...");

  useEffect(() => {
    const timer1 = setTimeout(() => setStatus("Creating new project..."), 1000);
    const timer2 = setTimeout(() => {
      const projectId = generateUUID();
      router.push(`/editor/${projectId}`);
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [router]);

  return (
    <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-[#10B981]/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Sparkles className="w-10 h-10 text-[#10B981]" />
        </div>
        <h1 className="text-2xl font-bold mb-2">
          <span className="text-white">Next</span>
          <span className="text-[#10B981]">Money</span>{" "}
          <span className="text-gray-400">Composer</span>
        </h1>
        <p className="text-gray-500 text-sm mb-6">{status}</p>
        <div className="w-8 h-8 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    </main>
  );
}
