import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Sparkles, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { motion } from "motion/react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username.trim(), password);
      navigate("/admin");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,65,0.08),transparent_70%)] pointer-events-none" />
      {/* Scanlines */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,65,1) 2px,rgba(0,255,65,1) 3px)",
          backgroundSize: "100% 4px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-6"
          >
            <div className="w-16 h-16 rounded-full border-2 border-[#00ff41] border-dashed flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-[#00ff41]" />
            </div>
          </motion.div>
          <h1 className="font-orbitron text-3xl text-[#00ff41] tracking-widest text-glow-green">
            YUGANTRAN
          </h1>
          <p className="font-mono-matrix text-sm text-[rgba(176,255,176,0.4)] tracking-[0.3em] mt-2">
            3.0 // ADMIN ACCESS
          </p>
        </div>

        {/* Form */}
        <div className="glass p-8 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block font-mono-matrix text-xs text-[rgba(176,255,176,0.5)] tracking-widest mb-2">
                USERNAME
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(0,255,65,0.35)]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="admin-input pl-10"
                  placeholder="admin@yugantran.com"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-mono-matrix text-xs text-[rgba(176,255,176,0.5)] tracking-widest mb-2">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(0,255,65,0.35)]" />
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="admin-input pl-10 pr-10"
                  placeholder="••••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(0,255,65,0.35)] hover:text-[#00ff41] transition-colors"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-lg bg-[rgba(255,68,68,0.08)] border border-[rgba(255,68,68,0.2)] text-[#ff7777] font-mono-matrix text-sm">
                ⚠ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-3 py-3.5 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                "ACCESS ADMIN PANEL"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[rgba(176,255,176,0.15)] font-mono-matrix text-xs mt-6 tracking-widest">
          YUGANTRAN 3.0 // SCSE // GEETA UNIVERSITY
        </p>
      </motion.div>
    </div>
  );
}
