"use client";

import { useState } from "react";
import { Bot, Sparkles, AlertCircle } from "lucide-react";

export default function AILogAnalyzer() {
  const [logText, setLogText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!logText.trim()) return;
    setIsAnalyzing(true);
    setError("");
    setAnalysis("");

    try {
      const blob = new Blob([logText], { type: "text/plain" });
      const file = new File([blob], "syslog.txt", { type: "text/plain" });

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("https://netvisionx.onrender.com/api/v1/ai/analyze-log", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("AI Engine failed to process log.");

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setError("Failed to connect to NetVision AI Engine.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-md border border-slate-200/60 p-6 rounded-2xl shadow-sm mt-8 mb-12">
      
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            NetBot AI Engine <Sparkles className="w-4 h-4 text-indigo-500" />
          </h2>
          <p className="text-sm text-slate-500">Paste raw system logs (Syslog, SNMP, Traps) for automated threat mitigation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Area */}
        <div className="space-y-4 flex flex-col h-[400px]">
          <textarea
            value={logText}
            onChange={(e) => setLogText(e.target.value)}
            placeholder="Paste Cisco IOS crash logs, BGP neighbor drops, or firewall alerts here..."
            className="flex-1 w-full bg-white/80 border border-slate-200 text-slate-800 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none font-mono text-sm placeholder:text-slate-400 shadow-inner"
          ></textarea>
          
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !logText.trim()}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md disabled:opacity-50 flex justify-center items-center gap-2 shrink-0"
          >
            {isAnalyzing ? (
              <span className="animate-pulse">Analyzing network telemetry...</span>
            ) : (
              <span>Execute Diagnostic Run</span>
            )}
          </button>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 text-sm font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}
        </div>

        {/* Output Area */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 h-[400px] overflow-y-auto shadow-inner text-slate-700">
          {analysis ? (
            <div className="text-sm space-y-2 leading-relaxed">
              {/* Better Markdown parsing for high-contrast light mode */}
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: analysis
                    .replace(/\n/g, '<br />')
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-bold">$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em class="text-slate-800 italic">$1</em>') 
                }} 
              />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
              <Bot className="w-12 h-12 mb-3 opacity-20" />
              <p className="font-medium">NetBot is standing by.</p>
              <p className="text-xs mt-1">Awaiting telemetry data...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}