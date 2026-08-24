import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, FileText, Hash, Layers } from 'lucide-react';
import { Product, CaseStudy, Channel } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  caseStudies: CaseStudy[];
  channels: Channel[];
  onSelectProduct: (p: Product) => void;
  onSelectChannel: (c: Channel) => void;
  onSelectCaseStudy: (cs: CaseStudy) => void;
}

export default function GlobalSearchModal({
  isOpen,
  onClose,
  products,
  caseStudies,
  channels,
  onSelectProduct,
  onSelectChannel,
  onSelectCaseStudy,
}: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const filteredProducts = query.trim()
    ? products.filter(p => p.title.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase()))
    : [];
  
  const filteredCaseStudies = query.trim()
    ? caseStudies.filter(cs => cs.title.toLowerCase().includes(query.toLowerCase()) || cs.client.toLowerCase().includes(query.toLowerCase()))
    : [];

  const filteredChannels = query.trim()
    ? channels.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  // Flatten items for keyboard navigation
  const allItems = [
    ...filteredProducts.map(p => ({ type: 'product', data: p })),
    ...filteredChannels.map(c => ({ type: 'channel', data: c })),
    ...filteredCaseStudies.map(cs => ({ type: 'casestudy', data: cs })),
  ];

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < allItems.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Enter' && allItems.length > 0) {
        e.preventDefault();
        const selected = allItems[selectedIndex];
        if (selected) {
          if (selected.type === 'product') onSelectProduct(selected.data as Product);
          else if (selected.type === 'channel') onSelectChannel(selected.data as Channel);
          else if (selected.type === 'casestudy') onSelectCaseStudy(selected.data as CaseStudy);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, allItems, selectedIndex, onClose, onSelectProduct, onSelectChannel, onSelectCaseStudy]);

  if (!isOpen) return null;

  let globalIndex = 0;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[10vh] px-4 bg-slate-900/60 backdrop-blur-sm">
      <div 
        className="absolute inset-0"
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col"
      >
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <Search className="w-6 h-6 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, channels, case studies..."
            className="w-full bg-transparent border-none outline-none text-xl text-slate-800 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 font-sans"
          />
          <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[60vh] p-4 bg-slate-50/50 dark:bg-slate-950/50">
          {!query.trim() ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
              <p className="text-slate-400 dark:text-slate-500 font-sans font-medium">Start typing to search across the workspace</p>
            </div>
          ) : allItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 dark:text-slate-500 font-sans font-medium">No matches found for "{query}"</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredProducts.length > 0 && (
                <div>
                  <h3 className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4" /> Products ({filteredProducts.length})
                  </h3>
                  <div className="space-y-1">
                    {filteredProducts.map(p => {
                      const isActive = globalIndex === selectedIndex;
                      const currentIndex = globalIndex++;
                      return (
                        <div
                          key={p.id}
                          onClick={() => onSelectProduct(p)}
                          onMouseEnter={() => setSelectedIndex(currentIndex)}
                          className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors ${
                            isActive ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200'
                          } border shadow-sm`}
                        >
                          <div>
                            <span className="block font-bold text-slate-800 dark:text-slate-200">{p.title}</span>
                            <span className="text-xs text-slate-500 block mt-0.5">{p.category}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {filteredChannels.length > 0 && (
                <div>
                  <h3 className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Hash className="w-4 h-4" /> Channels ({filteredChannels.length})
                  </h3>
                  <div className="space-y-1">
                    {filteredChannels.map(c => {
                      const isActive = globalIndex === selectedIndex;
                      const currentIndex = globalIndex++;
                      return (
                        <div
                          key={c.id}
                          onClick={() => onSelectChannel(c)}
                          onMouseEnter={() => setSelectedIndex(currentIndex)}
                          className={`flex items-center p-4 rounded-xl cursor-pointer transition-colors ${
                            isActive ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200'
                          } border shadow-sm`}
                        >
                          <span className="font-extrabold text-emerald-700 dark:text-emerald-500">#{c.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {filteredCaseStudies.length > 0 && (
                <div>
                  <h3 className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Case Studies ({filteredCaseStudies.length})
                  </h3>
                  <div className="space-y-1">
                    {filteredCaseStudies.map(cs => {
                      const isActive = globalIndex === selectedIndex;
                      const currentIndex = globalIndex++;
                      return (
                        <div
                          key={cs.id}
                          onClick={() => onSelectCaseStudy(cs)}
                          onMouseEnter={() => setSelectedIndex(currentIndex)}
                          className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors ${
                            isActive ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200'
                          } border shadow-sm`}
                        >
                          <div>
                            <span className="block font-bold text-slate-800 dark:text-slate-200">{cs.title}</span>
                            <span className="text-xs text-slate-500 block mt-0.5">{cs.client}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
