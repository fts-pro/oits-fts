import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Layers, 
  Code, 
  ShieldCheck, 
  Rocket, 
  Calendar, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { PROCESS_STEPS } from '../constants';
import { SectionId } from '../types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Search: Search,
  Layers: Layers,
  Code: Code,
  ShieldCheck: ShieldCheck,
  Rocket: Rocket,
};

export const ProcessTimeline: React.FC = () => {
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
      id="process-timeline" 
      className="py-32 bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-300"
      aria-label="Our Engineered Workflow Stages"
    >
      {/* Structural visual background accents */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Dynamic Swiss Editorial Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-28 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-mono font-black uppercase tracking-[0.2em] mb-4 shadow-sm ring-1 ring-blue-500/10 rounded-full">
            <Sparkles size={11} className="text-blue-500" /> Operational Protocol
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter leading-tight">
            How We Execute.
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg sm:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
            A precise, structured software development lifecycle emphasizing rigorous technical validations, complete development velocity and pixel-perfect results.
          </p>
        </div>

        {/* Visual Timeline Section */}
        <div className="relative">
          
          {/* Timeline Center line (Alternates on desktop, left-side on mobile) */}
          <div className="absolute left-8 md:left-1/2 top-4 bottom-4 w-[2px] bg-slate-200 dark:bg-slate-850/80 -translate-x-1/2 z-0" />

          <div className="space-y-16 md:space-y-24 relative z-10">
            {PROCESS_STEPS.map((step, index) => {
              const isEven = index % 2 === 0;
              const IconComponent = iconMap[step.icon] || Search;

              return (
                <div 
                  key={step.id} 
                  className="relative flex flex-col md:flex-row items-center w-full min-h-[160px]"
                >
                  
                  {/* Left Column (Desktop Only for Even Steps, maps even cards) */}
                  <div className={`w-full md:w-1/2 pr-0 md:pr-12 lg:pr-16 order-2 md:order-1 ${isEven ? 'block' : 'hidden md:block md:invisible md:pointer-events-none'}`}>
                    {isEven && (
                      <motion.div
                        initial={{ opacity: 0, y: 40, x: -20 }}
                        whileInView={{ opacity: 1, y: 0, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: index * 0.1, ease: [0.215, 0.61, 0.355, 1] }}
                        className="w-full pl-16 md:pl-0"
                      >
                        {/* Premium Swiss-Modern Card */}
                        <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-[2rem] p-8 hover:border-slate-350 dark:hover:border-blue-500/25 transition-[transform,border-color,box-shadow] duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.01] transform-gpu will-change-transform flex flex-col justify-between h-full relative overflow-hidden">
                          {/* Top Card Info Bar */}
                          <div className="flex justify-between items-center mb-6">
                            <span className="font-mono text-5xl font-black text-slate-250 dark:text-slate-800 select-none group-hover:text-blue-500/20 transition-colors tracking-tighter">
                              {step.number}
                            </span>
                            <span className="text-[9px] font-mono font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50/50 dark:bg-blue-950/40 px-3 py-1 rounded-md border border-blue-100/30 dark:border-blue-900/20">
                              Stage {step.number}
                            </span>
                          </div>

                          {/* Body Header & Text */}
                          <div>
                            <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                              {step.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Desktop Center / Mobile Left Vector progress marker indicator node */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-830 flex items-center justify-center z-10 order-1 md:order-2 group shadow-md hover:scale-115 hover:rotate-6 transition-all duration-500 cursor-default">
                    {/* Animated dynamic pulse frames around active dot */}
                    <span className="absolute inset-0 rounded-2xl border-2 border-blue-500/40 animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <span className="absolute -inset-1 rounded-2xl border border-blue-500/20 animate-pulse group-hover:scale-110 duration-1000" />
                    
                    <IconComponent className="w-5 h-5 text-slate-650 dark:text-blue-400 group-hover:text-blue-500 transition-colors duration-300" />
                  </div>

                  {/* Right Column (Desktop Only for Odd Steps, maps odd cards; Mobile default for all odd steps too) */}
                  <div className={`w-full md:w-1/2 pl-0 md:pl-12 lg:pl-16 order-3 ${!isEven ? 'block' : 'hidden md:block md:invisible md:pointer-events-none'}`}>
                    {!isEven && (
                      <motion.div
                        initial={{ opacity: 0, y: 40, x: 20 }}
                        whileInView={{ opacity: 1, y: 0, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: index * 0.1, ease: [0.215, 0.61, 0.355, 1] }}
                        className="w-full pl-16 md:pl-0"
                      >
                        {/* Premium Swiss-Modern Card */}
                        <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-[2rem] p-8 hover:border-slate-350 dark:hover:border-blue-500/25 transition-[transform,border-color,box-shadow] duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.01] transform-gpu will-change-transform flex flex-col justify-between h-full relative overflow-hidden">
                          {/* Top Card Info Bar */}
                          <div className="flex justify-between items-center mb-6">
                            <span className="font-mono text-5xl font-black text-slate-250 dark:text-slate-800 select-none group-hover:text-blue-500/20 transition-colors tracking-tighter">
                              {step.number}
                            </span>
                            <span className="text-[9px] font-mono font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50/50 dark:bg-blue-950/40 px-3 py-1 rounded-md border border-blue-100/30 dark:border-blue-900/20">
                              Stage {step.number}
                            </span>
                          </div>

                          {/* Body Header & Text */}
                          <div>
                            <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                              {step.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* High-Contrast Interactive CTA Module */}
        <div id="cta-consultation" className="mt-28 p-8 sm:p-14 rounded-[2.5rem] bg-slate-950 dark:bg-slate-900/60 border border-slate-850 dark:border-slate-800 text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms] ease-out pointer-events-none" />
          
          <div className="max-w-xl text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-blue-400 text-[10px] font-mono font-black uppercase tracking-widest mb-4">
              <Sparkles size={11} className="animate-pulse text-blue-500" /> Professional Discovery
            </div>
            <h4 className="text-3xl md:text-4xl font-black mb-4 tracking-tighter leading-tight text-white">
              Ready to Architect Your Core?
            </h4>
            <p className="text-slate-400 text-base font-semibold leading-relaxed">
              Coordinate with OITS Dhaka engineering partners. We deliver full-stack system blueprint reviews and exact technical roadmaps. No commitment required.
            </p>
          </div>
          
          <button 
            type="button"
            onClick={() => {
              const contactElement = document.getElementById(SectionId.CONTACT) || document.getElementById('contact');
              if (contactElement) {
                contactElement.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="w-full md:w-auto shrink-0 px-8 py-4 bg-white hover:bg-blue-650 dark:bg-blue-600 dark:hover:bg-blue-700 text-slate-950 hover:text-white dark:text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all duration-300 shadow-xl hover:shadow-blue-500/15 hover:scale-103 active:scale-97 transform-gpu flex items-center justify-center gap-2.5 outline-none focus-visible:ring-4 focus-visible:ring-blue-500/40"
          >
            <Calendar size={15} />
            <span>SCHEDULE CONSULTATION</span>
            <ArrowUpRight size={14} strokeWidth={2.5} />
          </button>
        </div>

      </div>
    </section>
  );
};
