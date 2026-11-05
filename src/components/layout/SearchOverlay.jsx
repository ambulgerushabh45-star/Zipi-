import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function SearchOverlay({ open, onClose }) {
    const [query, setQuery] = useState('');
    const inputRef = useRef(null);
    const navigate = useNavigate();
    useEffect(() => {
        if (!open)
            return;
        const t = window.setTimeout(() => inputRef.current?.focus(), 80);
        const onKey = (e) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', onKey);
        return () => {
            window.clearTimeout(t);
            window.removeEventListener('keydown', onKey);
        };
    }, [open, onClose]);
    const submit = (e) => {
        e.preventDefault();
        const q = query.trim();
        onClose();
        setQuery('');
        navigate(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop');
    };
    return (<AnimatePresence>
      {open && (<motion.div className="fixed inset-0 z-[60] flex items-start justify-center bg-ink-900/40 px-4 pt-28 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.form onSubmit={submit} onClick={(e) => e.stopPropagation()} initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }} transition={{ duration: 0.25, ease: 'easeOut' }} className="flex w-full max-w-2xl items-center gap-3 rounded-2xl bg-white p-4 shadow-lift" role="dialog" aria-label="Search drones">
            <Search className="ml-2 h-5 w-5 text-ink-400"/>
            <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search drones, cameras, accessories..." className="flex-1 bg-transparent py-2 text-lg text-ink-900 placeholder:text-ink-400 focus:outline-none"/>
            <button type="button" onClick={onClose} className="rounded-full p-2 text-ink-500 hover:bg-ink-100" aria-label="Close search">
              <X className="h-5 w-5"/>
            </button>
          </motion.form>
        </motion.div>)}
    </AnimatePresence>);
}
