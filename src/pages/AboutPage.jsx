import { Shield, Sprout, Compass } from 'lucide-react';
import Footer from '@/components/layout/Footer';
export default function AboutPage() {
    return (<div className="min-h-screen bg-neutral-950 text-white pt-24 pb-20">
      {/* Hero Banner */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 border-b border-white/10 text-center">
        <span className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-400">
          AEROSPACE ARCHITECTURE &amp; FLIGHT AUTONOMY
        </span>
        <h1 className="mt-4 font-display text-4xl sm:text-6xl font-extrabold text-white">
          Engineering the Skies of Tomorrow
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-base sm:text-lg text-zinc-300 leading-relaxed font-light">
          ZIPI was founded with a singular conviction: that unmanned aerial technology must be built with uncompromising precision, extreme durability, and ethical alignment to protect borders, feed populations, and advance industrial safety.
        </p>
      </section>

      {/* Pillars of Engineering */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="rounded-3xl border border-cyan-500/30 bg-neutral-900 p-8">
            <Shield className="h-10 w-10 text-cyan-400"/>
            <h3 className="mt-6 font-display text-2xl font-bold text-white">Lawful Defence &amp; ISR</h3>
            <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
              We engineer non-weaponized tactical surveillance, thermal reconnaissance, and search-and-rescue UAVs. Our systems empower peacekeeping, disaster recovery, and infrastructure perimeter protection.
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-500/30 bg-neutral-900 p-8">
            <Sprout className="h-10 w-10 text-emerald-400"/>
            <h3 className="mt-6 font-display text-2xl font-bold text-white">Precision Agronomy</h3>
            <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
              By combining 40-liter centrifugal atomization sprayers with scientific 5-band NDVI sensors, ZIPI enables farmers worldwide to reduce chemical consumption by 35% while maximizing harvest yields.
            </p>
          </div>

          <div className="rounded-3xl border border-sky-500/30 bg-neutral-900 p-8">
            <Compass className="h-10 w-10 text-sky-400"/>
            <h3 className="mt-6 font-display text-2xl font-bold text-white">Industrial Reliability</h3>
            <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
              Every carbon monocoque chassis is manufactured with aerospace-grade Toray composites and tested against Level 8 gale winds, electromagnetic interference, and IP66 marine torrents.
            </p>
          </div>
        </div>

        {/* Global Testing Facility Highlight */}
        <div className="mt-16 rounded-3xl border border-white/10 bg-neutral-900/60 p-8 sm:p-12 overflow-hidden relative">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                AEROSPACE TESTING COMPLEX // HIGH DESERT PROVING GROUNDS
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold text-white">
                Tested Beyond Operational Limits
              </h2>
              <p className="mt-4 text-sm text-zinc-300 leading-relaxed">
                Before any ZIPI airframe enters active duty, it undergoes 500 hours of continuous vibration shaker table testing, environmental chamber thermal cycling (-30°C to +60°C), and frequency-hopping stress tests across 50 simulated RF jamming transmitters.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="border-l-2 border-cyan-400 pl-3">
                  <span className="font-bold text-white block text-lg">10,000+</span>
                  <span className="text-zinc-400">Verified Flight Hours</span>
                </div>
                <div className="border-l-2 border-emerald-400 pl-3">
                  <span className="font-bold text-white block text-lg">42+</span>
                  <span className="text-zinc-400">Agricultural Patents</span>
                </div>
              </div>
            </div>

            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-black border border-white/10">
              <img src="https://images.pexels.com/photos/19117243/pexels-photo-19117243.jpeg?auto=compress&cs=tinysrgb&w=1000" alt="ZIPI Proving Grounds" className="h-full w-full object-cover"/>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>);
}
