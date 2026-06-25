import { Activity, BarChart3, Bell, Cpu, History, LogOut, Moon, RadioTower, Sun, Upload, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/upload", label: "Upload", icon: Upload },
  { to: "/history", label: "History", icon: History },
  { to: "/analytics", label: "Analytics", icon: Video },
  { to: "/alerts", label: "Alerts", icon: Bell },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(localStorage.getItem("visiontrace_theme") !== "light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("visiontrace_theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="app-shell min-h-screen text-slate-900 dark:text-slate-100">
      <div className="app-orbit app-orbit-one" aria-hidden="true" />
      <div className="app-orbit app-orbit-two" aria-hidden="true" />
      <aside className="sidebar-shell fixed inset-y-0 left-0 z-20 hidden w-72 px-5 py-5 lg:block">
        <div className="mb-8 rounded-lg border border-amber-100/20 bg-slate-950/72 p-4 shadow-lg shadow-black/20">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-md bg-amber-200 text-slate-950 shadow-[0_0_30px_rgba(251,191,36,0.22)]">
              <Video size={22} />
            </div>
            <div>
              <div className="text-lg font-semibold text-white">VisionTrace</div>
              <div className="text-xs uppercase tracking-[0.2em] text-amber-100/70">AI Traffic OS</div>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2 text-xs font-medium text-slate-200">
            <div className="rounded-md border border-white/10 bg-black/30 p-3">
              <Cpu className="mb-2 text-cyan-200" size={16} />
              Vision models
            </div>
            <div className="rounded-md border border-white/10 bg-black/30 p-3">
              <RadioTower className="mb-2 text-emerald-200" size={16} />
              Live signals
            </div>
          </div>
        </div>
        <nav className="space-y-2" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="relative z-10 lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/70 px-4 py-3 text-white shadow-lg shadow-black/10 backdrop-blur-2xl sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cyan-100/70">
                <Activity size={14} />
                Monitoring Console
              </div>
              <h1 className="mt-1 text-lg font-semibold">Welcome back, {user?.name || "Traffic Analyst"}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="icon-button" onClick={() => setDark((value) => !value)} title="Toggle theme" type="button">
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button className="button-secondary" onClick={logout} type="button">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `mobile-link ${isActive ? "mobile-link-active" : ""}`}>
                <item.icon size={16} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>
        <main className="p-4 sm:p-6 xl:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
