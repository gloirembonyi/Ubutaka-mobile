
"use client";

import { useEffect, useState } from "react";
import { 
  AlertTriangle, 
  MapPin, 
  User, 
  Calendar, 
  CheckCircle, 
  Eye,
  Clock,
  Filter
} from "lucide-react";

interface AnomalyReport {
  id: string;
  upi: string | null;
  type: string;
  description: string;
  imageUrl: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  status: string;
  reportedById: string | null;
  createdAt: string;
}

export default function AnomaliesPage() {
  const [anomalies, setAnomalies] = useState<AnomalyReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/anomalies")
      .then(res => res.json())
      .then(data => {
        setAnomalies(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading registry anomalies...</div>;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <AlertTriangle className="text-amber-500" size={32} />
             Land Anomaly Registry
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Monitoring suspicious activities and encroachments across Rwanda.</p>
        </div>
        <div className="flex gap-4">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
             <Filter size={18} />
             Filter Hotspots
           </button>
           <button className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
             Export Report
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {anomalies.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <Clock size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-900">No active anomalies</h3>
            <p className="text-slate-500">The registry is currently clean. Good job!</p>
          </div>
        ) : anomalies.map((report) => (
          <div key={report.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
             {report.imageUrl && (
               <div className="h-48 overflow-hidden relative">
                 <img src={report.imageUrl} alt="Anomaly" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-slate-900 uppercase tracking-widest border border-white/20">
                    {report.type}
                 </div>
               </div>
             )}
             <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-2 text-amber-600">
                      <Clock size={16} />
                      <span className="text-xs font-bold uppercase tracking-wider">{report.status}</span>
                   </div>
                   <span className="text-xs text-slate-400 font-medium">{new Date(report.createdAt).toLocaleDateString()}</span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">
                   {report.upi ? `Parcel ${report.upi}` : "Unknown public land"}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-3 mb-6 font-medium leading-relaxed">
                   {report.description}
                </p>

                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-[11px] font-bold text-slate-600">
                       <MapPin size={12} />
                       {report.location || "N/A"}
                    </div>
                </div>

                <div className="flex gap-2">
                   <button className="flex-1 bg-slate-900 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                      <Eye size={18} />
                      Investigate
                   </button>
                   <button className="w-14 h-12 flex items-center justify-center border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-emerald-600">
                      <CheckCircle size={20} />
                   </button>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
