import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LogOut,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import Footer from '@/components/layout/Footer';
import { getProduct } from '@/data/products';
import { fetchAdminInquiries, updateAdminInquiry } from '@/lib/api';

const SESSION_KEY = 'zipi_admin_key';

const STATUS_META = {
  pending_supervisor: {
    label: 'Pending Supervisor',
    cls: 'border-amber-400/40 bg-amber-400/15 text-amber-300',
  },
  in_review: {
    label: 'In Review',
    cls: 'border-cyan-400/40 bg-cyan-400/15 text-cyan-300',
  },
  replied: {
    label: 'Replied',
    cls: 'border-sky-400/40 bg-sky-400/15 text-sky-300',
  },
  closed: {
    label: 'Closed',
    cls: 'border-emerald-400/40 bg-emerald-400/15 text-emerald-300',
  },
};

const TYPE_LABELS = {
  order: 'Place an Order',
  dealer: 'Dealer-Partner',
  rfp: 'Enterprise RFP',
  support: 'Support Query',
};

export default function AdminInquiriesPage() {
  const shouldReduceMotion = useReducedMotion();
  const [adminKey, setAdminKey] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) || '';
    } catch {
      return '';
    }
  });
  const [keyInput, setKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [authError, setAuthError] = useState('');

  const [inquiries, setInquiries] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState('');

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [drawerStatus, setDrawerStatus] = useState('pending_supervisor');
  const [drawerNotes, setDrawerNotes] = useState('');
  const [savingPatch, setSavingPatch] = useState(false);
  const [patchMessage, setPatchMessage] = useState('');
  const [patchError, setPatchError] = useState('');

  const clearSessionKey = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore storage errors
    }
    setAdminKey('');
    setSelectedInquiry(null);
  }, []);

  const loadInquiries = useCallback(
    async (keyToUse, targetPage = page) => {
      if (!keyToUse) return;
      setLoading(true);
      setListError('');
      setAuthError('');

      try {
        const res = await fetchAdminInquiries(keyToUse, {
          status: statusFilter,
          type: typeFilter,
          q: appliedSearch,
          page: targetPage,
          limit: 25,
        });
        setInquiries(res.inquiries || []);
        setTotal(res.total || 0);
        setPage(res.page || 1);
        setTotalPages(res.totalPages || 1);
      } catch (err) {
        if (err?.status === 401) {
          clearSessionKey();
          setAuthError(err.message || 'Invalid supervisor key.');
        } else {
          setListError(err?.message || 'Failed to load enquiries.');
        }
      } finally {
        setLoading(false);
      }
    },
    [statusFilter, typeFilter, appliedSearch, page, clearSessionKey]
  );

  useEffect(() => {
    if (adminKey) {
      loadInquiries(adminKey, page);
    }
  }, [adminKey, page, loadInquiries]);

  // Close drawer on Escape
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && selectedInquiry) {
        setSelectedInquiry(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedInquiry]);

  const handleUnlock = async (e) => {
    e.preventDefault();
    const trimmed = keyInput.trim();
    if (!trimmed) {
      setAuthError('Please enter your supervisor admin key.');
      return;
    }

    setLoading(true);
    setAuthError('');
    try {
      const res = await fetchAdminInquiries(trimmed, { page: 1, limit: 25 });
      try {
        sessionStorage.setItem(SESSION_KEY, trimmed);
      } catch {
        // fallback to memory only
      }
      setAdminKey(trimmed);
      setKeyInput('');
      setInquiries(res.inquiries || []);
      setTotal(res.total || 0);
      setPage(res.page || 1);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      setAuthError(err?.message || 'Unable to verify supervisor key.');
    } finally {
      setLoading(false);
    }
  };

  const openDrawer = (item) => {
    setSelectedInquiry(item);
    setDrawerStatus(item.status || 'pending_supervisor');
    setDrawerNotes(item.supervisorNotes || '');
    setPatchMessage('');
    setPatchError('');
  };

  const handleSavePatch = async (e) => {
    e.preventDefault();
    if (!selectedInquiry) return;

    setSavingPatch(true);
    setPatchMessage('');
    setPatchError('');

    try {
      const res = await updateAdminInquiry(adminKey, selectedInquiry.ref, {
        status: drawerStatus,
        supervisorNotes: drawerNotes,
      });
      const updated = res.inquiry;
      setSelectedInquiry(updated);
      setInquiries((prev) => prev.map((row) => (row.ref === updated.ref ? updated : row)));
      setPatchMessage('Saved supervisor update.');
    } catch (err) {
      if (err?.status === 401) {
        clearSessionKey();
        setAuthError(err.message || 'Session expired.');
      } else {
        setPatchError(err?.message || 'Failed to save changes.');
      }
    } finally {
      setSavingPatch(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b14] text-slate-50 pt-24 sm:pt-28 pb-16">
      <main className="mx-auto max-w-7xl px-4 sm:px-8 py-6">
        {!adminKey ? (
          <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-7 sm:p-8 backdrop-blur-xl shadow-2xl mt-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-400/10 text-cyan-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400">
                  RESTRICTED OPS DESK
                </p>
                <h1 className="font-display text-2xl font-extrabold text-slate-50">
                  Supervisor Inquiries
                </h1>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-300 mb-5">
              Enter your supervisor key (`ADMIN_KEY`) to unlock incoming orders, dealer partnerships, enterprise RFPs, and support queries.
            </p>

            <form onSubmit={handleUnlock} className="space-y-4">
              <div>
                <label
                  htmlFor="supervisor-key"
                  className="block font-mono text-[11px] uppercase tracking-wider text-slate-300 mb-1.5"
                >
                  Supervisor Access Key
                </label>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="supervisor-key"
                    type={showKey ? 'text' : 'password'}
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder="Enter ADMIN_KEY..."
                    autoComplete="off"
                    className="w-full rounded-xl border border-white/15 bg-[#050b14]/80 py-3 pl-10 pr-11 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey((prev) => !prev)}
                    aria-label={showKey ? 'Hide access key' : 'Show access key'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {authError && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-xl border border-red-500/50 bg-red-500/10 p-3 text-xs text-red-200"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 py-3 text-xs font-bold uppercase tracking-wider text-[#050b14] shadow-[0_0_24px_rgba(34,211,238,0.35)] hover:brightness-110 disabled:opacity-60 transition outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>Unlock Supervisor Desk</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-400">
                  SUPERVISOR CONSOLE // MONGODB LIVE
                </p>
                <h1 className="mt-1 font-display text-3xl font-extrabold text-slate-50">
                  Customer &amp; Partner Enquiries
                </h1>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => loadInquiries(adminKey, page)}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] px-3.5 py-2 text-xs font-mono text-slate-200 hover:bg-white/10 transition"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                <button
                  type="button"
                  onClick={clearSessionKey}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-red-400/30 bg-red-500/10 px-3.5 py-2 text-xs font-mono text-red-300 hover:bg-red-500/20 transition"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Lock</span>
                </button>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setPage(1);
                  setAppliedSearch(searchInput);
                }}
                className="md:col-span-5 relative flex gap-2"
              >
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search ref, name, email, company..."
                    aria-label="Search enquiries"
                    className="w-full rounded-xl border border-white/10 bg-[#050b14]/75 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-xl bg-cyan-400/20 border border-cyan-400/40 px-4 text-xs font-mono font-bold text-cyan-300 hover:bg-cyan-400 hover:text-[#050b14] transition"
                >
                  Search
                </button>
              </form>

              <div className="md:col-span-3">
                <select
                  aria-label="Filter by status"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-xl border border-white/10 bg-[#050b14]/90 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-cyan-400"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending_supervisor">Pending Supervisor</option>
                  <option value="in_review">In Review</option>
                  <option value="replied">Replied</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <select
                  aria-label="Filter by type"
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-xl border border-white/10 bg-[#050b14]/90 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-cyan-400"
                >
                  <option value="all">All Request Types</option>
                  <option value="order">Place an Order</option>
                  <option value="dealer">Dealer-Partner</option>
                  <option value="rfp">Enterprise RFP</option>
                  <option value="support">Support Query</option>
                </select>
              </div>

              <div className="md:col-span-1 flex items-center justify-end font-mono text-xs text-slate-400">
                <span>{total} total</span>
              </div>
            </div>

            {listError && (
              <div
                role="alert"
                className="flex items-center gap-2 rounded-xl border border-red-500/50 bg-red-500/10 p-3.5 text-xs text-red-200"
              >
                <AlertCircle className="h-4 w-4 text-red-400" />
                <span>{listError}</span>
              </div>
            )}

            {/* Enquiries Table */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-white/10 bg-[#050b14]/70 font-mono uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-4 py-3.5">Ref ID</th>
                      <th className="px-4 py-3.5">Type</th>
                      <th className="px-4 py-3.5">Contact</th>
                      <th className="px-4 py-3.5">Company / Region</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5">Created</th>
                      <th className="px-4 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {inquiries.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                          {loading ? 'Loading enquiries...' : 'No enquiries match current filters.'}
                        </td>
                      </tr>
                    ) : (
                      inquiries.map((item) => {
                        const statusInfo = STATUS_META[item.status] || STATUS_META.pending_supervisor;
                        return (
                          <tr
                            key={item.ref}
                            onClick={() => openDrawer(item)}
                            className="cursor-pointer hover:bg-white/[0.04] transition-colors"
                          >
                            <td className="px-4 py-3.5 font-mono font-bold text-cyan-300 whitespace-nowrap">
                              {item.ref}
                            </td>
                            <td className="px-4 py-3.5 text-slate-200 whitespace-nowrap">
                              {TYPE_LABELS[item.type] || item.type}
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="font-semibold text-slate-100">{item.name}</div>
                              <div className="text-[11px] text-slate-400 font-mono">{item.email}</div>
                            </td>
                            <td className="px-4 py-3.5 text-slate-300">
                              <div>{item.company || '—'}</div>
                              {item.region && (
                                <div className="text-[11px] text-slate-400">{item.region}</div>
                              )}
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap">
                              <span
                                className={`inline-flex rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase ${statusInfo.cls}`}
                              >
                                {statusInfo.label}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                              {item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}
                            </td>
                            <td className="px-4 py-3.5 text-right whitespace-nowrap">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDrawer(item);
                                }}
                                className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 font-mono text-[11px] font-semibold text-cyan-300 hover:bg-cyan-400 hover:text-[#050b14] transition"
                              >
                                Inspect
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-xs font-mono text-slate-400">
                <span>
                  Page <strong className="text-slate-100">{page}</strong> of{' '}
                  <strong className="text-slate-100">{totalPages}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1 || loading}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-slate-200 hover:bg-white/10 disabled:opacity-40"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span>Prev</span>
                  </button>
                  <button
                    type="button"
                    disabled={page >= totalPages || loading}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-slate-200 hover:bg-white/10 disabled:opacity-40"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Detail Slide-Over Drawer */}
      <AnimatePresence>
        {selectedInquiry && (
          <div className="fixed inset-0 z-[90] flex justify-end">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInquiry(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label={`Enquiry ${selectedInquiry.ref}`}
              initial={shouldReduceMotion ? false : { x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { x: 40, opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
              className="relative z-10 flex h-full w-full max-w-lg flex-col overflow-y-auto border-l border-white/15 bg-[#07111F] p-6 text-slate-100 shadow-2xl"
            >
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="font-mono text-xs font-bold text-cyan-300">
                    {selectedInquiry.ref}
                  </span>
                  <h2 className="mt-1 font-display text-xl font-bold text-white">
                    {selectedInquiry.name}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {TYPE_LABELS[selectedInquiry.type] || selectedInquiry.type} &bull;{' '}
                    {new Date(selectedInquiry.createdAt).toLocaleString()}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
                  aria-label="Close detail drawer"
                  className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Enquiry Metadata */}
              <div className="mt-5 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div>
                    <span className="block font-mono text-[10px] uppercase text-slate-400">Email</span>
                    <span className="font-mono text-slate-100 break-all">{selectedInquiry.email}</span>
                  </div>
                  <div>
                    <span className="block font-mono text-[10px] uppercase text-slate-400">Phone</span>
                    <span className="font-mono text-slate-100">{selectedInquiry.phone}</span>
                  </div>
                  <div>
                    <span className="block font-mono text-[10px] uppercase text-slate-400">Company</span>
                    <span className="text-slate-100">{selectedInquiry.company || '—'}</span>
                  </div>
                  <div>
                    <span className="block font-mono text-[10px] uppercase text-slate-400">Region</span>
                    <span className="text-slate-100">{selectedInquiry.region || '—'}</span>
                  </div>
                  {selectedInquiry.type !== 'support' && (
                    <>
                      <div>
                        <span className="block font-mono text-[10px] uppercase text-slate-400">Sector &amp; Qty</span>
                        <span className="text-slate-100 capitalize">
                          {selectedInquiry.sector} &bull; {selectedInquiry.quantity} unit(s)
                        </span>
                      </div>
                      <div>
                        <span className="block font-mono text-[10px] uppercase text-slate-400">Timeline</span>
                        <span className="text-slate-100">{selectedInquiry.timeline || '—'}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="block font-mono text-[10px] uppercase text-slate-400">Interests</span>
                        <span className="font-mono text-cyan-300">
                          {(selectedInquiry.interests || []).join(', ') || '—'}
                        </span>
                      </div>
                      {selectedInquiry.product && (
                        <div className="col-span-2">
                          <span className="block font-mono text-[10px] uppercase text-slate-400">Product</span>
                          <span className="text-slate-100">
                            {getProduct(selectedInquiry.product)?.name || selectedInquiry.product}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <span className="block font-mono text-[10px] uppercase text-slate-400 mb-1.5">
                    Customer Message
                  </span>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
                    {selectedInquiry.message}
                  </p>
                </div>

                {/* Supervisor Status & Notes Form */}
                <form onSubmit={handleSavePatch} className="space-y-4 border-t border-white/10 pt-5">
                  <div>
                    <label
                      htmlFor="drawer-status"
                      className="block font-mono text-[11px] uppercase tracking-wider text-slate-300 mb-1.5"
                    >
                      Enquiry Status
                    </label>
                    <select
                      id="drawer-status"
                      value={drawerStatus}
                      onChange={(e) => setDrawerStatus(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-[#050b14] px-3.5 py-2.5 text-sm text-white outline-none focus:border-cyan-400"
                    >
                      <option value="pending_supervisor">Pending Supervisor</option>
                      <option value="in_review">In Review</option>
                      <option value="replied">Replied</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="drawer-notes"
                      className="block font-mono text-[11px] uppercase tracking-wider text-slate-300 mb-1.5"
                    >
                      Supervisor Notes
                    </label>
                    <textarea
                      id="drawer-notes"
                      rows={4}
                      maxLength={2000}
                      value={drawerNotes}
                      onChange={(e) => setDrawerNotes(e.target.value)}
                      placeholder="Internal triage notes, assigned engineer, follow-up outcome..."
                      className="w-full rounded-xl border border-white/15 bg-[#050b14] p-3 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                    />
                  </div>

                  {patchError && (
                    <div
                      role="alert"
                      className="flex items-center gap-2 rounded-xl border border-red-500/50 bg-red-500/10 p-3 text-xs text-red-200"
                    >
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <span>{patchError}</span>
                    </div>
                  )}

                  {patchMessage && (
                    <div
                      role="status"
                      className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-300"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{patchMessage}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={savingPatch}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 py-3 text-xs font-bold uppercase tracking-wider text-[#050b14] hover:brightness-110 disabled:opacity-60 transition"
                  >
                    {savingPatch && <Loader2 className="h-4 w-4 animate-spin" />}
                    <span>Save Supervisor Update</span>
                  </button>
                </form>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

