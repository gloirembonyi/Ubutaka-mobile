import AdminLayout from "@/components/AdminLayout";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
import { 
  Users, 
  Map as MapIcon, 
  Receipt, 
  AlertTriangle, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ExternalLink
} from "lucide-react";

import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface Transaction {
  id: string;
  title: string;
  upi: string;
  status: string;
  createdAt: Date;
}

interface Dispute {
  id: string;
  description: string | null;
  upi: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change: string;
  isPositive: boolean;
  color: "emerald" | "blue" | "amber" | "rose";
}

const StatCard = ({ title, value, icon: Icon, change, isPositive, color }: StatCardProps) => {
  const colorMap = {
    emerald: "text-emerald-600 bg-emerald-50 shadow-emerald-100",
    blue: "text-blue-600 bg-blue-50 shadow-blue-100",
    amber: "text-amber-600 bg-amber-50 shadow-amber-100",
    rose: "text-rose-600 bg-rose-50 shadow-rose-100",
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]} transition-transform group-hover:scale-110`}>
          <Icon size={20} />
        </div>
        <div className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
          isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
        }`}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {change}%
        </div>
      </div>
      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-2xl font-black text-slate-900 tabular-nums">{value}</h3>
    </div>
  );
};

export default async function AdminDashboard() {
  const [userCount, parcelCount, transactionCount, disputeCount, recentTransactions, recentDisputes] = await Promise.all([
    prisma.user.count(),
    prisma.parcel.count(),
    prisma.transaction.count(),
    prisma.dispute.count(),
    prisma.transaction.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.dispute.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      where: { status: 'PENDING' }
    })
  ]);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <header>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
              <p className="text-slate-500 text-sm font-medium">Welcome back, manager. Here&apos;s real-time data from Ubutaka.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live System Status</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Users" value={userCount.toLocaleString()} icon={Users} change="12" isPositive={true} color="emerald" />
          <StatCard title="Registered Land" value={parcelCount.toLocaleString()} icon={MapIcon} change="5" isPositive={true} color="blue" />
          <StatCard title="Transactions" value={transactionCount.toLocaleString()} icon={Receipt} change="8" isPositive={false} color="amber" />
          <StatCard title="Open Disputes" value={disputeCount.toLocaleString()} icon={AlertTriangle} change="2" isPositive={true} color="rose" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="text-emerald-600" size={18} />
                Recent Activity
              </h2>
              <Link href="/admin/transactions" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors">
                View All <ExternalLink size={12} />
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((tx: Transaction) => (
                  <div key={tx.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                          <Receipt size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{tx.title}</p>
                          <p className="text-xs text-slate-500">UPI: {tx.upi}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          tx.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 
                          tx.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {tx.status}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1 flex items-center justify-end gap-1">
                          <Clock size={10} /> {new Date(tx.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center">
                  <p className="text-slate-400 text-sm">No recent activity found.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="text-rose-500" size={18} />
                Critical Alerts
              </h2>
              <span className="bg-rose-100 text-rose-600 text-[10px] font-black px-2 py-0.5 rounded-full">
                {recentDisputes.length} NEW
              </span>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto">
              {recentDisputes.length > 0 ? (
                recentDisputes.map((dispute: Dispute) => (
                  <div key={dispute.id} className="flex gap-3 p-3 bg-rose-50/50 rounded-xl border border-rose-100 hover:border-rose-200 transition-colors group">
                    <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center text-rose-600 shrink-0 group-hover:scale-110 transition-transform">
                      <AlertTriangle size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-rose-900 uppercase tracking-tight">Dispute Created</h4>
                      <p className="text-[11px] text-rose-700 font-medium leading-normal mt-0.5 line-clamp-2">
                        {dispute.description || `New dispute raised for UPI ${dispute.upi}`}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-60">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-2">
                    <AlertTriangle size={24} />
                  </div>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">No critical alerts</p>
                </div>
              )}
            </div>
            {recentDisputes.length > 0 && (
              <div className="mt-auto p-4 border-t border-slate-50 bg-slate-50/30">
                <Link href="/admin/disputes" className="w-full py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                  Resolve All Issues <ExternalLink size={12} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

