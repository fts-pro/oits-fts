import React, { useEffect, useRef, useState } from 'react';
import { Search, Layers, Code, ShieldCheck, Rocket, ChevronRight, Calendar } from 'lucide-react';
import { PROCESS_STEPS } from '../constants';
import { SectionId } from '../types';

const iconMap: Record<string, React.ReactNode> = {
  Search: <Search className="w-6 h-6" />,
  Layers: <Layers className="w-6 h-6" />,
  Code: <Code className="w-6 h-6" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6" />,
  Rocket: <Rocket className="w-6 h-6" />,
};

export const Process: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={SectionId.PROCESS}
      className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-300"
    >
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest mb-4">
            Our Workflow
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-br dark:from-white dark:to-slate-400 mb-6">
            How we bring your vision to life.
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
            A structured, agile development lifecycle designed for speed, transparency, and high-quality outcomes.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700/50 to-transparent -translate-y-12 z-0" />

          {PROCESS_STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`relative z-10 flex flex-col items-center text-center transition-all duration-1000 ease-out transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="mb-6 relative group">
                {/* Icon card */}
                <div className="w-16 h-16 rounded-2xl
                  bg-white dark:bg-slate-800/60
                  border border-slate-200 dark:border-slate-700/60
                  dark:hover:border-sky-500/40
                  flex items-center justify-center
                  text-sky-600 dark:text-sky-400
                  shadow-lg dark:shadow-sky-500/5
                  group-hover:scale-110 group-hover:rotate-6
                  backdrop-blur-sm
                  transition-all duration-300">
                  {iconMap[step.icon]}
                </div>
                {/* Step number badge */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full
                  bg-gradient-to-br from-sky-500 to-blue-600
                  text-white text-xs font-bold
                  flex items-center justify-center
                  border-2 border-slate-50 dark:border-slate-950
                  shadow-lg shadow-sky-500/30">
                  {step.number}
                </div>
              </div>

              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{step.title}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[200px] font-medium">
                {step.description}
              </p>

              {index < PROCESS_STEPS.length - 1 && (
                <div className="md:hidden flex justify-center py-6 text-slate-300 dark:text-slate-700">
                  <ChevronRight className="rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-20 p-8 md:p-12 rounded-3xl overflow-hidden relative group
          bg-gradient-to-br from-slate-900 to-slate-950
          dark:from-slate-900/80 dark:to-slate-950
          border border-sky-500/20
          shadow-2xl shadow-sky-500/10
          backdrop-blur-sm">

          {/* Animated shimmer sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1400ms] ease-in-out pointer-events-none rounded-3xl" />
          {/* Top border glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full relative z-10">
            <div className="flex flex-col gap-1">
              <h4 className="text-3xl font-black mb-3 tracking-tight text-white leading-snug">
                Need a Discussion on{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-400">
                  Project Requirements?
                </span>
              </h4>
              <p className="text-slate-400 text-sm font-medium">Schedule a Session with Experts</p>
            </div>

            <div className="flex flex-col gap-3">
              <ul className="space-y-2">
                {['May 28 - 10:00 AM', 'May 28 - 02:00 PM', 'May 29 - 11:00 AM', 'Jun 01 - 10:00 AM'].map(
                  (time, idx) => (
                    <li
                      key={idx}
                      className="text-[11px] bg-slate-800/60 border border-slate-700/50 px-3 py-1.5 rounded-lg font-bold text-slate-300"
                    >
                      {time}
                    </li>
                  )
                )}
              </ul>
              <button
                onClick={() => {
                  const contactElement =
                    document.getElementById(SectionId.CONTACT) || document.getElementById('contact');
                  if (contactElement) {
                    contactElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-6 py-2.5 rounded-xl font-black text-xs w-full flex items-center justify-center gap-2
                  bg-gradient-to-r from-sky-500 to-blue-600
                  text-white
                  hover:from-sky-400 hover:to-blue-500
                  shadow-lg shadow-sky-500/25
                  hover:shadow-sky-500/40
                  transition-all duration-300
                  active:scale-95"
              >
                <Calendar size={13} />
                SCHEDULE A CALL
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
