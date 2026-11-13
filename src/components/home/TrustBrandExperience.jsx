import { useMemo } from 'react';
import { ShieldCheck, Cpu, Radio, Layers, CheckCircle2 } from 'lucide-react';
import { PRODUCTS, HARDWARE_CATEGORIES } from '@/data/products';
import { TRUST_STRIP_BADGES } from '@/data/siteContent';
import { Counter, Marquee, Reveal, Stagger, StaggerItem } from '@/components/motion';

const PILLARS = [
  {
    icon: ShieldCheck,
    title: 'Environmental & Ingress Validation',
    description:
      'Built for field deployment across rain, dust, coastal wind gusts, and wide thermal ranges with sealed IP-rated enclosures.',
    metric: 'IP55 / IP67 Sealed',
  },
  {
    icon: Cpu,
    title: 'Triple-Redundant VectorCore Avionics',
    description:
      'Triplicate IMUs, dual barometers, and multi-constellation GNSS positioning maintain failsafe stability.',
    metric: 'Triple Sensor Fusion',
  },
  {
    icon: Radio,
    title: 'Hardware-Level AES-256 Encryption',
    description:
      'Frequency-hopping telemetry and video downlinks designed to protect mission integrity against RF interference.',
    metric: 'Frequency-Hopping C2',
  },
  {
    icon: Layers,
    title: 'Unified Drones, Controllers & GCS',
    description:
      'Every airframe pairs natively with ZIPI daylight remote controllers, ground stations, and diagnostic datalinks.',
    metric: 'Interoperable Fleet',
  },
];

export default function TrustBrandExperience() {
  const realStats = useMemo(() => {
    const droneCount = PRODUCTS.filter((p) => p.hardwareType === 'drone').length;
    const controllerCount = PRODUCTS.filter((p) => p.hardwareType === 'controller').length;
    return [
      {
        value: PRODUCTS.length,
        label: 'Certified Systems in Catalog',
        sub: 'Live inventory in products.js',
        icon: Layers,
      },
      {
        value: HARDWARE_CATEGORIES.length,
        label: 'Core Hardware Architectures',
        sub: 'Drones, Controllers, GCS & Avionics',
        icon: Cpu,
      },
      {
        value: droneCount,
        label: 'UAV Drone Platforms',
        sub: 'Defence ISR, Agriculture & Survey',
        icon: ShieldCheck,
      },
      {
        value: controllerCount,
        label: 'Remote Controller Models',
        sub: 'Handheld, Long-Range & Swarm C2',
        icon: Radio,
      },
    ];
  }, []);

  return (
    <section className="relative border-t border-white/10 bg-[#050b14] py-20 px-5 sm:px-8 text-[#f1f5f9]">
      <div className="mx-auto max-w-7xl space-y-14">
        {/* Trust Marquee Strip */}
        <div className="space-y-4">
          <p className="text-center font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[#94a3b8]">
            TRUSTED ARCHITECTURE // HOVER TO PAUSE
          </p>
          <Marquee items={TRUST_STRIP_BADGES} />
        </div>

        {/* Section Header */}
        <Reveal direction="up" className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/35 bg-[#0b1a2c] px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-cyan-300 mb-4">
            <ShieldCheck className="h-4 w-4" />
            <span>DRONE &amp; CONTROL RELIABILITY</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight">
            Engineered for Critical Airspace.{' '}
            <span className="block bg-gradient-to-r from-[#22d3ee] to-[#0ea5e9] bg-clip-text text-transparent">
              Built on Verifiable Hardware.
            </span>
          </h2>
          <p className="mt-4 text-base text-[#94a3b8] leading-relaxed">
            Every platform count below reflects live hardware lines available across ZIPI Drones &amp; Controls.
          </p>
        </Reveal>

        {/* Real Catalog Stat Counters */}
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {realStats.map((stat) => {
            const IconComp = stat.icon;
            return (
              <StaggerItem key={stat.label}>
                <div className="rounded-3xl border border-white/10 bg-[#0b1a2c] p-6 sm:p-7 transition-colors hover:border-cyan-400/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300 mb-4">
                    <IconComp className="h-5 w-5" />
                  </div>
                  <div className="font-display text-4xl sm:text-5xl font-extrabold text-[#f1f5f9] tracking-tight">
                    <Counter value={stat.value} />
                  </div>
                  <h3 className="font-bold text-sm text-[#f1f5f9] mt-2">{stat.label}</h3>
                  <p className="font-mono text-xs text-[#94a3b8] mt-1">{stat.sub}</p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>

        {/* 4 Technical Pillars Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {PILLARS.map((pillar, i) => {
            const IconComp = pillar.icon;
            return (
              <Reveal key={pillar.title} direction={i % 2 === 0 ? 'left' : 'right'}>
                <div className="group h-full rounded-3xl border border-white/10 bg-[#08121f] p-7 sm:p-8 transition-colors hover:border-cyan-400/50 hover:bg-[#0b1a2c]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/30 bg-[#050b14] text-cyan-300">
                      <IconComp className="h-6 w-6" />
                    </div>
                    <span className="rounded-full border border-white/10 bg-[#050b14] px-3 py-1 text-[11px] font-mono text-cyan-300">
                      {pillar.metric}
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-xl font-bold text-[#f1f5f9] group-hover:text-cyan-300 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#94a3b8]">
                    {pillar.description}
                  </p>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-mono text-cyan-300">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>ZIPI DRONES &amp; CONTROLS QUALITY STANDARD</span>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
