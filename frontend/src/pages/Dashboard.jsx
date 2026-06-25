import { AlertTriangle, Bike, Bus, Car, FileVideo, Gauge, ScanLine, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { analyticsApi } from "../api/endpoints";
import DashboardCharts from "../charts/DashboardCharts.jsx";
import Loading from "../components/Loading.jsx";
import StatCard from "../components/StatCard.jsx";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.dashboardSummary().then((res) => setSummary(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading label="Loading dashboard" />;

  const stats = summary?.stats || {};
  const cards = [
    ["Total Vehicles Detected", stats.totalVehicles, Gauge],
    ["Cars Detected", stats.cars, Car],
    ["Motorcycles Detected", stats.motorcycles, Bike],
    ["Trucks Detected", stats.trucks, Truck],
    ["Buses Detected", stats.buses, Bus],
    ["Total Alerts", stats.totalAlerts, AlertTriangle],
    ["Processed Videos", stats.processedVideos, FileVideo],
  ];

  return (
    <div className="monitor-enter space-y-6">
      <div className="hero-panel overflow-hidden p-6 sm:p-8">
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-cyan-200/20 bg-cyan-200/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
              <ScanLine size={15} />
              City Vision Grid
            </div>
            <h2 className="text-3xl font-semibold tracking-normal text-white sm:text-4xl">Traffic Monitoring Dashboard</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Vehicle detection summary, traffic density, and alert intelligence for the VisionTrace monitoring network.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm text-slate-300 sm:min-w-72">
            <div className="rounded-md border border-white/10 bg-white/[0.05] p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">System</p>
              <p className="mt-1 font-semibold text-emerald-200">Operational</p>
            </div>
            <div className="rounded-md border border-white/10 bg-white/[0.05] p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Model</p>
              <p className="mt-1 font-semibold text-amber-100">YOLOv8</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([title, value, icon]) => <StatCard key={title} title={title} value={value} icon={icon} />)}
      </div>
      <DashboardCharts data={summary || {}} />
    </div>
  );
}
