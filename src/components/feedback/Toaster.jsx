import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { useShop } from '@/hooks/useShop';
const TONES = {
    success: { icon: CheckCircle2, iconClass: 'text-success-500' },
    info: { icon: Info, iconClass: 'text-brand-600' },
    error: { icon: AlertCircle, iconClass: 'text-danger-500' },
};
export default function Toaster() {
    const { toasts, dismissToast } = useShop();
    return (<div className="pointer-events-none fixed bottom-4 left-1/2 z-[80] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-3 sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
            const { icon: Icon, iconClass } = TONES[toast.tone];
            return (<motion.div key={toast.id} layout initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.96 }} transition={{ duration: 0.25 }} role="status" className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-white/60 bg-white/95 px-4 py-3 shadow-lift backdrop-blur-xl">
              <Icon className={`h-5 w-5 shrink-0 ${iconClass}`}/>
              <p className="flex-1 text-sm font-medium text-ink-800">{toast.message}</p>
              <button onClick={() => dismissToast(toast.id)} className="rounded-full p-1 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700" aria-label="Dismiss notification">
                <X className="h-4 w-4"/>
              </button>
            </motion.div>);
        })}
      </AnimatePresence>
    </div>);
}
