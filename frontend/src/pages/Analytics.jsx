import { Activity, BarChart3, Car, Gauge, Layers3 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { analyticsApi, videoApi } from "../api/endpoints";
import EmptyState from "../components/EmptyState.jsx";
import Loading from "../components/Loading.jsx";

export default function Analytics() {
  const { sessionId } = useParams();
  const [sessions, setSessions] = useState([]);
  const [selected, setSelected] = useState(sessionId || "");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    videoApi.sessions().then((res) => {
      setSessions(res.data);
      if (!selected && res.data[0]) setSelected(res.data[0].session_id);
    });
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    analyticsApi.trafficStats(selected).then((res) => setStats(res.data)).catch(() => setStats(null)).finally(() => setLoading(false));
  }, [selected]);

  return (
    <div className="monitor-enter space-y-6">
      <div className="hero-panel p-6 sm:p-8">
        <div className="relative z-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-cyan-100/20 bg-cyan-100/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
            <BarChart3 size={15} />
            Session Intelligence
          </div>
          <h2 className="text-3xl font-semibold text-white">Analytics</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Vehicle count, type breakdown, and density level for a processed session.</p>
        </div>
      </div>
      <div className="panel max-w-2xl p-4">
        <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400" htmlFor="analytics-session">Session</label>
        <select id="analytics-session" className="input mt-2" value={selected} onChange={(e) => setSelected(e.target.value)}>
          <option value="">Select session</option>
          {sessions.map((session) => <option key={session.session_id} value={session.session_id}>{session.original_filename || session.filename} - {session.status}</option>)}
        </select>
      </div>
      {loading && <Loading label="Loading analytics" />}
      {!loading && !stats && <EmptyState title="Analytics unavailable" message="Select a completed session or run video processing first." />}
      {!loading && stats && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[
            ["Total Vehicles", stats.total_vehicle, Gauge],
            ["Cars", stats.cars, Car],
            ["Motorcycles", stats.motorcycles, Activity],
            ["Buses", stats.buses, Layers3],
            ["Trucks", stats.trucks, Layers3],
            ["Density Level", stats.density_level, BarChart3],
          ].map(([label, value, Icon]) => (
            <div className="panel group p-5 transition hover:-translate-y-1 hover:border-amber-100/30" key={label}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{label}</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">{value}</p>
                </div>
                <div className="rounded-md border border-amber-100/20 bg-amber-100/10 p-3 text-amber-700 dark:text-amber-100">
                  <Icon size={22} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
