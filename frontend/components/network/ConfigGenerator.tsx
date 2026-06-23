"use client";

import { useState } from "react";
import { Terminal, Copy, CheckCircle } from "lucide-react";

export default function ConfigGenerator() {
  const [hostname, setHostname] = useState("Core-Router-01");
  const [ipAddress, setIpAddress] = useState("10.0.0.1");
  const [deviceType, setDeviceType] = useState("router");
  const [copied, setCopied] = useState(false);

  // Instant Cisco IOS template generation
  const generateConfig = () => {
    const baseConfig = `! Cisco IOS Configuration Template\n!\nversion 15.4\nservice timestamps debug datetime msec\nservice timestamps log datetime msec\nno service password-encryption\n!\nhostname ${hostname}\n!\n`;
    
    const routerConfig = `interface GigabitEthernet0/0\n description WAN Uplink\n ip address ${ipAddress} 255.255.255.0\n duplex auto\n speed auto\n no shutdown\n!\n`;
    const switchConfig = `interface Vlan1\n description Management Interface\n ip address ${ipAddress} 255.255.255.0\n no shutdown\n!\n`;
    
    const tailConfig = `line vty 0 4\n login local\n transport input ssh\n!\nend`;

    return baseConfig + (deviceType === "router" ? routerConfig : switchConfig) + tailConfig;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateConfig());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/60 backdrop-blur-md border border-slate-200/60 p-6 rounded-2xl shadow-sm mt-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
          <Terminal className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Zero-Touch Config Generator</h2>
          <p className="text-sm text-slate-500">Instantly provision valid Cisco IOS deployment scripts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Section */}
        <div className="space-y-4 lg:col-span-1">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Device Type</label>
            <select
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="router">Cisco IOS Router</option>
              <option value="switch">Cisco Catalyst Switch</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Hostname</label>
            <input
              type="text"
              value={hostname}
              onChange={(e) => setHostname(e.target.value.replace(/\s+/g, '-'))}
              className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="e.g., Core-Router-01"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Management IP</label>
            <input
              type="text"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="192.168.1.1"
            />
          </div>
        </div>

        {/* Output Section */}
        <div className="lg:col-span-2 relative">
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all shadow-sm"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Copied!" : "Copy Code"}</span>
            </button>
          </div>
          <pre className="bg-slate-900 text-emerald-400 p-6 rounded-2xl overflow-x-auto text-sm font-mono shadow-inner h-full min-h-[250px]">
            <code>{generateConfig()}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}