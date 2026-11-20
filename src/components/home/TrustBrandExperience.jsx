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
    <section className="relative border-t border-b border-[#E2E8F0] bg-white py-24 px-5 sm:px-8 text-[#080D14]">
      <div className="mx-auto max-w-7xl space-y-16">
        {/* Trust Marquee Strip */}
        <div className="space-y-4">
          <p className="text-center font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[#64748b]">
            VERIFIED FLEET PROTOCOLS // OPERATIONAL WORLDWIDE
          </p>
          <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] py-4 px-2">
            <Marquee items={TRUST_STRIP_BADGES} />
          </div>
        </div>

        {/* Section Header */}
        <Reveal direction="up" className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00C9E8]/40 bg-[#00C9E8]/10 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-widest text-[#0092ab] mb-4">
            <ShieldCheck className="h-4 w-4" />
            <span>AEROSPACE RELIABILITY METRICS</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#080D14]">
            Engineered for Critical Airspace.{' '}
            <span className="block bg-gradient-to-r from-[#0092ab] via-[#0284c7] to-[#0ea5e9] bg-clip-text text-transparent">
              Built on Verifiable Hardware.
            </span>
          </h2>
          <p className="mt-4 text-base text-[#475569] leading-relaxed">
            Every platform metric below reflects production hardware configurations deployed across ZIPI Drones, Handheld Controllers, and Ground Command Stations.
          </p>
        </Reveal>

        {/* Real Catalog Stat Counters */}
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {realStats.map((stat) => {
            const IconComp = stat.icon;
            return (
              <StaggerItem key={stat.label}>
                <div className="rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 sm:p-7 transition-all duration-300 hover:border-[#00C9E8] hover:bg-white hover:shadow-[0_15px_35px_rgba(0,201,232,0.12)]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#080D14] text-[#00C9E8] shadow-[0_0_12px_rgba(0,201,232,0.25)] mb-4">
                    <IconComp className="h-5 w-5" />
                  </div>
                  <div className="font-display text-4xl sm:text-5xl font-extrabold text-[#080D14] tracking-tight">
                    <Counter value={stat.value} />
                  </div>
                  <h3 className="font-bold text-sm text-[#080D14] mt-2">{stat.label}</h3>
                  <p className="font-mono text-xs text-[#64748b] mt-1">{stat.sub}</p>
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
                <div className="group h-full rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-7 sm:p-8 transition-all duration-300 hover:border-[#00C9E8] hover:bg-white hover:shadow-[0_15px_35px_rgba(0,201,232,0.12)]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#080D14] text-[#00C9E8] shadow-[0_0_12px_rgba(0,201,232,0.25)]">
                      <IconComp className="h-6 w-6" />
                    </div>
                    <span className="rounded-full border border-[#CBD5E1] bg-white px-3 py-1 text-[11px] font-mono font-bold text-[#080D14]">
                      {pillar.metric}
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-xl font-bold text-[#080D14] group-hover:text-[#0092ab] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                    {pillar.description}
                  </p>

                  <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center gap-2 text-xs font-mono font-bold text-[#0092ab]">
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
