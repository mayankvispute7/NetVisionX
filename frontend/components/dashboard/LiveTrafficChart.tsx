"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Activity } from "lucide-react";

interface TrafficData {
  time: string;
  traffic: number;
}

export default function LiveTrafficChart() {
  const [data, setData] = useState<TrafficData[]>([]);

  useEffect(() => {
    // 1. Connect directly to the open backend (No token needed for MVP)
    const ws = new WebSocket("ws://localhost:8080/api/v1/traffic/ws/live");

    ws.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      setData((prevData) => {
        const newData = [...prevData, parsedData];
        return newData.length > 20 ? newData.slice(newData.length - 20) : newData;
      });
    };

    ws.onerror = (error) => {
      // Silence ghost errors from React Strict Mode disconnects
      if (ws.readyState !== WebSocket.CLOSED) {
        console.error("WebSocket Connection Error:", error);
      }
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, []);

  return (
    <div className="bg-white/60 backdrop-blur-md border border-slate-200/60 p-6 rounded-2xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Live Network Traffic</h2>
          <p className="text-sm text-slate-500">Real-time bandwidth utilization</p>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full border border-emerald-100">
          <Activity className="w-4 h-4 animate-pulse" />
          <span className="text-xs font-bold tracking-wider">LIVE FEED</span>
        </div>
      </div>
      
      {/* Added minHeight to fix the Recharts -1 warning */}
      <div className="w-full" style={{ minHeight: 300, height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748b' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickFormatter={(value) => `${value} MB/s`}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              labelStyle={{ fontWeight: 'bold', color: '#0f172a' }}
            />
            <Area 
              type="monotone" 
              dataKey="traffic" 
              stroke="#10b981" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorTraffic)" 
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}