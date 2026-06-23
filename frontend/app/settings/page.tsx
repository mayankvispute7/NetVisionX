"use client";

import { User, Bell, Shield, Network, Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="animate-in fade-in duration-700 ease-out w-full max-w-5xl">
      {/* Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">System Settings</h1>
          <p className="text-slate-500 mt-1">Manage your platform preferences and configurations.</p>
        </div>
        <button className="flex items-center px-5 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-medium hover:bg-slate-700 shadow-sm transition-all">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Navigation */}
        <div className="w-full md:w-64 space-y-1">
          <button className="w-full flex items-center px-4 py-3 bg-white shadow-sm border border-slate-200 text-slate-800 rounded-xl font-medium transition-all">
            <User className="w-5 h-5 mr-3 text-slate-500" /> General
          </button>
          <button className="w-full flex items-center px-4 py-3 text-slate-500 hover:bg-white/60 hover:text-slate-800 rounded-xl font-medium transition-all border border-transparent hover:border-slate-200/60">
            <Shield className="w-5 h-5 mr-3" /> Security
          </button>
          <button className="w-full flex items-center px-4 py-3 text-slate-500 hover:bg-white/60 hover:text-slate-800 rounded-xl font-medium transition-all border border-transparent hover:border-slate-200/60">
            <Bell className="w-5 h-5 mr-3" /> Notifications
          </button>
          <button className="w-full flex items-center px-4 py-3 text-slate-500 hover:bg-white/60 hover:text-slate-800 rounded-xl font-medium transition-all border border-transparent hover:border-slate-200/60">
            <Network className="w-5 h-5 mr-3" /> API Integrations
          </button>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 space-y-6">
          {/* Profile Section */}
          <div className="bg-white/60 backdrop-blur-md border border-slate-200/60 rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Administrator Profile</h2>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                  <input type="text" defaultValue="Admin" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200 shadow-sm transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                  <input type="text" defaultValue="User" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200 shadow-sm transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <input type="email" defaultValue="admin@netvisionx.local" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200 shadow-sm transition-all" />
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="bg-white/60 backdrop-blur-md border border-slate-200/60 rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-6">System Preferences</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
                <div>
                  <div className="font-medium text-slate-800">Auto-refresh Dashboards</div>
                  <div className="text-sm text-slate-500 mt-1">Update traffic metrics every 5 seconds.</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-800"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-800">AI Log Analysis (Virtual Blobbing)</div>
                  <div className="text-sm text-slate-500 mt-1">Send anonymous local logs to Gemini for threat detection.</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}