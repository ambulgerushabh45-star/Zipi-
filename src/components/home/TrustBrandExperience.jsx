import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Radio, Award, CheckCircle2, Clock, MapPin, Gauge } from 'lucide-react';

const STATS = [
  { value: '50,000+', label: 'Flight Hours Logged', sub: 'Across 4 continents', icon: Clock },
  { value: '99.8%', label: 'Mission Reliability Rate', sub: 'Zero uncommanded failures', icon: Gauge },
  { value: '25 km', label: 'LOS C2 Transmission Range', sub: 'AES-256 frequency hopping', icon: Radio },
  { value: '-35%', label: 'Agricultural Input Reduction', sub: 'Centrifugal atomization', icon: Award },
];

const PILLARS = [
  {
    icon: ShieldCheck,
    title: 'MIL-STD-810H Tested & Certified',
    description:
      'Rigorous environmental qualification against heavy sandstorms, saltwater mist, torrential rain, and extreme temperature ranges from -20°C to +55°C.',
    metric: 'IP55 / IP67 Sealed',
  },
  {
    icon: Cpu,
    title: 'Triple-Redundant VectorCore Avionics',
    description:
      'Triplicate IMUs, dual barometers, and multi-constellation GNSS (GPS, GLONASS, Galileo, BeiDou) ensure failsafe autonomous flight stability.',
    metric: 'Triple Sensor Fusion',
  },
  {
    icon: Radio,
    title: 'Hardware-Level AES-256 Encryption',
    description:
      'Zero-leak cryptographic command, control, and multi-stream video downlinks resistant to hostile electronic jamming and spoofing.',
    metric: 'Frequency-Hopping C2',
  },
  {
    icon: MapPin,
    title: 'Enterprise Fleet Support & Global RTK',
    description:
      'Direct factory engineering support, rapid spares turnaround, and integrated RTK base-station synchronization for centimeter-level operations.',
    metric: '24/7 Mission Readiness',
  },
];

export default function TrustBrandExperience() {
  return (
    <section className="relative bg-[#07111F] py-24 px-5 sm:px-8 border-t border-[#101B2A] text-[#F5F8FC]">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00C8FF]/40 bg-[#101B2A] px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-[#00C8FF] mb-4">
            <ShieldCheck className="h-4 w-4" />
            <span>AEROSPACE RELIABILITY &amp; TRUST</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight">
            Engineered for Critical Airspace.{' '}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00C8FF] via-cyan-200 to-[#F5F8FC]">
              Proven in the Field.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#AAB7C7] font-normal leading-relaxed">
            Every ZIPI unmanned system undergoes rigorous aerodynamic testing, electromagnetic interference shielding, and structural stress validation before entering mission deployment.
          </p>
        </div>

        {/* Global Operational Metrics */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-16">
          {STATS.map((stat, i) => {
            const IconComp = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-3xl border border-[#101B2A] bg-[#101B2A]/60 p-6 sm:p-8 backdrop-blur transition-all duration-300 hover:border-[#00C8FF]/50 hover:bg-[#101B2A]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#00C8FF]/10 text-[#00C8FF] mb-4">
                  <IconComp className="h-5 w-5" />
                </div>
                <div className="font-display text-4xl sm:text-5xl font-extrabold text-[#F5F8FC] tracking-tight">
                  {stat.value}
                </div>
                <h4 className="font-bold text-sm text-[#F5F8FC] mt-2">{stat.label}</h4>
                <p className="font-mono text-xs text-[#AAB7C7] mt-1">{stat.sub}</p>
              </motion.div>
            );
          })}
        </div>

        {/* 4 Technical Pillars Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {PILLARS.map((pillar, i) => {
            const IconComp = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group rounded-3xl border border-[#101B2A] bg-[#101B2A]/40 p-8 transition-all duration-300 hover:border-[#00C8FF]/50 hover:bg-[#101B2A]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#00C8FF]/30 bg-[#07111F] text-[#00C8FF] shadow-[0_0_15px_rgba(0,200,255,0.2)]">
                    <IconComp className="h-6 w-6" />
                  </div>
                  <span className="rounded-full border border-white/10 bg-[#07111F] px-3 py-1 text-[11px] font-mono text-[#00C8FF]">
                    {pillar.metric}
                  </span>
                </div>

                <h3 className="mt-6 font-display text-xl font-bold text-[#F5F8FC] group-hover:text-[#00C8FF] transition-colors">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#AAB7C7]">
                  {pillar.description}
                </p>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-[#00C8FF]">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>AEROSPACE QUALITY ASSURANCE STANDARD</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

