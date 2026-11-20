import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Mail, Shield, Sprout, Radio, Terminal, Cpu } from 'lucide-react';
import Logo from './Logo';
import { CATEGORY_LABELS } from '@/data/products';

const HARDWARE_CATEGORIES = ['uav-drones', 'controllers', 'gcs', 'avionics'];

export default function Footer({ onReplayIntro }) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [zuluTime, setZuluTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setZuluTime(now.toISOString().slice(11, 19) + 'Z');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setNewsletterEmail('');
  };

  const triggerReplay = () => {
    if (onReplayIntro) {
      onReplayIntro();
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('zipi:replay-intro'));
    }
  };

  return (
    <footer
      id="support"
      className="relative mt-16 scroll-mt-24 overflow-hidden border-t border-white/10 bg-[#050b14] text-[#f1f5f9]"
    >
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-16 sm:px-8">
        {/* Newsletter-style visual briefing band (UI only, no backend) */}
        <div className="mb-14 rounded-3xl border border-white/10 bg-[#0b1a2c]/70 p-6 sm:p-8 backdrop-blur-xl">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6 space-y-2">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300">
                MISSION BRIEFINGS
              </span>
              <h3 className="font-display text-2xl font-extrabold text-[#f1f5f9]">
                Stay updated on firmware releases &amp; fleet platforms
              </h3>
              <p className="text-xs sm:text-sm text-[#94a3b8]">
                Receive quarterly technical notes on non-weaponized ISR payloads, RTK agronomy tools, and controller updates.
              </p>
            </div>

            <div className="lg:col-span-6">
              {subscribed ? (
                <div
                  role="status"
                  className="flex items-center gap-3 rounded-2xl border border-[#34d399]/40 bg-[#34d399]/10 px-4 py-3.5 text-xs sm:text-sm text-[#34d399]"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span>Subscribed to ZIPI Drones &amp; Controls technical briefings.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
                    <input
                      type="email"
                      required
                      aria-label="Work email for mission briefings"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="operator@organization.com"
                      className="min-h-[44px] w-full rounded-xl border border-white/10 bg-[#050b14]/80 pl-10 pr-4 text-sm text-[#f1f5f9] placeholder-[#94a3b8] outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-mission-primary min-h-[44px] shrink-0"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo tone="light" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#94a3b8]">
              Autonomous unmanned aerial vehicles, daylight controllers, and command stations engineered for non-weaponized ISR, precision agriculture, and industrial operations.
            </p>
            <div className="mt-6 flex items-center gap-3 text-xs font-mono text-[#94a3b8]">
              <span className="flex items-center gap-1.5 text-[#60a5fa]">
                <Shield className="h-3.5 w-3.5" />
                <span>DEFENCE ISR</span>
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5 text-[#4ade80]">
                <Sprout className="h-3.5 w-3.5" />
                <span>PRECISION AG</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-8 md:grid-cols-3">
            <FooterColumn title="Specialized Sectors">
              <Link to="/defence" className="text-[#94a3b8] transition hover:text-[#60a5fa] py-0.5">
                Defence &amp; Security
              </Link>
              <Link to="/agriculture" className="text-[#94a3b8] transition hover:text-[#4ade80] py-0.5">
                Precision Agriculture
              </Link>
              <Link to="/products?category=commercial" className="text-[#94a3b8] transition hover:text-[#f1f5f9] py-0.5">
                Commercial &amp; Industrial
              </Link>
              <Link to="/products" className="text-[#94a3b8] transition hover:text-[#f1f5f9] py-0.5">
                Complete Fleet Catalog
              </Link>
            </FooterColumn>

            <FooterColumn title="Hardware Architecture">
              {HARDWARE_CATEGORIES.map((c) => (
                <Link
                  key={c}
                  to={c === 'controllers' ? '/controllers' : `/products?category=${c}`}
                  className="text-[#94a3b8] transition hover:text-cyan-300 py-0.5"
                >
                  {CATEGORY_LABELS[c] || c}
                </Link>
              ))}
              <Link to="/accessories?category=accessories" className="text-[#94a3b8] transition hover:text-cyan-300 py-0.5">
                Accessories &amp; Modules
              </Link>
            </FooterColumn>

            <FooterColumn title="Operations & Support">
              <Link to="/about" className="text-[#94a3b8] transition hover:text-[#f1f5f9] py-0.5">
                About ZIPI Drones &amp; Controls
              </Link>
              <Link to="/contact" className="text-[#94a3b8] transition hover:text-[#f1f5f9] py-0.5">
                Support &amp; Tenders Desk
              </Link>
              <Link to="/checkout" className="text-[#94a3b8] transition hover:text-[#f1f5f9] py-0.5">
                Secure Procurement
              </Link>
              <Link to="/wishlist" className="text-[#94a3b8] transition hover:text-[#f1f5f9] py-0.5">
                Saved Fleet Platforms
              </Link>
            </FooterColumn>
          </div>
        </div>

        {/* Mission Control System Telemetry Bar */}
        <div className="mt-12 rounded-2xl border border-cyan-400/20 bg-[#07111f] p-4 font-mono text-[11px] text-slate-300">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                <span>OPERATIONAL INTEGRITY: NOMINAL</span>
              </span>
              <span className="text-white/20 hidden sm:inline">|</span>
              <span className="hidden sm:inline text-slate-400">
                FREQUENCY-HOPPING AES-256 ENCRYPTED DATALINKS
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-400">
                ZULU CLOCK: <strong className="text-cyan-300">{zuluTime || '12:00:00Z'}</strong>
              </span>
              <span className="text-white/20">|</span>
              <span className="rounded bg-cyan-400/10 px-2 py-0.5 text-cyan-300 font-bold border border-cyan-400/30">
                DEFENCE ISR &amp; AGRI CERTIFIED
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-[#94a3b8] font-mono md:flex-row md:items-center">
          <p>
            &copy; {new Date().getFullYear()} ZIPI Drones &amp; Controls. All rights reserved. Built exclusively for non-weaponized ISR and precision agriculture.
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={triggerReplay}
              className="text-[#00C8E8] transition hover:text-white hover:underline flex items-center gap-1.5 font-mono text-xs"
              title="Replay ZIPI Cinematic Intro"
            >
              <span>↺</span>
              <span>Replay Cinematic Intro</span>
            </button>
            <Link
              to="/products"
              className="text-cyan-300 transition hover:text-cyan-200 hover:underline"
            >
              Explore Complete Fleet &rarr;
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }) {
  return (
    <div className="flex flex-col gap-2.5 text-sm">
      <h4 className="mb-1 font-display text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
        {title}
      </h4>
      {children}
    </div>
  );
}
