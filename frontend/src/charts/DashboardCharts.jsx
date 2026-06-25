import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const colors = ["#22d3ee", "#34d399", "#fbbf24", "#f87171"];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-md border border-white/10 bg-slate-950/90 px-3 py-2 text-xs text-slate-100 shadow-xl backdrop-blur-xl">
      {label && <p className="mb-1 font-semibold text-amber-100">{label}</p>}
      {payload.map((item) => (
        <p key={item.dataKey || item.name} style={{ color: item.color || item.fill }}>
          {item.name}: {item.value}
        </p>
      ))}
    </div>
  );
}

function ChartPanel({ title, children }) {
  return (
    <div className="panel p-5 transition duration-300 hover:border-cyan-200/30">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-semibold text-slate-950 dark:text-white">{title}</h2>
        <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.8)]" />
      </div>
      <div className="h-72">{children}</div>
    </div>
  );
}

export default function DashboardCharts({ data }) {
  const vehicleChart = data.vehicleChart || [];
  const typeDistribution = data.typeDistribution || [];
  const densityChart = data.densityChart || [];
  const alertDistribution = data.alertDistribution || [];

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <ChartPanel title="Vehicle Detection Chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={vehicleChart}>
            <CartesianGrid stroke="rgba(148,163,184,0.18)" strokeDasharray="3 3" />
            <XAxis dataKey="session" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis allowDecimals={false} stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <Tooltip content={<ChartTooltip />} />
            <Line dot={{ r: 3, fill: "#22d3ee" }} type="monotone" dataKey="vehicles" stroke="#22d3ee" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </ChartPanel>
      <ChartPanel title="Vehicle Type Distribution">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={typeDistribution} dataKey="value" nameKey="name" outerRadius={90} label>
              {typeDistribution.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
            <Legend iconType="circle" wrapperStyle={{ color: "#cbd5e1", fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartPanel>
      <ChartPanel title="Traffic Density Chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={densityChart}>
            <CartesianGrid stroke="rgba(148,163,184,0.18)" strokeDasharray="3 3" />
            <XAxis dataKey="level" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis allowDecimals={false} stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="count" fill="#34d399" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartPanel>
      <ChartPanel title="Alert Distribution Chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={alertDistribution}>
            <CartesianGrid stroke="rgba(148,163,184,0.18)" strokeDasharray="3 3" />
            <XAxis dataKey="severity" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis allowDecimals={false} stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="count" fill="#f87171" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartPanel>
    </div>
  );
}
