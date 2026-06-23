import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  colorClass: string;
}

export default function StatCard({ title, value, icon: Icon, trend, trendUp, colorClass }: StatCardProps) {
  return (
    <div className="glass-panel glass-panel-hover p-6 flex flex-col relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4">
        {/* Icon with soft colored background */}
        <div className={`p-3 rounded-2xl bg-slate-50 border border-slate-100 ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        
        {/* Optional Trend Badge */}
        {trend && (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            trendUp ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-pink-50 text-pink-600 border border-pink-100'
          }`}>
            {trend}
          </span>
        )}
      </div>
      
      <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-semibold text-slate-900 mt-1 tracking-tight">{value}</p>
    </div>
  );
}