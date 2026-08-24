import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Home, ChevronDown, Mail, Briefcase, Zap, UserCircle, GalleryHorizontalEnd, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { COMPANY_NAME, NAV_ITEMS } from '../constants';

const IconMap: Record<string, any> = {
  Home,
  Briefcase,
  GalleryHorizontalEnd,
  Zap,
  Users,
  Mail
};

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const BrandLogo = () => (
    <div className="h-full flex items-center gap-2">
      <div className="h-full flex items-center justify-center shrink-0 overflow-hidden" aria-hidden="true">
        {/* We use an image if available, fallback to refined SVG logo matching OITS identity */}
        <img 
          src="/oits_logo_hq.png" 
          alt={COMPANY_NAME} 
          className="h-full w-auto max-h-full object-contain" 
          onError={(e) => {
            const target = e.target as any;
            if (target.src.includes('oits_logo_hq')) {
              target.src = '/oits_logo.png';
            } else {
              target.style.display = 'none';
              target.nextSibling.style.display = 'block';
            }
          }}
        />
        <svg viewBox="0 0 100 100" className="h-full w-auto drop-shadow-sm hidden">
          <defs>
            <linearGradient id="header-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="45" fill="url(#header-logo-gradient)" />
          <text x="50" y="65" textAnchor="middle" fill="white" fontSize="40" fontWeight="900" fontFamily="sans-serif">IT</text>
        </svg>
      </div>
    </div>
  );

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out h-16 sm:h-18 md:h-20 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-lg' 
          : 'bg-white dark:bg-slate-950 border-b border-slate-200/50 dark:border-slate-800/40'
      }`}
      role="banner"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 h-full flex items-center justify-between">
        <Link 
          to="/"
          className="h-full py-2 sm:py-2.5 flex items-center group min-w-0 shrink-0" 
          aria-label={`${COMPANY_NAME} homepage`}
        >
          <BrandLogo />
        </Link>
 
        {/* Adaptive Desktop/Tablet Nav: Laptop to Tab shows all labels and icons; Tab to Mobile shows only Services & Portfolio labels */}
        <nav className="hidden sm:flex items-center gap-1 sm:gap-1.5 md:gap-2 lg:gap-2.5 xl:gap-3" aria-label="Main site navigation">
          {NAV_ITEMS.map((item) => (
            <div 
              key={item.label} 
              className="relative group" 
              onMouseEnter={() => setActiveDropdown(item.label)} 
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link 
                to={item.href}
                className={`px-2.5 md:px-3 lg:px-3.5 py-2 rounded-full text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-sky-400 hover:bg-blue-50/80 dark:hover:bg-slate-900/40 transition-all duration-200 flex items-center gap-1.5 md:gap-2 ${location.pathname === item.href ? 'bg-blue-50 dark:bg-slate-900/40 text-blue-700 dark:text-sky-400' : ''}`}
                title={item.label}
              >
                {item.icon && IconMap[item.icon] ? (
                  <span className="text-blue-600 dark:text-sky-400 opacity-90 transition-transform group-hover:scale-110 shrink-0">
                    {React.createElement(IconMap[item.icon], { size: 18 })}
                  </span>
                ) : item.label === 'Home' ? (
                  <Home size={18} className="text-blue-600 dark:text-sky-400 opacity-90 transition-transform group-hover:scale-110 shrink-0" />
                ) : null}
                {/* Home never shows label in header navigation on any screen size */}
                {item.label !== 'Home' && (
                  <span className={item.label === 'Services' ? 'hidden sm:inline' : 'hidden md:inline'}>
                    {item.label}
                  </span>
                )}
                {item.children && <ChevronDown size={14} className="opacity-50 group-hover:rotate-180 transition-transform duration-200 hidden md:inline" />}
              </Link>
              
              {item.children && activeDropdown === item.label && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800/60 p-1.5 animate-in fade-in slide-in-from-top-2 z-50">
                  {item.children.map(child => (
                    <Link 
                      key={child.label} 
                      to={child.href} 
                      className="flex items-center gap-2.5 px-3.5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-900/60 hover:text-blue-700 dark:hover:text-sky-400 rounded-xl transition-all"
                    >
                      {(child as any).icon && IconMap[(child as any).icon] && (
                        <span className="text-blue-600/70 dark:text-sky-400/70 shrink-0">
                          {React.createElement(IconMap[(child as any).icon], { size: 16 })}
                        </span>
                      )}
                      <span>{child.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Action & Utility Group */}
          <div className="ml-1 sm:ml-1.5 pl-2 sm:pl-2.5 border-l border-slate-200 dark:border-slate-700 flex items-center gap-1 sm:gap-1.5 md:gap-2">
             {/* Workspace User Action */}
             <Link
               to="/workspace"
               className="p-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/40 transition-all hover:text-blue-600 dark:hover:text-sky-400 group relative shrink-0"
               aria-label="Access Account Workspace"
               title="Workspace"
             >
               <UserCircle size={20} strokeWidth={2.2} />
               <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-[9px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">WORKSPACE</span>
             </Link>

             {/* Theme Toggler: Hidden on mobile (< sm), visible on tab to laptop (sm+) */}
             <button
              onClick={toggleTheme}
              className="hidden sm:flex p-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/40 transition-all active:rotate-12 group relative shrink-0"
              aria-label={theme === 'dark' ? 'Switch to light visual mode' : 'Switch to dark visual mode'}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
             >
                {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
                <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-[9px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">{theme === 'dark' ? 'LIGHT' : 'DARK'}</span>
             </button>
             
             {/* Highlighted Contact Button: Icon only on all screen sizes */}
             <Link
               to="/contact"
               className={`p-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all flex items-center justify-center shadow-sm shadow-indigo-500/20 active:scale-95 shrink-0 ${location.pathname === '/contact' ? 'ring-2 ring-indigo-400 ring-offset-2 dark:ring-offset-slate-950' : ''}`}
               aria-label="Contact our engineering team"
               title="Contact Us"
             >
               <Mail size={18} className="shrink-0" />
             </Link>

             {/* Highlighted Portfolio Button: Icon + Label visible from tab (sm) and up */}
             <Link
               to="/portfolio"
               className={`px-3 md:px-3.5 lg:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-full transition-all flex items-center gap-1.5 md:gap-2 shadow-sm shadow-blue-500/20 active:scale-95 shrink-0 ${location.pathname === '/portfolio' ? 'ring-2 ring-blue-400 ring-offset-2 dark:ring-offset-slate-950' : ''}`}
               aria-label="Explore engineering portfolio"
               title="Portfolio"
             >
               <GalleryHorizontalEnd size={16} className="shrink-0" />
               <span className="hidden sm:inline">Portfolio</span>
             </Link>
          </div>
        </nav>

        {/* Mobile Header Controls (< sm screens): Theme toggle hidden, items show only icons, Hamburger button visible */}
        <div className="flex items-center gap-1 sm:hidden">
          <Link
            to="/contact"
            className="p-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm hover:opacity-90 transition-opacity"
            aria-label="Contact Us"
            title="Contact Us"
          >
            <Mail size={17} />
          </Link>

          <Link
            to="/portfolio"
            className="p-2 rounded-full bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-colors"
            aria-label="Portfolio"
            title="Portfolio"
          >
            <GalleryHorizontalEnd size={17} />
          </Link>
          
          <button 
            className="p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 ml-0.5"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer (Only on small screens < sm) */}
      {isMobileMenuOpen && (
        <div 
          id="mobile-navigation"
          className="absolute top-full left-0 right-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 sm:hidden p-5 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation overlay"
        >
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                <Link 
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-base font-bold text-slate-800 dark:text-slate-100 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all flex items-center gap-3 ${location.pathname === item.href ? 'bg-blue-50 dark:bg-slate-900 text-blue-600 dark:text-blue-400' : ''}`}
                >
                  {item.icon && IconMap[item.icon] ? (
                    React.createElement(IconMap[item.icon], { size: 19, className: "text-blue-600 dark:text-sky-400" })
                  ) : item.label === 'Home' ? (
                    <Home size={19} className="text-blue-600 dark:text-sky-400" />
                  ) : null}
                  {item.label}
                </Link>
                {item.children && (
                  <div className="pl-6 pt-1 flex flex-col gap-1 border-l-2 border-blue-100 dark:border-slate-800 ml-6">
                    {item.children.map(child => (
                      <Link 
                        key={child.label} 
                        to={child.href} 
                        onClick={() => setIsMobileMenuOpen(false)} 
                        className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2.5 hover:text-blue-600 transition-colors"
                      >
                        {(child as any).icon && IconMap[(child as any).icon] && (
                          <span className="text-blue-500/60">
                            {React.createElement(IconMap[(child as any).icon], { size: 16 })}
                          </span>
                        )}
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Workspace Link in Mobile Menu */}
            <Link 
              to="/workspace"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 py-2.5 rounded-xl text-base font-bold text-slate-800 dark:text-slate-100 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all flex items-center gap-3 ${location.pathname.startsWith('/workspace') ? 'bg-blue-50 dark:bg-slate-900 text-blue-600 dark:text-blue-400' : ''}`}
            >
              <UserCircle size={19} className="text-blue-600 dark:text-sky-400" />
              <span>Workspace Portal</span>
            </Link>
            
            {/* Highlighted Action Buttons for Mobile */}
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              <Link 
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2.5 transition-all shadow-md shadow-indigo-500/20 active:scale-98"
              >
                <Mail size={18} />
                <span>Contact Us</span>
              </Link>

              <Link 
                to="/portfolio"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2.5 transition-all shadow-md shadow-blue-500/20 active:scale-98"
              >
                <GalleryHorizontalEnd size={18} />
                <span>Portfolio Showcase</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
