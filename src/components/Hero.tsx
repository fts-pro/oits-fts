import React, { useState, useEffect } from 'react';
import { ArrowRight, Terminal, Code2, Cpu, Globe, Smartphone, Cloud, ChevronRight, ChevronLeft, ExternalLink, Quote } from 'lucide-react';
import { SectionId } from '../types';
import { TAGLINE, SERVICES, PROJECTS, TESTIMONIALS } from '../constants';

export const Hero: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');

  const scrollToContact = () => {
    document.getElementById(SectionId.CONTACT)?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAbout = () => {
    document.getElementById(SectionId.ABOUT)?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPortfolio = () => {
    document.getElementById(SectionId.PORTFOLIO)?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    let animationFrameId: number;
    const handleMouseMove = (e: MouseEvent) => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        setMousePos({
          x: (e.clientX / window.innerWidth - 0.5) * 2,
          y: (e.clientY / window.innerHeight - 0.5) * 2,
        });
      });
    };

    const projectInterval = setInterval(() => {
      setActiveProjectIndex((prev) => {
        const currentFiltered = activeCategory === 'All' ? PROJECTS : PROJECTS.filter(p => p.category === activeCategory);
        return (prev + 1) % Math.max(1, Math.min(currentFiltered.length, 4));
      });
    }, 5000);

    const testimonialInterval = setInterval(() => {
      setActiveTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
      clearInterval(projectInterval);
      clearInterval(testimonialInterval);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [activeCategory]);

  const nextProject = () => {
    setActiveProjectIndex((prev) => {
        const currentFiltered = activeCategory === 'All' ? PROJECTS : PROJECTS.filter(p => p.category === activeCategory);
        return (prev + 1) % Math.max(1, Math.min(currentFiltered.length, 4));
    });
  };
  
  const prevProject = () => {
    setActiveProjectIndex((prev) => {
        const currentFiltered = activeCategory === 'All' ? PROJECTS : PROJECTS.filter(p => p.category === activeCategory);
        const len = Math.min(currentFiltered.length, 4);
        return (prev - 1 + len) % Math.max(1, len);
    });
  };

  const categories = ['All', ...Array.from(new Set(PROJECTS.map(p => p.category)))].slice(0, 3);
  const filteredProjects = activeCategory === 'All' ? PROJECTS : PROJECTS.filter(p => p.category === activeCategory);
  const activeProject = filteredProjects[activeProjectIndex] || filteredProjects[0];

  const nextTestimonial = () => setActiveTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  const prevTestimonial = () => setActiveTestimonialIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section id={SectionId.HOME} className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 z-0 transition-transform duration-300 ease-out will-change-transform"
        style={{ 
          transform: `scale(1.1) translate3d(${mousePos.x * 10}px, ${mousePos.y * 10}px, 0)` 
        }}
      >
         <img 
            src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop" 
            alt="" 
            className="w-full h-full object-cover opacity-100 dark:opacity-40 transition-opacity duration-700"
            loading="eager"
         />
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
      </div>

      <div className="absolute inset-0 z-0 bg-gradient-to-r from-slate-50 via-slate-50/95 to-slate-50/80 dark:from-slate-950 dark:via-slate-950/85 dark:to-slate-950 pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          
          <div className="lg:col-span-7">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/90 dark:bg-blue-900/60 backdrop-blur-md text-blue-800 dark:text-blue-200 text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-blue-200 dark:border-blue-700 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Terminal size={14} className="animate-pulse" />
              <span>Dhaka's Premier Engineering Studio</span>
            </div>
            
            {/* Tagline */}
            <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-slate-950 dark:text-white leading-[0.95] tracking-tighter mb-8">
              {TAGLINE.split(' ').map((word, i) => (
                <span 
                  key={i} 
                  className={`inline-block transition-all duration-700 ${i < 2 ? '' : 'text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-700 dark:from-white dark:to-slate-400'}`}
                  style={{ 
                    transitionDelay: `${100 + i * 100}ms`,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  }}
                >
                  {word}&nbsp;
                </span>
              ))}
            </h1>

            {/* Description */}
            <div 
              className={`relative mb-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: '500ms' }}
            >
              <div className="absolute -left-6 top-2 bottom-2 w-1 bg-blue-600 rounded-full" />
              <p className="text-lg sm:text-xl text-slate-900 dark:text-slate-100 font-medium max-w-2xl leading-relaxed pl-6">
                We architect high-performance digital systems for global disruptors. 
                From strategic consultation to industrial-grade deployment.
              </p>
            </div>

            {/* CTA Buttons */}
            <div 
              className={`flex flex-col sm:flex-row items-center gap-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: '700ms' }}
            >
              <button 
                onClick={scrollToContact} 
                className="w-full sm:w-auto h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                GET QUOTE <ArrowRight size={16} />
              </button>
              <button 
                onClick={scrollToContact} 
                className="w-full sm:w-auto h-12 px-8 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                REQUEST DEMO
              </button>
            </div>

            {/* Testimonial Snippet */}
            <div 
              className={`mt-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: '900ms' }}
            >
              <div className="p-6 rounded-2xl bg-white/40 dark:bg-slate-950/20 backdrop-blur-md border border-white/50 dark:border-slate-800/60 transition-all duration-500">
                <p className="text-sm italic text-slate-700 dark:text-slate-300 mb-4">
                  "{TESTIMONIALS[activeTestimonialIndex].content}"
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={TESTIMONIALS[activeTestimonialIndex].avatar} alt="" className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800" />
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{TESTIMONIALS[activeTestimonialIndex].name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">{TESTIMONIALS[activeTestimonialIndex].role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={prevTestimonial} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"><ChevronLeft size={16} /></button>
                    <button onClick={nextTestimonial} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"><ChevronRight size={16} /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Portfolio Preview */}
          <div className="hidden lg:block lg:col-span-5 relative">
            <div 
              className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
              style={{ transitionDelay: '1100ms' }}
            >
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-slate-200 dark:border-slate-800 shadow-2xl group">
                <div className="flex justify-between items-center mb-4 px-2">
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Featured Case Study</span>
                   <button onClick={scrollToPortfolio} className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">View All &rarr;</button>
                </div>

                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-6 bg-slate-100 dark:bg-slate-800">
                  {activeProject?.imageUrl ? (
                    <img 
                      src={activeProject.imageUrl} 
                      alt={activeProject.title || "Featured Case Study"} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      referrerPolicy="no-referrer"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-[10px] font-black text-blue-400 uppercase mb-2 block">{activeProject?.category}</span>
                    <h3 className="text-xl font-black text-white leading-tight">{activeProject?.title}</h3>
                  </div>
                  <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={prevProject} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40"><ChevronLeft size={18} /></button>
                    <button onClick={nextProject} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40"><ChevronRight size={18} /></button>
                  </div>
                </div>

                <div className="flex gap-1.5 mb-6 px-2">
                  {[0,1,2,3].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i === activeProjectIndex ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'}`} />
                  ))}
                </div>

                <button 
                  onClick={scrollToPortfolio}
                  className="w-full py-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
                >
                  Project Technical Details
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div 
          className={`grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-12 border-t border-slate-200 dark:border-slate-800 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: '1300ms' }}
        >
          {[
            { val: '150+', label: 'Deliveries' },
            { val: '50+', label: 'Engineers' },
            { val: '98%', label: 'Satisfaction' },
            { val: '24/7', label: 'Support' }
          ].map((s, i) => (
            <div key={i} className="text-center md:text-left">
              <p className="text-3xl font-black text-slate-900 dark:text-white mb-1">{s.val}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
