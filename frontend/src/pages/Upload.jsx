import { FileVideo, Play, UploadCloud, Wand2 } from "lucide-react";
import { useState } from "react";
import { videoApi } from "../api/endpoints";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [session, setSession] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const upload = async (event) => {
    event.preventDefault();
    if (!file) return;
    setMessage("");
    setSession(null);
    const response = await videoApi.upload(file, (progressEvent) => {
      const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      setProgress(percent);
    });
    setSession(response.data);
    setMessage("Video uploaded successfully.");
  };

  const startProcessing = async () => {
    setProcessing(true);
    setMessage("Processing started. This can take time for longer videos.");
    try {
      const response = await videoApi.startProcessing(session.session_id);
      setMessage(`Processing completed. Total vehicles: ${response.data.total_vehicle}`);
    } catch (err) {
      setMessage(err.response?.data?.detail || "Processing failed.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="monitor-enter mx-auto max-w-5xl space-y-6">
      <div className="hero-panel p-6 sm:p-8">
        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-amber-100/20 bg-amber-100/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-100">
              <UploadCloud size={15} />
              Evidence Intake
            </div>
            <h2 className="text-3xl font-semibold text-white">Upload Traffic Video</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Upload an MP4 file, generate a session ID, and run YOLOv8 detection across every frame.</p>
          </div>
          <div className="rounded-md border border-cyan-200/20 bg-cyan-200/10 p-4 text-sm text-cyan-100">
            <Wand2 className="mb-2" size={20} />
            AI processing starts after upload confirmation.
          </div>
        </div>
      </div>
      <form onSubmit={upload} className="panel space-y-5 p-6">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Traffic video (.mp4)</span>
          <span className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-cyan-200/30 bg-slate-950/35 px-6 py-10 text-center transition hover:border-amber-100/50 hover:bg-white/[0.05]">
            <FileVideo className="mb-4 text-cyan-100" size={42} />
            <span className="font-semibold text-white">{file ? file.name : "Drop a traffic video into the monitoring queue"}</span>
            <span className="mt-2 text-sm text-slate-400">MP4 files only. Existing upload API remains unchanged.</span>
            <input className="sr-only" type="file" accept="video/mp4" onChange={(e) => setFile(e.target.files?.[0])} required />
          </span>
        </label>
        <div>
          <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            <span>Upload progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded bg-slate-950/60 ring-1 ring-white/10">
            <div className="h-full rounded bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-200 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <button className="button-primary" type="submit"><UploadCloud size={17} /> Upload Video</button>
      </form>
      {message && <div className="panel border-amber-100/25 p-4 text-sm text-slate-700 dark:text-slate-200">{message}</div>}
      {session && (
        <div className="panel space-y-3 p-6">
          <h3 className="font-semibold text-slate-950 dark:text-white">Session Created</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Session ID: <span className="font-mono text-cyan-700 dark:text-cyan-100">{session.session_id}</span></p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Status: <span className={`status ${session.status}`}>{session.status}</span></p>
          <button className="button-primary" disabled={processing} onClick={startProcessing}><Play size={17} /> {processing ? "Processing..." : "Start Processing"}</button>
        </div>
      )}
    </div>
  );
}
