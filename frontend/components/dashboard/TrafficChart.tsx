"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

const mockData = [
  { time: "00:00", traffic: 120 }, { time: "04:00", traffic: 300 },
  { time: "08:00", traffic: 800 }, { time: "12:00", traffic: 1200 },
  { time: "16:00", traffic: 950 }, { time: "20:00", traffic: 600 },
  { time: "24:00", traffic: 200 },
];

export default function TrafficChart() {
  return (
    <div className="glass-panel p-6 h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Network Traffic (24h)</h3>
        <span className="text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">Live</span>
      </div>
      
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}
              itemStyle={{ color: '#0F172A', fontWeight: 600 }}
              labelStyle={{ color: '#64748B', marginBottom: '4px' }}
            />
            <Area type="monotone" dataKey="traffic" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorTraffic)" activeDot={{ r: 6, strokeWidth: 0, fill: '#3B82F6' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}