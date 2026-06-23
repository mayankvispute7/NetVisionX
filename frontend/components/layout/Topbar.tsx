import { Search, Bell, User } from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-16 w-full glass-panel flex items-center justify-between px-8 sticky top-0 z-50 rounded-none border-b border-white shadow-sm bg-white/40">
      {/* Premium Light Search Input */}
      <div className="flex items-center w-96 relative group">
        <Search className="w-4 h-4 absolute left-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Search devices, IPs, logs..." 
          className="w-full bg-white/60 text-slate-800 pl-10 pr-4 py-2 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 border border-slate-200 focus:bg-white focus:border-blue-500/50 transition-all placeholder:text-slate-400 shadow-inner"
        />
      </div>

      {/* Action Icons */}
      <div className="flex items-center space-x-5">
        <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5 text-slate-500 hover:text-slate-700 transition-colors" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_8px_rgba(236,72,153,0.5)]"></span>
        </button>
        
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center cursor-pointer shadow-[0_4px_10px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_15px_rgba(59,130,246,0.4)] transition-all">
          <User className="w-4 h-4 text-white" />
        </div>
      </div>
    </header>
  );
}