"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles, ShieldAlert, Paperclip, FileText, X } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "bot", content: "Hello! I am NetBot, your AI network assistant powered by Gemini. Upload a log file or type a query to begin." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !selectedFile) || isLoading) return;

    // Display what the user did in the chat
    const userMessage = selectedFile 
      ? `Uploaded file: ${selectedFile.name}${input ? `\n\nNotes: ${input}` : ''}`
      : input.trim();

    setInput("");
    setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const formData = new FormData();
      
      // If they selected a real file, use it. Otherwise, use Virtual Blobbing for text.
      if (selectedFile) {
        formData.append('file', selectedFile);
      } else {
        const blob = new Blob([userMessage], { type: 'text/plain' });
        formData.append('file', blob, 'query.txt');
      }

      const response = await fetch('http://localhost:8080/api/v1/ai/analyze-log', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: "bot", 
        content: data.analysis || "Analysis complete." 
      }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: "bot", 
        content: "Error: Could not connect to the NetBot AI backend. Please ensure the FastAPI server is running with your Gemini API key." 
      }]);
    } finally {
      setIsLoading(false);
      setSelectedFile(null); // Clear file after sending
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="animate-in fade-in duration-700 ease-out w-full h-[calc(100vh-8rem)] flex flex-col">
      
      {/* Premium Gradient Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mr-4 shadow-lg shadow-fuchsia-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600 tracking-tight">
              NetBot AI
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Autonomous log analysis and network intelligence.</p>
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-sm flex-1 flex flex-col overflow-hidden relative">
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-md ${
                  msg.role === "user" 
                    ? "bg-slate-900 ml-3" 
                    : "bg-gradient-to-br from-violet-500 to-fuchsia-500 mr-3"
                }`}>
                  {msg.role === "user" 
                    ? <User className="w-4 h-4 text-white" /> 
                    : <Bot className="w-4 h-4 text-white" />
                  }
                </div>

                {/* Message Bubble - High Contrast & Gradients */}
                <div className={`px-5 py-4 shadow-sm text-[15px] leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-slate-900 text-white rounded-2xl rounded-tr-sm" // High contrast dark for user
                    : "bg-gradient-to-br from-violet-50 to-fuchsia-50 border border-violet-100 text-slate-800 rounded-2xl rounded-tl-sm shadow-inner" // Soft premium gradient for AI
                }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading State Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex flex-row max-w-[80%]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 mr-3 flex items-center justify-center shadow-md">
                  <Bot className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div className="px-5 py-4 bg-white/80 backdrop-blur-md border border-slate-200 text-slate-800 rounded-2xl rounded-tl-sm shadow-sm flex items-center space-x-2">
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/80 backdrop-blur-2xl border-t border-slate-200/60">
          
          {/* File Attachment Preview Pill */}
          {selectedFile && (
            <div className="mb-3 flex items-center bg-violet-50 border border-violet-100 text-violet-700 px-4 py-2 rounded-xl text-sm font-medium w-max shadow-sm">
              <FileText className="w-4 h-4 mr-2" />
              <span className="truncate max-w-xs">{selectedFile.name}</span>
              <button 
                onClick={() => { setSelectedFile(null); if(fileInputRef.current) fileInputRef.current.value = ""; }}
                className="ml-3 p-1 hover:bg-violet-200 rounded-full transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="relative flex items-center">
            
            {/* Hidden File Input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              className="hidden" 
              accept=".txt,.log,.csv,.json"
            />
            
            {/* Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute left-2 p-2.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all"
              title="Attach Log File"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask NetBot to analyze a specific log or IP address..."
              disabled={isLoading}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-14 py-4 text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all disabled:opacity-60"
            />
            
            {/* Send Button */}
            <button
              type="submit"
              disabled={(!input.trim() && !selectedFile) || isLoading}
              className="absolute right-2 p-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl transition-all shadow-sm flex items-center justify-center"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-0.5" />}
            </button>
          </form>
          
          <div className="mt-3 flex justify-center items-center space-x-1 text-xs text-slate-400 font-medium">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>End-to-end encryption active. Data is sent securely to Gemini AI engine.</span>
          </div>
        </div>
      </div>
    </div>
  );
}