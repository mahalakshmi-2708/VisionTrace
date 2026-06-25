import { BarChart3, Bell, FileVideo, History as HistoryIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { videoApi } from "../api/endpoints";
import EmptyState from "../components/EmptyState.jsx";
import Loading from "../components/Loading.jsx";

function VideoPreview({ title, url, available }) {
  const [error, setError] = useState("");

  if (!available || !url) {
    return (
      <div className="rounded-md border border-white/10 bg-slate-950/25 p-4 text-sm text-slate-500 dark:text-slate-400">
        {title} is not available for this session.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-white"><FileVideo size={16} /> {title}</h4>
      {error ? (
        <div className="rounded-md border border-amber-200/40 bg-amber-100/10 p-4 text-sm text-amber-800 dark:text-amber-100">
          {error}
        </div>
      ) : (
        <video
          className="aspect-video w-full rounded-md border border-white/10 bg-black shadow-2xl shadow-black/20"
          controls
          preload="metadata"
          src={url}
          onError={() => setError(`${title} could not be loaded. The file may have been moved or deleted.`)}
        />
      )}
    </div>
  );
}

export default function History() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    videoApi.sessions()
      .then((res) => setSessions(res.data))
      .catch((err) => setError(err.response?.data?.detail || "Unable to load session history."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading label="Loading sessions" />;

  return (
    <div className="monitor-enter space-y-6">
      <div className="hero-panel p-6 sm:p-8">
        <div className="relative z-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-amber-100/20 bg-amber-100/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-100">
            <HistoryIcon size={15} />
            Case Archive
          </div>
          <h2 className="text-3xl font-semibold text-white">Session History</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Uploaded videos, processing status, analytics links, and alerts.</p>
        </div>
      </div>
      {error && <div className="error-box">{error}</div>}
      {sessions.length === 0 ? <EmptyState title="No sessions yet" message="Upload a video to create your first traffic analysis session." /> : (
        <div className="space-y-5">
          <div className="panel overflow-x-auto">
            <table className="table">
              <thead><tr><th>Video</th><th>Session ID</th><th>Status</th><th>Frames</th><th>Uploaded</th><th>Actions</th></tr></thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.session_id}>
                    <td className="font-medium text-slate-900 dark:text-white">{session.original_filename || session.filename}</td>
                    <td className="font-mono text-xs">{session.session_id}</td>
                    <td><span className={`status ${session.status}`}>{session.status}</span></td>
                    <td>{session.processed_frames}</td>
                    <td>{new Date(session.upload_time).toLocaleString()}</td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        <Link className="mini-action" to={`/analytics/${session.session_id}`}><BarChart3 size={14} /> Analytics</Link>
                        <Link className="mini-action" to={`/alerts/${session.session_id}`}><Bell size={14} /> Alerts</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {sessions.map((session) => (
            <div className="panel p-5" key={`${session.session_id}-preview`}>
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-950 dark:text-white">{session.original_filename || session.filename}</h3>
                  <p className="mt-1 font-mono text-xs text-slate-500 dark:text-slate-400">{session.session_id}</p>
                </div>
                <span className={`status ${session.status}`}>{session.status}</span>
              </div>
              <div className="grid gap-5 lg:grid-cols-2">
                <VideoPreview
                  title="Original Video"
                  available={session.original_video_available}
                  url={session.original_video_url ? videoApi.videoUrl(session.original_video_url) : ""}
                />
                <VideoPreview
                  title="Processed Video"
                  available={session.processed_video_available}
                  url={session.processed_video_url ? videoApi.videoUrl(session.processed_video_url) : ""}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
