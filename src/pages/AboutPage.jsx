import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Shield, Sprout, Compass, Award, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { ABOUT_TIMELINE, ABOUT_TEAM_CARDS, ABOUT_CERTIFICATIONS } from '@/data/siteContent';
import { Reveal, Stagger, StaggerItem, Tilt, Counter } from '@/components/motion';
import Footer from '@/components/layout/Footer';

export default function AboutPage() {
    useDocumentTitle('About Us');
    const prefersReducedMotion = useReducedMotion();
    const timelineRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: timelineRef,
        offset: ['start 0.75', 'end 0.75'],
    });
    const lineScaleY = useTransform(scrollYProgress, [0, 1], [0.05, 1]);

    return (<div className="min-h-screen bg-[#050b14] text-[#f1f5f9] pt-24 pb-20">
      {/* Hero Banner */}
      <section className="relative overflow-hidden border-b border-white/10 bg-[#08121f]/60">
        <div className="pointer-events-none absolute inset-0 hero-grid-overlay opacity-45" />
        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 text-center">
          <Reveal>
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-400">
              AUTONOMOUS ARCHITECTURE &amp; FLIGHT CONTROL
            </span>
            <h1 className="mt-4 font-display text-4xl sm:text-6xl font-extrabold text-[#f1f5f9]">
              Engineering the Skies of Tomorrow
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base sm:text-lg text-[#94a3b8] leading-relaxed">
              ZIPI Drones &amp; Controls was founded with a singular conviction: unmanned aerial technology must be built with uncompromising precision, extreme durability, and ethical alignment to protect perimeters, sustain global food harvests, and advance industrial safety.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Pillars of Engineering */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <Stagger className="grid gap-8 sm:grid-cols-3">
          <StaggerItem>
            <Tilt maxTilt={5} className="h-full">
              <div className="hud-bracket h-full rounded-3xl border border-[#60a5fa]/30 bg-[#0b1a2c] p-8 shadow-xl transition-all duration-300 hover:border-[#60a5fa] hover:shadow-[0_0_30px_rgba(96,165,250,0.2)]">
                <Shield className="h-10 w-10 text-[#60a5fa]"/>
                <h2 className="mt-6 font-display text-2xl font-bold text-[#f1f5f9]">Lawful Defence &amp; ISR</h2>
                <p className="mt-3 text-sm text-[#94a3b8] leading-relaxed">
                  We engineer non-weaponized tactical surveillance, thermal reconnaissance, and search-and-rescue UAVs. Our systems empower peacekeeping, disaster recovery, and infrastructure perimeter protection.
                </p>
              </div>
            </Tilt>
          </StaggerItem>

          <StaggerItem>
            <Tilt maxTilt={5} className="h-full">
              <div className="hud-bracket h-full rounded-3xl border border-[#4ade80]/30 bg-[#0b1a2c] p-8 shadow-xl transition-all duration-300 hover:border-[#4ade80] hover:shadow-[0_0_30px_rgba(74,222,128,0.2)]">
                <Sprout className="h-10 w-10 text-[#4ade80]"/>
                <h2 className="mt-6 font-display text-2xl font-bold text-[#f1f5f9]">Precision Agronomy</h2>
                <p className="mt-3 text-sm text-[#94a3b8] leading-relaxed">
                  By combining 40-liter centrifugal atomization sprayers with scientific 5-band NDVI sensors, ZIPI enables farmers worldwide to reduce chemical consumption by 35% while maximizing harvest yields.
                </p>
              </div>
            </Tilt>
          </StaggerItem>

          <StaggerItem>
            <Tilt maxTilt={5} className="h-full">
              <div className="hud-bracket h-full rounded-3xl border border-cyan-400/30 bg-[#0b1a2c] p-8 shadow-xl transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                <Compass className="h-10 w-10 text-[#22d3ee]"/>
                <h2 className="mt-6 font-display text-2xl font-bold text-[#f1f5f9]">Industrial Reliability</h2>
                <p className="mt-3 text-sm text-[#94a3b8] leading-relaxed">
                  Every carbon monocoque chassis is manufactured with precision carbon-kevlar Toray composites and tested against Level 8 gale winds, electromagnetic interference, and IP66 marine torrents.
                </p>
              </div>
            </Tilt>
          </StaggerItem>
        </Stagger>

        {/* Scroll-Driven Engineering Timeline */}
        <div ref={timelineRef} className="mt-24">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400">
              EVOLUTION TRAJECTORY
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-[#f1f5f9]">
              Mission Architecture Roadmap
            </h2>
          </Reveal>

          <div className="relative mx-auto max-w-4xl">
            {/* Scroll progress track */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-white/10" aria-hidden="true" />
            <motion.div
              style={{ scaleY: prefersReducedMotion ? 1 : lineScaleY, transformOrigin: 'top' }}
              className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-[#22d3ee] via-[#0ea5e9] to-[#4ade80]"
              aria-hidden="true"
            />

            <div className="space-y-10">
              {ABOUT_TIMELINE.map((milestone, idx) => {
                const isLeft = idx % 2 === 0;
                return (
                  <Reveal
                    key={milestone.year}
                    delay={idx * 0.06}
                    x={isLeft ? -24 : 24}
                    y={12}
                    className={`relative pl-12 sm:pl-0 sm:grid sm:grid-cols-2 sm:gap-10 items-center`}
                  >
                    <span className="absolute left-4 sm:left-1/2 top-5 -translate-x-1/2 h-3.5 w-3.5 rounded-full border-2 border-[#050b14] bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                    <div className={isLeft ? 'sm:text-right sm:pr-4' : 'sm:col-start-2 sm:pl-4'}>
                      <div className="rounded-2xl border border-white/10 bg-[#0b1a2c]/90 p-5 hover:border-cyan-400/40 transition">
                        <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-400">
                          {milestone.year}
                        </span>
                        <h3 className="mt-1 font-display text-lg font-bold text-[#f1f5f9]">
                          {milestone.title}
                        </h3>
                        <p className="mt-2 text-xs text-[#94a3b8] leading-relaxed">
                          {milestone.summary}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>

        {/* Proving Grounds Highlight with Animated Counters */}
        <Reveal className="mt-24 rounded-3xl border border-white/10 bg-[#0b1a2c]/80 p-8 sm:p-12 overflow-hidden relative">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                PROVING COMPLEX // HIGH DESERT TEST RANGE
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold text-[#f1f5f9]">
                Tested Beyond Operational Limits
              </h2>
              <p className="mt-4 text-sm text-[#94a3b8] leading-relaxed">
                Before any ZIPI airframe or ground controller enters active duty, it undergoes 500 hours of continuous vibration shaker table testing, environmental chamber thermal cycling (-30°C to +60°C), and frequency-hopping stress tests across 50 simulated RF jamming transmitters.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="border-l-2 border-cyan-400 pl-3">
                  <span className="font-bold text-[#f1f5f9] block text-xl">
                    <Counter to={10000} suffix="+" />
                  </span>
                  <span className="text-[#94a3b8]">Verified Flight Hours</span>
                </div>
                <div className="border-l-2 border-[#4ade80] pl-3">
                  <span className="font-bold text-[#f1f5f9] block text-xl">
                    <Counter to={42} suffix="+" />
                  </span>
                  <span className="text-[#94a3b8]">Agricultural Patents</span>
                </div>
              </div>
            </div>

            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#050b14] border border-white/10">
              <img src="https://images.pexels.com/photos/19117243/pexels-photo-19117243.jpeg?auto=compress&cs=tinysrgb&w=1000" alt="ZIPI Proving Grounds" loading="lazy" className="h-full w-full object-cover"/>
            </div>
          </div>
        </Reveal>

        {/* Engineering Teams & Compliance Certifications */}
        <div className="mt-20 grid gap-10 lg:grid-cols-2">
          <Reveal x={-20} y={10}>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-cyan-400 mb-4">
              <Users className="h-4 w-4" />
              <span>ENGINEERING DIVISIONS</span>
            </div>
            <div className="space-y-4">
              {ABOUT_TEAM_CARDS.map((team) => (
                <div key={team.role} className="rounded-2xl border border-white/10 bg-[#0b1a2c] p-5 hover:border-cyan-400/40 transition">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-lg font-bold text-[#f1f5f9]">{team.role}</h3>
                    <span className="rounded-full border border-white/10 bg-[#08121f] px-3 py-0.5 font-mono text-[10px] text-cyan-300">
                      {team.lead}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[#94a3b8] leading-relaxed">{team.focus}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal x={20} y={10} delay={0.1}>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-cyan-400 mb-4">
              <Award className="h-4 w-4" />
              <span>STANDARDS &amp; CERTIFICATIONS</span>
            </div>
            <div className="space-y-4">
              {ABOUT_CERTIFICATIONS.map((cert) => (
                <div key={cert.code} className="rounded-2xl border border-white/10 bg-[#0b1a2c] p-5 hover:border-cyan-400/40 transition">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-lg font-bold text-[#f1f5f9]">{cert.title}</h3>
                    <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-0.5 font-mono text-[10px] font-bold text-cyan-300">
                      {cert.code}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[#94a3b8] leading-relaxed">{cert.detail}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-16 rounded-3xl border border-cyan-400/25 bg-[#08121f] p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-cyan-400">PARTNER &amp; FLEET PROCUREMENT</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-[#f1f5f9]">
              Ready to deploy ZIPI Drones &amp; Controls?
            </h2>
          </div>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#22d3ee] to-[#0ea5e9] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#031018] hover:brightness-110 transition">
            <span>Open Enquiry Desk</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>

      <Footer />
    </div>);
}
