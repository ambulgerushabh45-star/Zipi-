import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Mail, X, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AccountModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            className="relative w-full max-w-md rounded-3xl border border-white/20 bg-neutral-900 p-8 text-white shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                <User className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
                  ZIPI AEROSPACE PORTAL
                </span>
                <h3 className="text-xl font-bold font-display">
                  {isLogin ? 'Operator Sign In' : 'Register Operator Account'}
                </h3>
              </div>
            </div>

            {submitted ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="mx-auto h-10 w-10 text-cyan-400 animate-bounce" />
                <p className="font-bold text-white">Authenticated Successfully</p>
                <p className="text-xs text-zinc-400">Loading mission control dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-zinc-400 mb-1">Operator Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="pilot@zipi.aero"
                      className="w-full rounded-xl border border-white/15 bg-white/5 pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Passcode / Keyphrase</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                      required
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-xl border border-white/15 bg-white/5 pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                    <span>2FA Biometric Encrypted</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-cyan-400 hover:underline"
                  >
                    {isLogin ? 'Need an account?' : 'Already registered?'}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-cyan-400 py-3 text-xs font-bold uppercase tracking-wider text-black shadow-[0_0_20px_rgba(0,229,255,0.5)] hover:bg-cyan-300 transition mt-4"
                >
                  {isLogin ? 'Access Flight Systems' : 'Create Operator Profile'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

