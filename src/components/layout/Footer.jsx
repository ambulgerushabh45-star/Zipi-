import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Sprout } from 'lucide-react';
import Logo from './Logo';
import { CATEGORY_LABELS } from '@/data/products';

const HARDWARE_CATEGORIES = ['uav-drones', 'controllers', 'gcs', 'avionics'];

export default function Footer() {
  return (
    <footer id="support" className="relative mt-20 scroll-mt-24 overflow-hidden bg-[#07111F] text-[#F5F8FC] border-t border-[#101B2A]">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-[#00C8FF]/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-20 sm:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo tone="light" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#AAB7C7]">
              Advanced aerial technology transforming defence, agriculture, and industrial operations worldwide. Fly beyond limits.
            </p>
            <div className="mt-6 flex items-center gap-3 text-xs font-mono text-[#AAB7C7]">
              <span className="flex items-center gap-1 text-[#00C8FF]">
                <Shield className="h-3.5 w-3.5" />
                <span>DEFENCE ISR</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#67B56B]">
                <Sprout className="h-3.5 w-3.5" />
                <span>PRECISION AG</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-8 md:grid-cols-3">
            <FooterColumn title="Specialized Sectors">
              <Link to="/defence" className="text-[#AAB7C7] transition hover:text-[#00C8FF]">
                Defence &amp; Security
              </Link>
              <Link to="/agriculture" className="text-[#AAB7C7] transition hover:text-[#67B56B]">
                Precision Agriculture
              </Link>
              <Link to="/products?category=commercial" className="text-[#AAB7C7] transition hover:text-[#F5F8FC]">
                Commercial &amp; Industrial
              </Link>
              <Link to="/products" className="text-[#AAB7C7] transition hover:text-[#F5F8FC]">
                Complete Fleet Catalog
              </Link>
            </FooterColumn>

            <FooterColumn title="Hardware Architecture">
              {HARDWARE_CATEGORIES.map((c) => (
                <Link
                  key={c}
                  to={`/products?category=${c}`}
                  className="text-[#AAB7C7] transition hover:text-[#00C8FF]"
                >
                  {CATEGORY_LABELS[c] || c}
                </Link>
              ))}
            </FooterColumn>

            <FooterColumn title="Operations & Support">
              <Link to="/about" className="text-[#AAB7C7] transition hover:text-[#F5F8FC]">
                About ZIPI Aerospace
              </Link>
              <Link to="/contact" className="text-[#AAB7C7] transition hover:text-[#F5F8FC]">
                Support &amp; Tenders Desk
              </Link>
              <Link to="/checkout" className="text-[#AAB7C7] transition hover:text-[#F5F8FC]">
                Secure Procurement
              </Link>
              <Link to="/wishlist" className="text-[#AAB7C7] transition hover:text-[#F5F8FC]">
                Saved Fleet Platforms
              </Link>
            </FooterColumn>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-[#101B2A] pt-8 text-xs text-[#AAB7C7] font-mono md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} ZIPI Aerospace Technologies. All rights reserved. EAR99 Compliant.</p>
          <Link
            to="/products"
            className="group inline-flex items-center gap-2 text-[#00C8FF] transition hover:text-cyan-300"
          >
            <span>Explore Complete Fleet</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }) {
  return (
    <div className="flex flex-col gap-3 text-sm">
      <h4 className="mb-1 font-display text-xs uppercase tracking-[0.2em] text-[#00C8FF]">
        {title}
      </h4>
      {children}
    </div>
  );
}
