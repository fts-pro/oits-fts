import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Globe,
  Smartphone,
  Users,
  Cloud as CloudIcon,
  Terminal,
  Check,
  ArrowUpRight,
  Star,
  X,
  Zap,
  Code,
  Shield,
  Cpu,
  Layers,
  HelpCircle,
  BookOpen,
} from "lucide-react";
import { SERVICES, TECH_DOMAINS } from "../constants";
import { SectionId, Service } from "../types";
import { Link } from "react-router-dom";
import { FeaturedCarousel } from "./FeaturedCarousel";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe: Globe,
  Smartphone: Smartphone,
  Users: Users,
  Cloud: CloudIcon,
  Terminal: Terminal,
};

const domainIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  frontend: Code,
  backend: Terminal,
  mobile: Smartphone,
  database: Cpu,
  cloud: CloudIcon,
  specialized: Layers,
};

const CATEGORIES = [
  "All",
  "ERP/MIS",
  "CLOUD SERVICES",
  "DEV-SUPPORT",
  "IR4/IR5",
] as const;

// 1. DYNAMIC SKELETON LOADING STATE Component
const ServiceSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 rounded-[2.5rem] p-8 sm:p-10 shadow-sm animate-pulse flex flex-col justify-between h-full relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/10 to-transparent -translate-x-full animate-shimmer" />
      <div>
        {/* Icon Bounding Shape (~w-16 h-16) */}
        <div className="w-16 h-16 bg-slate-200 dark:bg-slate-900/50 rounded-2xl mb-8" />

        {/* Layout Heading Lines (w-3/4 h-7) */}
        <div className="h-7 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg mb-6" />

        {/* Detail Paragraphs (3 lines with varying percentage widths) */}
        <div className="space-y-3 mb-8">
          <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-4 w-[90%] bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-4 w-[75%] bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
      </div>

      {/* Tag indicators with bullet metrics */}
      <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-100 dark:border-slate-800">
        <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
        <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
      </div>
    </div>
  );
};

// Tooltip component for accessibility
const AccessibleTooltip: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-slate-950/90 text-white text-xs rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-30 border border-slate-800/60 backdrop-blur-md">
      <p className="font-medium text-left leading-relaxed">{text}</p>
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-950/90" />
    </div>
  );
};

