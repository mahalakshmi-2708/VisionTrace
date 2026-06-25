export default function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="panel group p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-200/35 hover:shadow-[0_22px_70px_rgba(8,145,178,0.14)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">{value ?? 0}</p>
        </div>
        <div className="rounded-md border border-cyan-200/20 bg-cyan-200/10 p-3 text-cyan-700 shadow-[0_0_26px_rgba(34,211,238,0.12)] transition group-hover:scale-105 dark:text-cyan-100">
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
