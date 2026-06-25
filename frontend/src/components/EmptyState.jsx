export default function EmptyState({ title, message }) {
  return (
    <div className="panel p-8 text-center">
      <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-amber-200 shadow-[0_0_24px_rgba(251,191,36,0.35)]" />
      <h3 className="font-semibold text-slate-950 dark:text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
}
