import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Chrome, Eye, KeyRound, Lock, Mail, Network, Radar, ScanLine, User } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const particles = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  top: `${12 + ((index * 29) % 76)}%`,
  delay: `${(index % 8) * 0.35}s`,
  duration: `${7 + (index % 5)}s`,
}));

export default function AuthExperience({ mode = "login" }) {
  const isRegister = mode === "register";
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isLit, setIsLit] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const title = isRegister ? "Create Account" : "Welcome Back";
  const subtitle = isRegister
    ? "Join the investigation workspace and start tracing visual intelligence."
    : "Enter the room where video evidence becomes structured intelligence.";

  const statusText = useMemo(
    () => (isLit ? "Lamp is on. Authentication panel revealed." : "Lamp is off. Click it to reveal the workspace."),
    [isLit],
  );

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isRegister) {
        if (form.password !== form.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        await register({ name: form.name, email: form.email, password: form.password });
      } else {
        await login({ email: form.email, password: form.password });
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || err.message || (isRegister ? "Registration failed" : "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  const revealVariants = {
    hidden: { opacity: 0, y: 26, filter: "brightness(0.25)" },
    visible: { opacity: 1, y: 0, filter: "brightness(1)" },
  };

  return (
    <main className="auth-cinema relative min-h-screen overflow-hidden bg-[#030506] text-white">
      <div className="auth-texture absolute inset-0" aria-hidden="true" />
      <div className="auth-vignette absolute inset-0" aria-hidden="true" />

      <div className="absolute inset-0" aria-hidden="true">
        {particles.map((particle) => (
          <span
            className="auth-particle"
            key={particle.id}
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>

      <motion.div
        aria-hidden="true"
        animate={{ opacity: isLit ? 1 : 0 }}
        className="auth-light-beam absolute left-1/2 top-24 h-[72vh] w-[92vw] max-w-5xl -translate-x-1/2"
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
      <motion.div
        aria-hidden="true"
        animate={{ opacity: isLit ? 0.9 : 0 }}
        className="auth-floor-light absolute bottom-0 left-1/2 h-72 w-[86vw] max-w-5xl -translate-x-1/2"
        transition={{ duration: 0.85, ease: "easeOut" }}
      />

      <section className="relative z-10 grid min-h-screen grid-rows-[auto_1fr] px-5 py-6 sm:px-8 lg:px-12">
        <motion.header
          animate={{ opacity: isLit ? 1 : 0.22 }}
          className="mx-auto flex w-full max-w-6xl items-center justify-between"
          transition={{ duration: 0.6 }}
        >
          <Link className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-amber-200" to="/login">
            <span className="grid h-10 w-10 place-items-center rounded-md border border-amber-200/30 bg-[#11100b] text-amber-100 shadow-[0_0_24px_rgba(245,158,11,0.18)]">
              <Eye size={22} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-semibold uppercase tracking-[0.28em] text-amber-100">Vision Trace</span>
              <span className="block text-xs text-slate-500">AI investigation workspace</span>
            </span>
          </Link>
          <span className="hidden rounded-md border border-slate-800 bg-[#090c0d] px-3 py-2 text-xs uppercase tracking-[0.22em] text-slate-500 sm:inline-flex">
            Secure Access
          </span>
        </motion.header>

        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 py-8 lg:grid-cols-[1.08fr_0.92fr] lg:py-0">
          <div className="relative flex min-h-[410px] items-center justify-center lg:min-h-[620px]">
            <InvestigationWall isLit={isLit} />
            <LampSwitch isLit={isLit} onToggle={() => setIsLit((current) => !current)} />
            <p className="sr-only" aria-live="polite">
              {statusText}
            </p>
          </div>

          <motion.div
            animate={isLit ? "visible" : "hidden"}
            aria-hidden={!isLit}
            className={isLit ? "pointer-events-auto" : "pointer-events-none"}
            initial="hidden"
            transition={{ duration: 0.75, ease: "easeOut" }}
            variants={revealVariants}
          >
            <div className="auth-panel relative mx-auto w-full max-w-md rounded-lg border border-amber-100/18 bg-[#090b0d] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.65)] sm:p-7">
              <div className="mb-6">
                <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-amber-100/20 bg-[#151109] px-3 py-2 text-xs uppercase tracking-[0.22em] text-amber-100">
                  <ScanLine size={15} aria-hidden="true" />
                  Identity Scan
                </div>
                <h1 className="text-3xl font-semibold tracking-normal text-white sm:text-4xl">{title}</h1>
                <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p>
              </div>

              <div className="mb-5 grid grid-cols-2 rounded-md border border-slate-800 bg-[#050708] p-1">
                <Link
                  className={`rounded px-3 py-2 text-center text-sm font-medium transition ${
                    !isRegister ? "bg-amber-200 text-slate-950" : "text-slate-400 hover:text-white"
                  }`}
                  to="/login"
                >
                  Login
                </Link>
                <Link
                  className={`rounded px-3 py-2 text-center text-sm font-medium transition ${
                    isRegister ? "bg-amber-200 text-slate-950" : "text-slate-400 hover:text-white"
                  }`}
                  to="/register"
                >
                  Register
                </Link>
              </div>

              <form className="space-y-4" onSubmit={submit}>
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-md border border-red-400/40 bg-red-950/70 px-3 py-2 text-sm text-red-100"
                      exit={{ opacity: 0, y: -6 }}
                      initial={{ opacity: 0, y: -6 }}
                      role="alert"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {isRegister && (
                  <AuthField
                    autoComplete="name"
                    icon={User}
                    label="Name"
                    onChange={(value) => updateField("name", value)}
                    placeholder="Investigator name"
                    required
                    value={form.name}
                  />
                )}
                <AuthField
                  autoComplete="email"
                  icon={Mail}
                  label="Email"
                  onChange={(value) => updateField("email", value)}
                  placeholder="name@agency.ai"
                  required
                  type="email"
                  value={form.email}
                />
                <AuthField
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  icon={Lock}
                  label="Password"
                  onChange={(value) => updateField("password", value)}
                  placeholder="Password"
                  required
                  type="password"
                  value={form.password}
                />
                {isRegister && (
                  <AuthField
                    autoComplete="new-password"
                    icon={KeyRound}
                    label="Confirm Password"
                    onChange={(value) => updateField("confirmPassword", value)}
                    placeholder="Confirm password"
                    required
                    type="password"
                    value={form.confirmPassword}
                  />
                )}

                {!isRegister && (
                  <div className="flex items-center justify-end">
                    <button
                      className="text-sm font-medium text-amber-100 transition hover:text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-200"
                      onClick={() => setError("Password recovery is not configured for this build yet.")}
                      type="button"
                    >
                      Forgot Password
                    </button>
                  </div>
                )}

                <button
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-md bg-amber-200 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_30px_rgba(251,191,36,0.22)] transition hover:bg-amber-100 hover:shadow-[0_0_42px_rgba(251,191,36,0.35)] focus:outline-none focus:ring-2 focus:ring-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={loading}
                >
                  {loading ? (isRegister ? "Creating..." : "Signing in...") : isRegister ? "Create Account" : "Login"}
                  <ArrowRight className="transition group-hover:translate-x-1" size={17} aria-hidden="true" />
                </button>

                {!isRegister && (
                  <button
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-700 bg-[#0c1012] px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-amber-100/45 hover:text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-200"
                    onClick={() => setError("Google Sign-In is not configured for this build yet.")}
                    type="button"
                  >
                    <Chrome size={17} aria-hidden="true" />
                    Google Sign-In
                  </button>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function LampSwitch({ isLit, onToggle }) {
  return (
    <motion.button
      aria-label={isLit ? "Turn lamp off and hide authentication form" : "Turn lamp on and reveal authentication form"}
      aria-pressed={isLit}
      className="group absolute left-1/2 top-8 z-20 flex -translate-x-1/2 flex-col items-center focus:outline-none focus:ring-2 focus:ring-amber-200"
      onClick={onToggle}
      type="button"
      whileTap={{ scale: 0.98 }}
    >
      <span className="h-28 w-px bg-gradient-to-b from-slate-600 to-slate-900" />
      <motion.span
        animate={{ rotate: isLit ? [0, -7, 5, -3, 0] : [0, 6, -4, 2, 0] }}
        className="relative block origin-top"
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <span className="block h-8 w-28 rounded-t-full border border-slate-700 bg-gradient-to-b from-slate-700 to-[#151515] shadow-2xl" />
        <span className="mx-auto block h-7 w-36 rounded-b-[80px] border border-t-0 border-slate-700 bg-gradient-to-b from-[#28251e] to-[#050505] shadow-[inset_0_-10px_20px_rgba(0,0,0,0.65)]" />
        <motion.span
          animate={{ opacity: isLit ? 1 : 0.08, boxShadow: isLit ? "0 0 46px rgba(252,211,77,0.75)" : "0 0 0 rgba(0,0,0,0)" }}
          className="absolute bottom-1 left-1/2 h-4 w-20 -translate-x-1/2 rounded-full bg-amber-100"
          transition={{ duration: 0.5 }}
        />
      </motion.span>
      <span className="mt-5 rounded-md border border-slate-800 bg-[#060809] px-3 py-2 text-xs uppercase tracking-[0.18em] text-slate-500 transition group-hover:border-amber-100/30 group-hover:text-amber-100">
        {isLit ? "Lights on" : "Click lamp"}
      </span>
    </motion.button>
  );
}

function InvestigationWall({ isLit }) {
  return (
    <motion.div
      animate={{ opacity: isLit ? 1 : 0.12 }}
      className="relative h-[390px] w-full max-w-2xl rounded-lg border border-slate-900 bg-[#050708] shadow-[inset_0_0_80px_rgba(0,0,0,0.75)] sm:h-[520px]"
      transition={{ duration: 0.75 }}
    >
      <div className="absolute inset-0 auth-wall-grid" aria-hidden="true" />
      <motion.div
        animate={{ opacity: isLit ? 1 : 0 }}
        className="absolute left-[8%] top-[24%] h-28 w-44 rounded border border-cyan-300/45 text-cyan-100 shadow-[0_0_26px_rgba(34,211,238,0.18)]"
        transition={{ delay: 0.18, duration: 0.7 }}
      >
        <span className="absolute -top-7 left-0 text-xs uppercase tracking-[0.2em] text-cyan-100/70">Vehicle 0.97</span>
        <span className="absolute -bottom-6 right-0 text-xs text-cyan-100/60">Frame 248</span>
      </motion.div>
      <motion.div
        animate={{ opacity: isLit ? 0.78 : 0 }}
        className="absolute right-[10%] top-[18%] grid h-36 w-44 place-items-center rounded-md border border-amber-100/25 bg-[#0b0d0c]"
        transition={{ delay: 0.26, duration: 0.7 }}
      >
        <Radar className="text-amber-100/75" size={68} aria-hidden="true" />
      </motion.div>
      <motion.div
        animate={{ opacity: isLit ? 0.85 : 0 }}
        className="absolute bottom-[16%] left-[16%] flex items-center gap-4 rounded-md border border-emerald-200/20 bg-[#070b0a] px-5 py-4 text-emerald-100/80"
        transition={{ delay: 0.34, duration: 0.7 }}
      >
        <Network size={34} aria-hidden="true" />
        <div className="space-y-1 text-xs uppercase tracking-[0.18em]">
          <p>Neural Trace</p>
          <p className="text-emerald-100/45">18 nodes active</p>
        </div>
      </motion.div>
      <motion.div
        animate={{ opacity: isLit ? 0.76 : 0 }}
        className="absolute bottom-[24%] right-[13%] h-20 w-28 rounded border border-fuchsia-200/35"
        transition={{ delay: 0.42, duration: 0.7 }}
      >
        <span className="absolute -top-6 left-0 text-xs uppercase tracking-[0.16em] text-fuchsia-100/65">Anomaly</span>
      </motion.div>
    </motion.div>
  );
}

function AuthField({ icon: Icon, label, onChange, value, type = "text", ...props }) {
  return (
    <label className="group block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</span>
      <span className="flex items-center gap-3 rounded-md border border-slate-700 bg-[#050708] px-3 py-3 transition group-focus-within:border-amber-100/70 group-focus-within:shadow-[0_0_28px_rgba(251,191,36,0.12)]">
        <Icon className="text-slate-500 transition group-focus-within:text-amber-100" size={18} aria-hidden="true" />
        <input
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
          onChange={(event) => onChange(event.target.value)}
          type={type}
          value={value}
          {...props}
        />
      </span>
    </label>
  );
}
