import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Layers } from 'lucide-react';
import { TECH_DOMAINS } from '../constants';

const SKILL_ICONS: Record<string, string> = {
  'React': 'react',
  'Next.js': 'nextdotjs',
  'Vue.js': 'vuedotjs',
  'TypeScript': 'typescript',
  'Tailwind CSS': 'tailwindcss',
  'Three.js': 'threedotjs',
  'Node.js': 'nodedotjs',
  'Python': 'python',
  'Rust': 'rust',
  'NestJS': 'nestjs',
  'PostgreSQL': 'postgresql',
  'GraphQL': 'graphql',
  'AWS': 'amazonaws',
  'Google Cloud (GCP)': 'googlecloud',
  'Docker': 'docker',
  'Kubernetes': 'kubernetes',
  'Terraform': 'terraform',
  'CI/CD': 'githubactions',
  'AI & Machine Learning': 'openai',
  'Internet of Things (IoT)': 'arduino',
  'AR & VR Solutions': 'oculus',
  'Blockchain, Web-3 & DApp': 'ethereum',
  'Intelligent Features Augmentation': 'tensorflow',
  'Cross-Platform Solutions': 'flutter',
  'Progressive Web Apps (PWA)': 'pwa'
};

export const FeaturedCarousel: React.FC = () => {
  const [activeFilterId, setActiveFilterId] = useState(TECH_DOMAINS[0].id);

  const activeDomain = TECH_DOMAINS.find(d => d.id === activeFilterId) || TECH_DOMAINS[0];

  return (
    <div className="w-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/60 dark:border-slate-800/60 rounded-3xl shadow-xl overflow-hidden flex flex-col p-4">
      {/* Header Area */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/90 dark:bg-blue-900/60 backdrop-blur-md text-blue-800 dark:text-blue-200 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border border-blue-200 dark:border-blue-700">
          <Layers size={14} className="animate-pulse shrink-0" aria-hidden="true" />
          <h2 className="m-0 truncate">EXPERT TECH STACKS</h2>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mb-4 pb-1">
        {TECH_DOMAINS.map((domain) => (
          <button
            key={domain.id}
            onClick={() => setActiveFilterId(domain.id)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
              activeFilterId === domain.id
                ? 'bg-slate-900 text-white dark:bg-blue-600'
                : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {domain.label}
          </button>
        ))}
      </div>

      {/* Technology Stack Grid Replacing Image Carousel */}
      <div className="relative w-full min-h-[220px] rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-950/30 p-4 flex items-center justify-center border border-slate-200/50 dark:border-slate-800/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-2.5 relative z-10">
          <AnimatePresence mode="popLayout">
            {activeDomain.skills.slice(0, 6).map((skill, index) => (
              <motion.div
                key={`${activeDomain.id}-${skill}`}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-sm outline-none transition-all duration-300 group/card cursor-pointer focus-visible:ring-4 focus-visible:ring-blue-500/30 hover:-translate-y-0.5 hover:scale-105 hover:bg-blue-600 dark:hover:bg-blue-600 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/30 w-full"
                tabIndex={0}
                role="button"
                aria-label={`Select skill ${skill}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                  }
                }}
              >
                <img 
                  src={`https://cdn.simpleicons.org/${SKILL_ICONS[skill] || 'code'}`} 
                  alt={skill} 
                  className="w-5 h-5 opacity-60 grayscale dark:invert group-hover/card:brightness-0 group-hover/card:invert group-hover/card:opacity-100 transition-all duration-300 transform group-hover/card:scale-110 shrink-0" 
                />
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 group-hover/card:text-white transition-colors duration-300 line-clamp-1">
                  {skill}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Action */}
      <button className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 transition-all active:scale-95">
        Learn More <ArrowUpRight size={14} />
      </button>
    </div>
  );
};
