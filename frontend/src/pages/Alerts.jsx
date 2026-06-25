import { AlertTriangle, BellRing } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { analyticsApi, videoApi } from "../api/endpoints";
import EmptyState from "../components/EmptyState.jsx";

export default function Alerts() {
  const { sessionId } = useParams();
  const [sessions, setSessions] = useState([]);
  const [selected, setSelected] = useState(sessionId || "");
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    videoApi.sessions().then((res) => {
      setSessions(res.data);
      if (!selected && res.data[0]) setSelected(res.data[0].session_id);
    });
  }, []);

  useEffect(() => {
    if (!selected) return;
    analyticsApi.alerts(selected).then((res) => setAlerts(res.data));
  }, [selected]);

  return (
    <div className="monitor-enter space-y-6">
      <div className="hero-panel p-6 sm:p-8">
        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-red-200/25 bg-red-300/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-100">
              <BellRing size={15} />
              Alert Command
            </div>
            <h2 className="text-3xl font-semibold text-white">Alerts</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Threshold and high-density alerts generated during video analysis.</p>
          </div>
          <div className="rounded-md border border-red-200/25 bg-red-300/10 p-4 text-sm text-red-100">
            <AlertTriangle className="mb-2" size={20} />
            Events escalate when vehicle density crosses configured limits.
          </div>
        </div>
      </div>
      <div className="panel max-w-2xl p-4">
        <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400" htmlFor="alerts-session">Session</label>
        <select id="alerts-session" className="input mt-2" value={selected} onChange={(e) => setSelected(e.target.value)}>
          <option value="">Select session</option>
          {sessions.map((session) => <option key={session.session_id} value={session.session_id}>{session.original_filename || session.filename}</option>)}
        </select>
      </div>
      {alerts.length === 0 ? <EmptyState title="No alerts found" message="Alerts appear when vehicle count crosses the configured threshold or density becomes High." /> : (
        <div className="panel overflow-x-auto">
          <table className="table">
            <thead><tr><th>Type</th><th>Message</th><th>Severity</th><th>Status</th><th>Time</th></tr></thead>
            <tbody>
              {alerts.map((alert, index) => (
                <tr key={`${alert.timestamp}-${index}`}>
                  <td>{alert.alert_type}</td>
                  <td>{alert.message}</td>
                  <td><span className={`severity ${alert.severity}`}>{alert.severity}</span></td>
                  <td>{alert.status}</td>
                  <td>{new Date(alert.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
