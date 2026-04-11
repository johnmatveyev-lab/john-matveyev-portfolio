import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Lock, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate("/admin/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const success = await login(password);
    setLoading(false);
    if (success) {
      navigate("/admin/dashboard");
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Lock size={20} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Admin Access</h1>
          <p className="text-sm text-muted-foreground">Enter your password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={loading}
            className={`w-full px-4 py-3 bg-card border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors ${
              error ? "border-destructive" : "border-border focus:border-primary/50"
            }`}
          />
          {error && <p className="text-destructive text-sm">Invalid password</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Verifying...</> : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-6 text-xs text-muted-foreground">
          <a href="/" className="hover:text-primary transition-colors">← Back to site</a>
        </p>
      </motion.div>
    </div>
  );
}