export const Services: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] =
    useState<(typeof CATEGORIES)[number]>("All");
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  // Trigger 550ms skeleton delay wrapper
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 550);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Filter logic
  const filteredServices = SERVICES.filter((service) => {
    if (activeCategory === "All") return true;
    return service.category === activeCategory;
  });

  // Dynamic focus icon helper inside modal details
  const getTechFocusIcon = (title: string) => {
    const lowercase = title.toLowerCase();
    if (
      lowercase.includes("workflow") ||
      lowercase.includes("automation") ||
      lowercase.includes("engine")
    ) {
      return <Zap className="w-5 h-5 text-blue-500 shrink-0" />;
    }
    if (
      lowercase.includes("react") ||
      lowercase.includes("next.js") ||
      lowercase.includes("optimization") ||
      lowercase.includes("code") ||
      lowercase.includes("legacy") ||
      lowercase.includes("migration")
    ) {
      return <Code className="w-5 h-5 text-blue-500 shrink-0" />;
    }
    if (
      lowercase.includes("saas") ||
      lowercase.includes("cloud") ||
      lowercase.includes("infrastructure")
    ) {
      return <CloudIcon className="w-5 h-5 text-blue-500 shrink-0" />;
    }
    if (
      lowercase.includes("risk") ||
      lowercase.includes("mitigation") ||
      lowercase.includes("blockchain") ||
      lowercase.includes("security") ||
      lowercase.includes("trust")
    ) {
      return <Shield className="w-5 h-5 text-blue-500 shrink-0" />;
    }
    if (
      lowercase.includes("sensor") ||
      lowercase.includes("device") ||
      lowercase.includes("predictive") ||
      lowercase.includes("ai/ml") ||
      lowercase.includes("api")
    ) {
      return <Cpu className="w-5 h-5 text-blue-500 shrink-0" />;
    }
    return <Cpu className="w-5 h-5 text-blue-500 shrink-0" />;
  };

  return (
    <section
      ref={sectionRef}
      id={SectionId.SERVICES}
      className="py-32 bg-slate-50 dark:bg-slate-950 relative transition-colors duration-300 overflow-hidden"
      aria-label="Our Digital Architecture Services"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Dynamic Swiss Editorial Header & Featured Carousel */}
        <div
          className={`flex flex-col md:flex-row justify-between items-start mb-20 gap-10 xl:gap-16 transition-all duration-1000 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
        >
          <div className="w-full md:w-[55%] relative">
            <h2 className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">
              Our Expertise
            </h2>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tighter mb-6">
              Digital Mastery Engineered for Performance
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed font-medium">
              We leverage modular micro-architectures and continuous feedback
              telemetry loops to build stable, industrial-grade applications
              that drive performance.
            </p>
          </div>

          <div className="w-full md:w-[45%] shrink-0">
            <FeaturedCarousel />
          </div>
        </div>

        {/* Dynamic Category Filtering Overlays */}
        <div className="mb-12">
          <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 flex items-center gap-1.5">
            <Layers size={12} /> Focus Areas
          </div>

          <div className="relative">
            {/* Mobile Dropdown Trigger */}
            <button
              className="min-[700px]:hidden flex w-full items-center justify-between px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-white"
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              aria-expanded={isCategoryMenuOpen}
            >
              {activeCategory}
              <span className="text-xl">{isCategoryMenuOpen ? "▲" : "▼"}</span>
            </button>

            {/* Filter List - Responsive */}
            <div
              className={`${isCategoryMenuOpen ? "flex flex-col absolute z-20 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-2" : "hidden"} min-[700px]:flex min-[700px]:flex-row min-[700px]:gap-2.5 min-[700px]:items-center min-[700px]:overflow-x-auto min-[700px]:pb-2 min-[700px]:relative min-[700px]:p-0 min-[700px]:border-none min-[700px]:bg-transparent`}
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setIsCategoryMenuOpen(false);
                  }}
                  className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-300 border focus-visible:ring-4 focus-visible:ring-blue-500/20 active:scale-95 whitespace-nowrap ${
                    activeCategory === cat
                      ? "bg-slate-950 border-slate-950 text-white dark:bg-blue-600 dark:border-blue-600 dark:shadow-neon-blue"
                      : "bg-white dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                  role="button"
                  aria-pressed={activeCategory === cat}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Service Card Grid / Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[500px]">
          <AnimatePresence mode="popLayout">
            {isLoading
              ? Array.from({ length: 4 }).map((_, idx) => (
                  <motion.div
                    key={`skeleton-${idx}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ServiceSkeleton />
                  </motion.div>
                ))
              : filteredServices.map((service, index) => {
                  const SvgIcon = iconMap[service.icon] || Globe;
                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      layout
                      className="group relative bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 rounded-[2.5rem] p-6 sm:p-8 hover:border-slate-700/60 dark:glass-card-glow transition-all duration-500 flex flex-col justify-between h-full hover:-translate-y-2 transform-gpu will-change-transform"
                      tabIndex={0}
                      role="button"
                      aria-expanded={selectedService?.id === service.id}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedService(service);
                        }
                      }}
                      onClick={() => setSelectedService(service)}
                    >
                      {/* Floating Tooltip accessible in layout */}
                      <AccessibleTooltip
                        text={`${service.description} Click to explore deep technical specifications.`}
                      />

                      <div className="flex flex-col grow">
                        {/* Title Row with Icon */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 shrink-0 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/85 rounded-xl flex items-center justify-center text-slate-800 dark:text-sky-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 transform-gpu">
                            <SvgIcon className="w-5 h-5 transform group-hover:rotate-6 transition-transform duration-500" />
                          </div>
                          <div>
                            <div className="text-[8px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-0.5">
                              <span>{service.category}</span>
                            </div>
                            <h4 className="text-sm font-black text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                              {service.title}
                            </h4>
                          </div>
                        </div>

                        {/* Custom paragraph limiting */}
                        <p className="hidden sm:block text-slate-500 dark:text-slate-400 text-[10px] leading-relaxed font-medium mb-3 line-clamp-2 border-b border-transparent pb-1">
                          {service.description}
                        </p>

                        <div className="grow" />

                        {/* Highlight limits - Direct Benefits Highlight lists */}
                        <ul className="space-y-1.5 mb-4 border-t border-slate-100 dark:border-slate-800/60 pt-3 mt-auto">
                          {service.features.slice(0, 2).map((feat, idx) => (
                            <li
                              key={idx}
                              className="flex items-center gap-2 text-[10px] font-bold text-slate-700 dark:text-slate-300"
                            >
                              <span className="w-4 h-4 shrink-0 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <Check size={10} strokeWidth={3} />
                              </span>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CTA Operation */}
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white pt-3 border-t border-slate-100 dark:border-slate-800/40 mt-auto">
                        <span>KNOW MORE</span>
                        <div className="w-6 h-6 rounded-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-900 dark:text-white group-hover:bg-blue-600 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
                          <ArrowUpRight size={12} strokeWidth={2.5} />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Deep Detail Fullscreen Overlay/Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-service-title"
          >
            {/* Dark blur backdrop */}
            <div
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setSelectedService(null)}
              aria-hidden="true"
            />

            {/* Modal Body Container with responsive safe scaling */}
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="relative bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 no-scrollbar flex flex-col z-20"
            >
              <button
                onClick={() => setSelectedService(null)}
                aria-label="Close detailed overlay"
                className="absolute top-6 right-6 p-3 bg-slate-100 hover:bg-red-500 dark:bg-slate-800 text-slate-500 hover:text-white dark:hover:text-white rounded-full transition-all hover:rotate-90 hover:scale-110 z-30"
              >
                <X size={20} />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
                {/* Left Focus Column */}
                <div className="lg:col-span-7 p-8 sm:p-12 md:p-16 border-r border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4 block">
                    {selectedService.category} Specification
                  </span>

                  <h3
                    id="modal-service-title"
                    className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter leading-[1.1]"
                  >
                    {selectedService.title}
                  </h3>

                  <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed font-semibold mb-10">
                    {selectedService.description}
                  </p>

                  {/* Tech focus blocks */}
                  <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">
                    Core Architectural Deliverables
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedService.detailedFeatures?.map((f, idx) => (
                      <div
                        key={idx}
                        className="flex gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850/60"
                      >
                        {getTechFocusIcon(f)}
                        <span className="text-xs font-black text-slate-850 dark:text-slate-200 leading-tight">
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Advantage and Case Studies Column */}
                <div className="lg:col-span-5 bg-slate-50/50 dark:bg-slate-950/20 p-8 sm:p-12 md:p-16 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-1.5 animate-pulse">
                      <Star size={13} className="text-blue-500 animate-spin" />{" "}
                      Strategic Value
                    </h4>

                    {/* Dynamic Advantages block with styled markers */}
                    <div className="space-y-4 mb-10">
                      {selectedService.advantages?.map((adv, idx) => (
                        <div key={idx} className="flex gap-3 leading-relaxed">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {adv}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Case Study testimonials */}
                    {selectedService.caseStudy && (
                      <div className="p-6 rounded-[2rem] bg-indigo-50/30 dark:bg-blue-950/20 border border-indigo-100/50 dark:border-blue-900/30 mb-8">
                        <span className="text-[9px] font-mono font-bold text-indigo-600 dark:text-blue-400 uppercase tracking-widest mb-3 block">
                          REALIZED METRIC: {selectedService.caseStudy.impact}
                        </span>
                        <blockquote className="text-xs italic font-semibold text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                          "{selectedService.caseStudy.quote}"
                        </blockquote>
                        <cite className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 not-italic block">
                          — {selectedService.caseStudy.client}
                        </cite>
                      </div>
                    )}
                  </div>

                  {/* Dual Callout Operatives */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                    <Link
                      to="/contact"
                      onClick={() => setSelectedService(null)}
                      className="w-full text-center px-6 py-3.5 bg-slate-900 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-500/10 focus-visible:ring-4 focus-visible:ring-blue-500/20"
                    >
                      START YOUR ROADMAP
                    </Link>
                    <a
                      href={selectedService.documentationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center px-6 py-3.5 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-705 border border-slate-200 dark:border-slate-720 text-slate-800 dark:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 focus-visible:ring-4 focus-visible:ring-blue-500/20"
                    >
                      <BookOpen size={14} /> DOCS
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
