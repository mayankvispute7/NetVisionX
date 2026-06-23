"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Network, Bot, ShieldAlert, Settings } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Device Inventory", href: "/devices", icon: Network },
  { name: "NetBot AI", href: "/ai", icon: Bot },
  { name: "Security Alerts", href: "/alerts", icon: ShieldAlert },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-full bg-white/60 backdrop-blur-2xl border-r border-slate-200/60 z-10 flex flex-col shadow-[8px_0_40px_-15px_rgba(0,0,0,0.03)] relative overflow-hidden">
      
      {/* Subtle glossy overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

      {/* Premium Logo Area */}
      <div className="h-20 flex items-center px-6 border-b border-slate-200/60 relative z-10">
        <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center mr-3 shadow-md border border-slate-700">
          <Network className="w-6 h-6 text-white drop-shadow-sm" />
        </div>
        <span className="text-2xl font-extrabold text-slate-800 tracking-tight">
          NetVisionX
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 relative z-10">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3.5 rounded-2xl transition-all duration-500 ease-out group relative overflow-hidden ${
                isActive
                  ? "bg-white shadow-[0_8px_30px_rgba(0,0,0,0.05)] border border-slate-200 text-slate-900 scale-[1.02]"
                  : "text-slate-500 hover:bg-slate-50/80 hover:text-slate-800 hover:shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-transparent hover:border-slate-200/50"
              }`}
            >
              <item.icon
                className={`w-5 h-5 mr-3 transition-colors duration-500 ${
                  isActive ? "text-slate-800" : "text-slate-400 group-hover:text-slate-600"
                }`}
              />
              <span className="font-semibold">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* System Status Footer */}
      <div className="p-6 border-t border-slate-200/60 relative z-10 bg-white/30">
        <div className="flex items-center justify-center space-x-3 bg-white/90 backdrop-blur-xl border border-slate-200 py-3 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-sm cursor-default">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-slate-700 tracking-wider uppercase">System Optimal</span>
        </div>
      </div>
    </aside>
  );
}