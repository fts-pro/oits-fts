import React from 'react';
import { TECH_STACK } from '../constants';

export const Marquee: React.FC = () => {
  return (
    <div className="py-12 bg-slate-50 dark:bg-black border-y border-slate-200 dark:border-blue-950 overflow-hidden relative transition-colors duration-300">
      {/* Top Glowing Junction Ribbon */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent blur-[1px] hidden dark:block" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/55 to-transparent hidden dark:block" />

      {/* Bottom Glowing Junction Ribbon */}
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent blur-[1px] hidden dark:block" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/55 to-transparent hidden dark:block" />

      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-12 px-6">
          {TECH_STACK.map((tech) => (
            <span 
              key={tech} 
              className="text-2xl md:text-3xl font-black uppercase tracking-widest text-blue-600/90 dark:text-blue-400/90 hover:text-blue-500 dark:hover:text-blue-300 transition-colors cursor-default filter drop-shadow-sm"
            >
              {tech}
            </span>
          ))}
          {/* Duplicate for seamless loop */}
          {TECH_STACK.map((tech) => (
            <span 
              key={`${tech}-dup`} 
              className="text-2xl md:text-3xl font-black uppercase tracking-widest text-blue-600/90 dark:text-blue-400/90 hover:text-blue-500 dark:hover:text-blue-300 transition-colors cursor-default filter drop-shadow-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};