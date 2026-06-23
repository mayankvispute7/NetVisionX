"use client";

import { useState, useEffect } from "react";
import { Server, Router, Smartphone, Monitor, Search, Filter, Radio, Loader2, CheckCircle, XCircle, Terminal, X } from "lucide-react";

interface Device {
  id: string;
  name: string;
  ip: string;
  type: string;
  status: string;
  traffic: string;
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Ping State
  const [pingingId, setPingingId] = useState<string | null>(null);
  const [pingResult, setPingResult] = useState<{message: string; success: boolean} | null>(null);

  // Terminal Modal State
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [activeConfig, setActiveConfig] = useState<string | null>(null);
  const [isFetchingConfig, setIsFetchingConfig] = useState(false);
  const [activeDeviceName, setActiveDeviceName] = useState("");

  const fetchDevices = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/devices");
      if (response.ok) {
        const data = await response.json();
        setDevices(data);
      }
    } catch (error) {
      console.error("Failed to fetch devices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const triggerPing = async (id: string) => {
    setPingingId(id);
    setPingResult(null);
    try {
      const response = await fetch(`http://localhost:8080/api/v1/devices/ping/${id}`, { method: "POST" });
      const data = await response.json();
      if (response.ok) {
        setPingResult({ message: data.message, success: data.status === "online" });
        fetchDevices(); 
      } else {
        setPingResult({ message: "Ping operation command error execution.", success: false });
      }
    } catch (err) {
      setPingResult({ message: "Network connection to backend timeout.", success: false });
    } finally {
      setPingingId(null);
    }
  };

  const fetchConfig = async (id: string, name: string) => {
    setActiveDeviceName(name);
    setConfigModalOpen(true);
    setIsFetchingConfig(true);
    setActiveConfig(null);
    
    try {
      const response = await fetch(`http://localhost:8080/api/v1/devices/${id}/config`);
      const data = await response.json();
      if (response.ok) {
        setActiveConfig(data.config);
      } else {
        setActiveConfig("Error: Connection refused by remote host. Port 22 may be closed.");
      }
    } catch (err) {
      setActiveConfig("Error: Timeout connecting to SSH subsystem.");
    } finally {
      setIsFetchingConfig(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "router": return <Router className="w-5 h-5 text-slate-600" />;
      case "server": return <Server className="w-5 h-5 text-slate-600" />;
      case "switch": return <Monitor className="w-5 h-5 text-slate-600" />;
      default: return <Smartphone className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="animate-in fade-in duration-700 ease-out w-full h-full flex flex-col relative">
      
      {/* Terminal Modal Overlay */}
      {configModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-[#0f172a] border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center space-x-2 text-slate-300">
                <Terminal className="w-4 h-4" />
                <span className="text-sm font-mono">ssh admin@{activeDeviceName.toLowerCase().replace(' ', '-')}</span>
              </div>
              <button onClick={() => setConfigModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 h-96 overflow-y-auto font-mono text-sm text-emerald-400">
              {isFetchingConfig ? (
                <div className="flex items-center space-x-3 opacity-70">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Establishing secure shell connection...</span>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap leading-relaxed">{activeConfig}</pre>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Device Inventory</h1>
          <p className="text-slate-500 mt-1">Manage network nodes, run ICMP verification, and pull running configs.</p>
        </div>
        <div className="flex space-x-3">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search devices..." 
              className="pl-9 pr-4 py-2 bg-white/60 backdrop-blur-md border border-slate-200/60 rounded-xl text-sm focus:outline-none w-64 text-slate-800"
            />
          </div>
        </div>
      </div>

      {pingResult && (
        <div className={`mb-4 p-4 rounded-xl flex items-center border ${
          pingResult.success ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-rose-50 border-rose-200 text-rose-800"
        }`}>
          {pingResult.success ? <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0 text-emerald-600" /> : <XCircle className="w-5 h-5 mr-3 flex-shrink-0 text-rose-600" />}
          <span className="text-sm font-semibold">{pingResult.message}</span>
        </div>
      )}

      <div className="bg-white/60 backdrop-blur-md border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm flex-1 flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-slate-400" />
            <p className="font-medium text-sm">Syncing with network controller...</p>
          </div>
        ) : (
          <div className="overflow-x-auto h-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/60 bg-white/40">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Device</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">IP Address</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Traffic</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/40">
                {devices.map((device) => (
                  <tr key={device.id} className="hover:bg-white/80 transition-colors duration-200 group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm mr-4">
                          {getIcon(device.type)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{device.name}</div>
                          <div className="text-xs text-slate-500">{device.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-slate-600">
                      {device.ip}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        device.status === 'online' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        device.status === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          device.status === 'online' ? 'bg-emerald-500' :
                          device.status === 'warning' ? 'bg-amber-500' :
                          'bg-rose-500'
                        }`}></span>
                        {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                      {device.traffic}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <button 
                        onClick={() => fetchConfig(device.id, device.name)}
                        className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold shadow-sm transition-all"
                      >
                        <Terminal className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                        Config
                      </button>
                      <button 
                        onClick={() => triggerPing(device.id)}
                        disabled={pingingId !== null}
                        className="inline-flex items-center px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-50"
                      >
                        {pingingId === device.id ? (
                          <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Pinging...</>
                        ) : (
                          <><Radio className="w-3.5 h-3.5 mr-1.5" /> Ping</>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}