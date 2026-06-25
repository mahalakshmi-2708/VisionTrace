export default function Loading({ label = "Loading" }) {
  return (
    <div className="panel flex items-center gap-3 p-6 text-sm text-slate-500 dark:text-slate-300">
      <span className="h-3 w-3 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.75)]" />
      {label}...
    </div>
  );
}
