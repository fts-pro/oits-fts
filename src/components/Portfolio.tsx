import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ExternalLink, 
  Tag, 
  Clock, 
  CheckCircle, 
  RotateCcw, 
  Filter, 
  Eye, 
  X, 
  Sparkles, 
  Play, 
  BookOpen, 
  ChevronRight,
  Info,
  Calendar,
  Grid
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { PROJECTS } from '../constants';
import { SectionId, Project } from '../types';

// Unsplash Image Optimization Helper
const getOptimizedImage = (imageUrl: string): string => {
  if (imageUrl.startsWith('http') || imageUrl.includes('unsplash.com')) {
    if (imageUrl.includes('unsplash.com')) {
      const base = imageUrl.split('?')[0];
      return `${base}?auto=format&fit=crop&fm=webp&q=80&w=800`;
    }
  }
  return imageUrl;
};

// Detailed Swiss-Modern Modal Component
const ProjectModal: React.FC<{ project: Project; onClose: () => void }> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { 
      if (e.key === 'Escape') onClose(); 
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => { 
      document.body.style.overflow = 'unset'; 
      window.removeEventListener('keydown', handleKeyDown); 
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative bg-white dark:bg-slate-950/90 backdrop-blur-md w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800/80 no-scrollbar outline-none"
        tabIndex={-1}
      >
        <button 
          onClick={onClose} 
          aria-label="Close project details" 
          className="absolute top-6 right-6 z-20 p-3 bg-white/90 dark:bg-slate-850/90 backdrop-blur-md text-slate-500 hover:text-red-500 rounded-full transition-all hover:rotate-90 hover:scale-110 border border-slate-200/50 dark:border-slate-700/50 shadow-md"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
          {/* Media Section */}
          <div className="lg:col-span-5 h-[300px] lg:h-auto min-h-[300px] relative bg-slate-950 flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800">
            {project.demoVideoUrl ? (
              <video 
                controls 
                className="w-full h-full object-contain" 
                poster={getOptimizedImage(project.imageUrl)}
                aria-label={`Demo video for ${project.title}`}
              >
                <source src={project.demoVideoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <>
                <img 
                  src={getOptimizedImage(project.imageUrl)} 
                  alt={`${project.title} showcase`} 
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
              </>
            )}
          </div>

          {/* Info Section */}
          <div className="lg:col-span-7 p-8 md:p-12 lg:p-14 flex flex-col justify-between">
            <div>
              {/* Header Info */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="font-mono text-xs uppercase tracking-widest bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/30">
                  {project.category}
                </span>
                {project.status && (
                  <span className="font-mono text-[10px] uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-1.5">
                    <CheckCircle size={10} /> {project.status}
                  </span>
                )}
                {project.duration && (
                  <span className="font-mono text-[10px] uppercase tracking-widest bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-1.5">
                    <Clock size={10} /> {project.duration}
                  </span>
                )}
              </div>

              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950 dark:text-white mb-6 tracking-tighter leading-tight">
                {project.title}
              </h2>

              <p className="text-slate-700 dark:text-slate-300 text-base md:text-lg mb-8 leading-relaxed font-medium">
                {project.fullDescription || project.description}
              </p>

              {/* Case Study Meta Sections */}
              <div className="space-y-6 mb-8 border-t border-slate-100 dark:border-slate-800/60 pt-6">
                {project.problemStatement && (
                  <div>
                    <h5 className="font-mono text-xs uppercase tracking-widest text-slate-400 mb-2 font-black">
                      Challenge Statement
                    </h5>
                    <p className="text-slate-650 dark:text-slate-400 text-sm leading-relaxed">
                      {project.problemStatement}
                    </p>
                  </div>
                )}
                {project.technicalApproach && (
                  <div>
                    <h5 className="font-mono text-xs uppercase tracking-widest text-slate-400 mb-2 font-black">
                      Technical Architecture
                    </h5>
                    <p className="text-slate-655 dark:text-slate-400 text-sm leading-relaxed">
                      {project.technicalApproach}
                    </p>
                  </div>
                )}
                {project.results && (
                  <div>
                    <h5 className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-2 font-black">
                      Business Outcomes & Impact
                    </h5>
                    <p className="text-slate-655 dark:text-slate-400 text-sm leading-relaxed">
                      {project.results}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Technologies Used Footer */}
            <div className="border-t border-slate-100 dark:border-slate-800/60 pt-6">
              <h5 className="font-mono text-xs uppercase tracking-widest text-slate-400 mb-4 font-black">
                Engineered Features / Stack
              </h5>
              <div className="flex flex-wrap gap-2">
                {project.technologies?.map((tech, i) => (
                  <span 
                    key={i} 
                    className="font-mono text-xs bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-700/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const Portfolio: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Parse Unique Categories & Technologies
  const allCategories = useMemo(() => {
    return Array.from(new Set(PROJECTS.map(p => p.category))).sort();
  }, []);

  const allTechnologies = useMemo(() => {
    const list = new Set<string>();
    PROJECTS.forEach(p => p.technologies?.forEach(t => list.add(t)));
    return Array.from(list).sort();
  }, []);

  // Set up Intersection Observer for Section Animation
  useEffect(() => {
    setMounted(true);
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

  // Concurrent Filter Core Logic
  const filteredProjects = useMemo(() => {
    return PROJECTS.filter(project => {
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(project.category);
      const matchesTech = selectedTechnologies.length === 0 || selectedTechnologies.some(t => project.technologies?.includes(t));
      return matchesCategory && matchesTech;
    });
  }, [selectedCategories, selectedTechnologies]);

  // Recalculate Category Counts (Dynamic Badge Counters)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allCategories.forEach(cat => {
      counts[cat] = PROJECTS.filter(p => {
        const matchesTech = selectedTechnologies.length === 0 || selectedTechnologies.some(t => p.technologies?.includes(t));
        return p.category === cat && matchesTech;
      }).length;
    });
    return counts;
  }, [allCategories, selectedTechnologies]);

  // Recalculate Technology Counts (Dynamic Badge Counters)
  const technologyCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allTechnologies.forEach(tech => {
      counts[tech] = PROJECTS.filter(p => {
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
        return matchesCategory && p.technologies?.includes(tech);
      }).length;
    });
    return counts;
  }, [allTechnologies, selectedCategories]);

  // Ecosystem Data Visualization (Recharts Data Calculation based on active portfolio items)
  const ecosystemChartData = useMemo(() => {
    const frequency: Record<string, number> = {};
    
    // Calculate tech frequency amongst current filtered projects to show visual density map of the filtered subset
    filteredProjects.forEach(p => {
      p.technologies?.forEach(tech => {
        frequency[tech] = (frequency[tech] || 0) + 1;
      });
    });

    return Object.entries(frequency)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredProjects]);

  // Interactive Filter Handlers
  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleTechnology = (tech: string) => {
    setSelectedTechnologies(prev => 
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const resetAllFilters = () => {
    setSelectedCategories([]);
    setSelectedTechnologies([]);
  };

  // Recharts Custom Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950 text-white dark:bg-white dark:text-slate-950 px-4 py-3 rounded-2xl border border-slate-800 dark:border-slate-200 shadow-xl font-mono text-xs">
          <p className="font-black text-blue-400 dark:text-blue-600 tracking-tight">{payload[0].payload.name}</p>
          <div className="w-full h-[1px] bg-slate-800 dark:bg-slate-200 my-1.5" />
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
            Active Deployments: <span className="font-extrabold text-white dark:text-slate-950 font-mono text-xs">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <section 
      ref={sectionRef} 
      id={SectionId.PORTFOLIO} 
      className="py-32 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Dynamic Swiss Editorial Section Header */}
        <div className={`mb-16 transition-all duration-1000 transform-gpu ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-mono font-black uppercase tracking-[0.2em] mb-4 shadow-sm ring-1 ring-blue-500/10 rounded-full">
            <Sparkles size={11} className="text-blue-500" /> System Portfolios
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter leading-tight">
            Case Studies.
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg sm:text-xl font-medium leading-relaxed max-w-3xl">
            A selection of architectural blueprints and industrial software implementations designed with complete scale reliability.
          </p>
        </div>

        {/* ECOSYSTEM DENSITY VISUALIZER (Recharts Ecosystem Bar Chart Chart) */}
        <div className={`mb-16 bg-white dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/80 rounded-[2.5rem] p-6 md:p-8 shadow-sm dark:glass-card-glow transition-all duration-1000 transform-gpu ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`} style={{ transitionDelay: '100ms' }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-400 text-[10px] font-mono font-black uppercase tracking-widest mb-2 border border-slate-200/50 dark:border-slate-700/50">
                <Info size={11} className="text-blue-500" /> Interactive Metric
              </div>
              <h4 className="text-xl md:text-2xl font-black text-slate-950 dark:text-white tracking-tight">Ecosystem Density.</h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-semibold mt-1">
                Visualizing deployment weight by technical vectors. Click on any bar below to automatically scope that tool.
              </p>
            </div>
            
            {ecosystemChartData.length > 0 && (
              <div className="font-mono text-[10px] text-slate-400 dark:text-slate-500 border border-slate-200/60 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-1 rounded-lg">
                Density: <span className="font-black text-blue-500">{ecosystemChartData.length} active technologies</span>
              </div>
            )}
          </div>

          <div className="w-full h-64 md:h-72">
            {ecosystemChartData.length === 0 ? (
              <div className="w-full h-full flex flex-col justify-center items-center font-mono text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-850 rounded-2xl p-8 bg-slate-50/50 dark:bg-slate-950/20">
                <Grid size={24} className="text-slate-300 dark:text-slate-800 mb-2 animate-pulse" />
                <span>Zero matching density data. Adjust filter metrics.</span>
              </div>
            ) : (
              <div className="w-full h-full min-w-0 min-h-0">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <BarChart 
                      data={ecosystemChartData} 
                      margin={{ top: 10, right: 10, left: -25, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.15} vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        fontSize={10} 
                        fontFamily="JetBrains Mono, Fira Code, monospace" 
                        tickLine={false} 
                        axisLine={false}
                        stroke="#64748b"
                      />
                      <YAxis 
                        fontSize={10} 
                        fontFamily="JetBrains Mono, Fira Code, monospace" 
                        tickLine={false} 
                        axisLine={false}
                        stroke="#64748b" 
                        allowDecimals={false}
                      />
                      <Tooltip cursor={{ fill: 'rgba(59, 130, 246, 0.04)' }} content={<CustomTooltip />} />
                      <Bar 
                        dataKey="count" 
                        radius={[6, 6, 0, 0]}
                        onClick={(data) => {
                          if (data && data.name) {
                            toggleTechnology(data.name);
                          }
                        }}
                        className="cursor-pointer"
                      >
                        {ecosystemChartData.map((entry, index) => {
                          const isSelected = selectedTechnologies.includes(entry.name);
                          return (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={isSelected ? '#2563eb' : '#3b82f6'} 
                              opacity={isSelected ? 1 : 0.8}
                              className="hover:opacity-100 transition-opacity duration-300"
                            />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            )}
          </div>
        </div>

        {/* TWO-COLUMN EDITORIAL CONTROL GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* CONCURRENT FILTER PIPE PANEL */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            <div className="bg-white dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800/80 p-6 md:p-8 rounded-[2.5rem] shadow-sm">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-slate-800 dark:text-blue-400" />
                  <h4 className="text-base font-bold text-slate-950 dark:text-white font-mono uppercase tracking-wider">
                    Pipeline Scope
                  </h4>
                </div>
                {(selectedCategories.length > 0 || selectedTechnologies.length > 0) && (
                  <button 
                    onClick={resetAllFilters}
                    className="font-mono text-[10px] font-black text-red-500 hover:text-red-650 flex items-center gap-1 bg-red-50 dark:bg-red-950/20 px-2.5 py-1 rounded-full border border-red-100 dark:border-red-900/30 transition-all outline-none"
                    title="Reset all pipeline selectors"
                  >
                    <RotateCcw size={10} /> CLEAN
                  </button>
                )}
              </div>

              {/* Vertical High-Level Category Scope */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <h5 className="font-mono text-xs uppercase tracking-widest text-slate-400 font-extrabold">
                    Workload Tier
                  </h5>
                  <span className="font-mono text-[9px] text-slate-400 bg-slate-50 dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                    {selectedCategories.length === 0 ? 'All Tiers' : `${selectedCategories.length} Active`}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {allCategories.map(cat => {
                    const isSelected = selectedCategories.includes(cat);
                    const count = categoryCounts[cat] || 0;
                    const isDisabled = count === 0 && !isSelected;

                    return (
                      <button
                        key={cat}
                        onClick={() => !isDisabled && toggleCategory(cat)}
                        disabled={isDisabled}
                        className={`w-full text-left font-mono text-xs px-4 py-3 rounded-xl border transition-all duration-300 flex items-center justify-between group outline-none ${
                          isSelected 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10' 
                            : isDisabled
                              ? 'border-dashed border-slate-200 dark:border-slate-800/60 text-slate-350 dark:text-slate-700 opacity-40 cursor-not-allowed'
                              : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                        aria-label={`Toggle category filter: ${cat}`}
                      >
                        <span className="font-semibold truncate">{cat}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          isSelected 
                            ? 'bg-white/20 text-white' 
                            : 'bg-slate-100 dark:bg-slate-850 text-slate-500 dark:text-slate-400'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Technologies Toggle Chips Cloud */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h5 className="font-mono text-xs uppercase tracking-widest text-slate-400 font-extrabold">
                    Technical Stack
                  </h5>
                  <span className="font-mono text-[9px] text-slate-400 bg-slate-50 dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                    {selectedTechnologies.length === 0 ? 'All' : `${selectedTechnologies.length} Selected`}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allTechnologies.map(tech => {
                    const isSelected = selectedTechnologies.includes(tech);
                    const count = technologyCounts[tech] || 0;
                    const isDisabled = count === 0 && !isSelected;

                    return (
                      <button
                        key={tech}
                        onClick={() => !isDisabled && toggleTechnology(tech)}
                        disabled={isDisabled}
                        className={`font-mono text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 flex items-center gap-1.5 outline-none ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                            : isDisabled
                              ? 'border-dashed border-slate-200 dark:border-slate-850/60 text-slate-350 dark:text-slate-700 opacity-40 cursor-not-allowed'
                              : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                        aria-label={`Toggle technical stack filter: ${tech}`}
                      >
                        <span>{tech}</span>
                        <span className={`text-[9px] font-black ${
                          isSelected ? 'text-white/80' : 'text-slate-400'
                        }`}>
                          ({count})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </aside>

          {/* DYNAMIC PORTFOLIO LIST GRID */}
          <main className="lg:col-span-8 min-h-[500px]">
            <AnimatePresence mode="popLayout">
              {filteredProjects.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  key="empty-state"
                  className="w-full h-[400px] flex flex-col justify-center items-center text-center p-8 bg-white dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800 border-dashed rounded-[2.5rem]"
                >
                  <Grid size={44} className="text-slate-300 dark:text-slate-800 mb-4 animate-[spin_6s_linear_infinite]" />
                  <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">No Matching Configurations Found.</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-semibold max-w-sm mb-6 leading-relaxed">
                    The active combination yields zero current deployments. Clear some parameters to restart the compilation pipeline.
                  </p>
                  <button
                    onClick={resetAllFilters}
                    className="px-6 py-3 bg-slate-900 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-mono text-xs uppercase tracking-widest rounded-xl transition-all shadow-md outline-none"
                    aria-label="Clear all filter chips to show all products"
                  >
                    RESET SYSTEM PIPELINES
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  key="portfolio-grid"
                >
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.2), ease: [0.16, 1, 0.3, 1] }}
                      key={project.id}
                      className="group bg-white dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/80 rounded-[2.2rem] overflow-hidden hover:border-slate-300 dark:hover:border-slate-700/80 dark:glass-card-glow hover:-translate-y-1 hover:scale-[1.01] transition-all duration-500 flex flex-col h-full transform-gpu will-change-transform relative"
                    >
                      {/* Interactive Visual Thumbnail */}
                      <div className="aspect-[16/10] overflow-hidden bg-slate-950 relative border-b border-slate-100 dark:border-slate-800/65">
                        <img 
                          src={getOptimizedImage(project.imageUrl)} 
                          alt={project.title} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 text-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6 select-none" />
                        
                        {/* Dynamic category badge */}
                        <span className="absolute top-4 left-4 font-mono text-[9px] uppercase tracking-widest bg-slate-950/80 backdrop-blur-md text-white px-2.5 py-1 rounded-md border border-white/10">
                          {project.category}
                        </span>
                      </div>

                      {/* Decoupled Info Meta Block */}
                      <div className="p-8 flex flex-col justify-between flex-1">
                        <div>
                          <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 tracking-tight">
                            {project.title}
                          </h4>
                          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold leading-relaxed mb-6">
                            {project.description}
                          </p>
                        </div>

                        {/* Interactive Footer & Selection Badges */}
                        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                          <div className="flex flex-wrap gap-1.5">
                            {project.technologies?.slice(0, 3).map((tech, i) => {
                              const isTechSelected = selectedTechnologies.includes(tech);
                              return (
                                <button
                                  key={i}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleTechnology(tech);
                                  }}
                                  className={`font-mono text-[10px] px-2 py-0.5 rounded-md transition-all border outline-none ${
                                    isTechSelected
                                      ? 'bg-blue-600/10 dark:bg-blue-900/20 border-blue-500/40 text-blue-600 dark:text-blue-400 font-bold'
                                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 hover:border-slate-300 text-slate-500 dark:text-slate-400 hover:text-slate-705 dark:hover:text-slate-305'
                                  }`}
                                  aria-label={`Filter by active tag: ${tech}`}
                                >
                                  #{tech}
                                </button>
                              );
                            })}
                            {project.technologies && project.technologies.length > 3 && (
                              <span className="font-mono text-[9px] text-slate-400 px-1.5 py-0.5">
                                +{project.technologies.length - 3} more
                              </span>
                            )}
                          </div>

                          <div className="flex justify-between items-center pt-2">
                            <button
                              onClick={() => setSelectedProject(project)}
                              className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-blue-600 dark:text-blue-400 hover:text-blue-750 dark:hover:text-blue-300 transition-colors outline-none font-mono"
                              aria-label={`View detailed technical blueprint case study for ${project.title}`}
                            >
                              <span>EXPLORE BLUEPRINT</span>
                              <ChevronRight size={14} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            
                            {project.status && (
                              <span className="font-mono text-[9px] text-slate-450 uppercase tracking-widest flex items-center gap-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${project.status === 'Completed' ? 'bg-emerald-500' : project.status === 'In Progress' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                                {project.status}
                              </span>
                            )}
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </main>

        </div>

      </div>

      {/* DETAILED DIALOG MODAL VIEW */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
};
