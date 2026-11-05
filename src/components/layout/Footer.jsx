import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Sprout } from 'lucide-react';
import Logo from './Logo';
import { CATEGORY_LABELS } from '@/data/products';
const SHOP_CATEGORIES = ['defence', 'agriculture', 'commercial', 'camera', 'fpv', 'accessories'];
export default function Footer() {
    return (<footer id="support" className="relative mt-24 scroll-mt-24 overflow-hidden bg-black text-white border-t border-white/10">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl"/>
      <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-20 sm:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo tone="light"/>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-zinc-400">
              Advanced aerial technology transforming defence, agriculture, and industrial operations worldwide. Engineered for the future. Built for the mission.
            </p>
            <div className="mt-6 flex items-center gap-3 text-xs font-mono text-zinc-500">
              <span className="flex items-center gap-1 text-cyan-400">
                <Shield className="h-3.5 w-3.5"/>
                <span>DEFENCE ISR</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <Sprout className="h-3.5 w-3.5"/>
                <span>AGRONOMY</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-8 md:grid-cols-3">
            <FooterColumn title="Specialized Sectors">
              <Link to="/defence" className="text-zinc-400 transition hover:text-cyan-400">
                Defence &amp; Security
              </Link>
              <Link to="/agriculture" className="text-zinc-400 transition hover:text-emerald-400">
                Precision Agriculture
              </Link>
              <Link to="/products?category=commercial" className="text-zinc-400 transition hover:text-white">
                Commercial &amp; Industrial
              </Link>
              <Link to="/products" className="text-zinc-400 transition hover:text-white">
                Complete Fleet Catalog
              </Link>
            </FooterColumn>

            <FooterColumn title="Hardware Architecture">
              {SHOP_CATEGORIES.map((c) => (<Link key={c} to={`/products?category=${c}`} className="text-zinc-400 transition hover:text-white">
                  {CATEGORY_LABELS[c]}
                </Link>))}
            </FooterColumn>

            <FooterColumn title="Operations & Support">
              <Link to="/about" className="text-zinc-400 transition hover:text-white">About ZIPI Aerospace</Link>
              <Link to="/contact" className="text-zinc-400 transition hover:text-white">RFP &amp; Tenders Desk</Link>
              <Link to="/checkout" className="text-zinc-400 transition hover:text-white">Secure Procurement</Link>
              <Link to="/wishlist" className="text-zinc-400 transition hover:text-white">Saved Fleet Platforms</Link>
            </FooterColumn>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs text-zinc-500 font-mono md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} ZIPI Aerospace Systems Inc. All rights reserved. EAR99 Compliant.</p>
          <Link to="/products" className="group inline-flex items-center gap-2 text-zinc-300 transition hover:text-cyan-400">
            <span>Explore Complete Fleet</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"/>
          </Link>
        </div>
      </div>
    </footer>);
}
function FooterColumn({ title, children }) {
    return (<div className="flex flex-col gap-3 text-sm">
      <h4 className="mb-1 font-display text-xs uppercase tracking-[0.2em] text-zinc-500">{title}</h4>
      {children}
    </div>);
}
