import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Target, Globe, ShieldCheck, Users } from 'lucide-react';
import { SectionId } from '../types';

const STATS = [
  { value: '412+', label: 'Projects Completed' },
  { value: '200+', label: 'Satisfied Clients' },
  { value: '100+', label: 'Skilled Experts' },
  { value: '10+', label: 'Years of Excellence' },
];

const OFFICES = [
  { city: 'Dhaka', country: 'Bangladesh', role: 'Engineering Hub' },
  { city: 'Singapore', country: 'Singapore', role: 'APAC Ops' },
  { city: 'Kuala Lumpur', country: 'Malaysia', role: 'APAC Partner' },
  { city: 'London', country: 'United Kingdom', role: 'Europe HQ' },
];

const CORE_VALUES = [
  'ISO 27001 Certified Security',
  'GDPR-Compliant Practices',
  '24/7 Maintenance & Support',
  'Dedicated Agile Teams',
  'Global Delivery Standards',
  'Top-tier Cybersecurity',
];

export const About: React.FC = () => {
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [isMissionVisible, setIsMissionVisible] = useState(false);
  const [isValuesVisible, setIsValuesVisible] = useState(false);
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const [isOfficesVisible, setIsOfficesVisible] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const officesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observeElement = (
      ref: React.RefObject<HTMLElement>,
      setState: React.Dispatch<React.SetStateAction<boolean>>,
      threshold = 0.2
    ) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setState(true);
            observer.disconnect();
          }
        },
        { threshold }
      );
      if (ref.current) observer.observe(ref.current);
      return observer;
    };

    const heroObs = observeElement(heroRef, setIsHeroVisible, 0.1);
    const missionObs = observeElement(missionRef, setIsMissionVisible, 0.2);
    const valuesObs = observeElement(valuesRef, setIsValuesVisible, 0.2);
    const statsObs = observeElement(statsRef, setIsStatsVisible, 0.4);
    const officesObs = observeElement(officesRef, setIsOfficesVisible, 0.15);

    return () => {
      heroObs.disconnect();
      missionObs.disconnect();
      valuesObs.disconnect();
      statsObs.disconnect();
      officesObs.disconnect();
    };
  }, []);

  return (
    <section
      id={SectionId.ABOUT}
      className="py-24 bg-white dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden"
    >
      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">

          {/* Hero Image Section */}
          <div
            ref={heroRef}
            className={`flex-1 w-full relative transition-all duration-1000 ease-out ${
              isHeroVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            {/* Header & Paragraph moved from right column */}
            <div className="mb-10 lg:mb-12">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-sky-500 dark:text-sky-400" />
                <h2 className="text-sm font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest">
                  About OITS
                </h2>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-br dark:from-white dark:to-slate-400 leading-tight mb-6">
                Global Tech Solutions.<br />Enterprise-Ready.
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                OITS is your international software engineering partner, delivering secure, scalable solutions across
                software development, cloud, data, cybersecurity, and blockchain. Our ISO 27001 and GDPR-compliant
                practices ensure trust at every level.
              </p>
            </div>

            <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-800/50 shadow-2xl shadow-sky-500/10 group border border-slate-800/80">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                alt="OITS Dhaka engineering team collaborating"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex items-end p-8">
                <div className="text-white">
                  <p className="text-3xl font-bold text-white">10+</p>
                  <p className="text-sm text-sky-300/80">Years of Excellence</p>
                </div>
              </div>
            </div>
            {/* Floater card */}
            <div className="absolute -bottom-8 -right-8 w-52 dark:bg-slate-900/80 bg-white backdrop-blur-md p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-sky-500/20 hidden md:block z-10 transition-transform duration-500 hover:scale-105 dark:glass-card-glow">
              <p className="text-slate-500 dark:text-sky-400/70 text-xs uppercase font-semibold mb-2">
                Projects Completed
              </p>
              <p className="text-4xl font-bold text-blue-600 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-sky-400 dark:to-blue-500">
                412+
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-12">
            {/* Mission & Vision Subsection */}
            <div
              ref={missionRef}
              className={`space-y-6 transition-all duration-1000 ease-out ${
                isMissionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Mission Block */}
              <div className="p-5 rounded-2xl bg-blue-50 dark:bg-sky-500/5 border border-blue-100 dark:border-sky-500/20 backdrop-blur-sm">
                <p className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-sky-400 mb-2">
                  Our Mission
                </p>
                <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
                  Delivering secure, high-quality, and scalable software that drives growth, enhances operations, and
                  supports digital transformation—guided by global standards and local expertise.
                </p>
              </div>
            </div>

            {/* Core Values Subsection */}
            <div
              ref={valuesRef}
              className={`transition-all duration-1000 ease-out ${
                isValuesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex items-center gap-2 mb-6">
                <ShieldCheck className="w-5 h-5 text-sky-500 dark:text-sky-400" />
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Core Standards</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CORE_VALUES.map((item, idx) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 hover:border-sky-500/30 dark:hover:border-sky-500/30 hover:bg-sky-50/50 dark:hover:bg-sky-500/5 transition-all duration-300"
                    style={{ transitionDelay: isValuesVisible ? `${idx * 80}ms` : '0ms' }}
                  >
                    <CheckCircle2 className="text-emerald-500 dark:text-emerald-400 w-5 h-5 flex-shrink-0" />
                    <span className="font-medium text-slate-800 dark:text-slate-200 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Subsection */}
            <div
              ref={statsRef}
              className={`pt-4 transition-all duration-1000 ease-out ${
                isStatsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700/60 to-transparent mb-8" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {STATS.map((stat, idx) => (
                  <div key={stat.label} style={{ transitionDelay: isStatsVisible ? `${idx * 100}ms` : '0ms' }}>
                    <p className="text-3xl font-bold text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-sky-400 dark:to-blue-400">
                      {stat.value}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-tight">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Global Offices Section */}
        <div ref={officesRef}>
          <div
            className={`text-center mb-12 transition-all duration-1000 ease-out ${
              isOfficesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Globe className="w-5 h-5 text-sky-500 dark:text-sky-400" />
              <h2 className="text-sm font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest">
                Global Presence
              </h2>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-br dark:from-white dark:to-slate-400">
              Engineering hub in Dhaka.<br />Commercial reach worldwide.
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-2xl mx-auto">
              With our development hub in Dhaka and commercial teams in Singapore, Malaysia, the United Kingdom, and
              Europe, we provide local engagement supported by global standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {OFFICES.map((office, index) => (
              <div
                key={office.city}
                className={`group relative rounded-2xl overflow-hidden transition-all duration-700 ease-out transform p-6
                  bg-white dark:bg-slate-900/50 backdrop-blur-sm
                  border border-slate-200/80 dark:border-slate-700/50
                  hover:border-sky-500/40 dark:hover:border-sky-500/40
                  shadow-sm hover:shadow-lg hover:shadow-sky-500/5
                  dark:glass-card-glow
                  ${isOfficesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: isOfficesVisible ? `${index * 150}ms` : '0ms' }}
              >
                {/* Hover glow overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500/0 to-sky-500/0 group-hover:from-sky-500/5 group-hover:to-transparent transition-all duration-500 rounded-2xl pointer-events-none" />

                <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-500/10 border border-sky-100 dark:border-sky-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 relative z-10">
                  <Users className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-sky-600 dark:text-sky-400 mb-1 relative z-10">
                  {office.role}
                </p>
                <h4 className="font-bold text-slate-900 dark:text-white text-lg relative z-10">{office.city}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 relative z-10">{office.country}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};