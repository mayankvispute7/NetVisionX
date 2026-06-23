"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, AlertTriangle, Info, CheckCircle2, Search, Filter, ArrowRight, Loader2 } from "lucide-react";

interface Alert {
  id: string;
  type: string;
  title: string;
  source: string;
  time: string;
  description: string;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/alerts");
        if (response.ok) {
          const data = await response.json();
          setAlerts(data);
        }
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "critical": return <ShieldAlert className="w-5 h-5 text-rose-500" />;
      case "warning": return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "info": return <Info className="w-5 h-5 text-blue-500" />;
      default: return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    }
  };

  const getBadgeClass = (type: string) => {
    switch (type) {
      case "critical": return "bg-rose-50 text-rose-700 border-rose-200";
      case "warning": return "bg-amber-50 text-amber-700 border-amber-200";
      case "info": return "bg-blue-50 text-blue-700 border-blue-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="animate-in fade-in duration-700 ease-out w-full h-full flex flex-col">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Security Alerts</h1>
          <p className="text-slate-500 mt-1">Monitor network anomalies and threat detections.</p>
        </div>
        <div className="flex space-x-3">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors" />
            <input 
              type="text" 
              placeholder="Search alerts..." 
              className="pl-9 pr-4 py-2 bg-white/60 backdrop-blur-md border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-400/20 focus:bg-white shadow-sm transition-all w-64 text-slate-800"
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-white/60 backdrop-blur-md border border-slate-200/60 rounded-xl text-sm font-medium text-slate-700 hover:bg-white hover:shadow-sm transition-all">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {isLoading ? (
          <div className="w-full h-40 flex flex-col items-center justify-center text-slate-500 bg-white/60 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-sm">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-slate-400" />
            <p className="font-medium text-sm">Scanning for security anomalies...</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="bg-white/60 backdrop-blur-md border border-slate-200/60 p-6 rounded-2xl shadow-sm hover:shadow-md hover:bg-white/80 transition-all duration-300 group">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm mt-1">
                    {getIcon(alert.type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="text-lg font-semibold text-slate-800">{alert.title}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase tracking-wider ${getBadgeClass(alert.type)}`}>
                        {alert.type}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm mb-3">{alert.description}</p>
                    <div className="flex items-center space-x-4 text-xs font-medium text-slate-500">
                      <span className="flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-2"></span>
                        Source: {alert.source}
                      </span>
                      <span className="flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-2"></span>
                        {alert.time}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}