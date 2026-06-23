"use client";

import { Activity, Network, ShieldAlert, Cpu } from "lucide-react";
import TopologyMap from "@/components/network/TopologyMap";
import LiveTrafficChart from "@/components/dashboard/LiveTrafficChart";
import ConfigGenerator from "@/components/network/ConfigGenerator";
import AILogAnalyzer from "@/components/network/AILogAnalyzer";

export default function Dashboard() {
  return (
    <div className="animate-in fade-in duration-700 ease-out w-full">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Real-time network metrics and system status.</p>
      </div>

      {/* Premium Liquid Glass Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div className="bg-white/60 backdrop-blur-md border border-slate-200/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-100 text-slate-700 rounded-xl border border-slate-200">
              <Activity className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md">
              +12.5%
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Total Traffic</h3>
          <p className="text-2xl font-bold text-slate-800 mt-1">1.24 TB</p>
        </div>

        <div className="bg-white/60 backdrop-blur-md border border-slate-200/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-100 text-slate-700 rounded-xl border border-slate-200">
              <Network className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md">
              +3
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Active Devices</h3>
          <p className="text-2xl font-bold text-slate-800 mt-1">142</p>
        </div>

        <div className="bg-white/60 backdrop-blur-md border border-slate-200/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-100 text-slate-700 rounded-xl border border-slate-200">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-pink-600 bg-pink-50 border border-pink-100 px-2 py-1 rounded-md">
              Action needed
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Security Alerts</h3>
          <p className="text-2xl font-bold text-slate-800 mt-1">8</p>
        </div>

        <div className="bg-white/60 backdrop-blur-md border border-slate-200/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-100 text-slate-700 rounded-xl border border-slate-200">
              <Cpu className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md">
              Stable
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Core Load</h3>
          <p className="text-2xl font-bold text-slate-800 mt-1">34%</p>
        </div>

      </div>

      {/* Live WebSocket Traffic Chart */}
      <LiveTrafficChart />

      {/* Network Topology Map */}
      <div className="mt-8 mb-8">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Live Network Topology</h2>
          <p className="text-sm text-slate-500">Interactive overview of core infrastructure and traffic flows.</p>
        </div>
        <div className="h-[600px] w-full rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm">
          <TopologyMap />
        </div>
      </div>

      {/* Cisco IOS Config Generator */}
      <ConfigGenerator />

      {/* AI Log Analyzer */}
      <AILogAnalyzer />

    </div>
  );
}