import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate, Link } from 'react-router-dom';
import { Product, CaseStudy, CMSBlock, Channel, User } from './types';
import ShowcaseView from './components/ShowcaseView';
import ChatroomView from './components/ChatroomView';
import UserDashboardView from './components/UserDashboardView';
import CMSAdminView from './components/CMSAdminView';
import GlobalSearchModal from "./components/GlobalSearchModal";
import AuthModal from './components/AuthModal';
import OpsControlTower from './components/OpsControlTower';

// Public website assets
import { Header as PublicHeader } from './components/Header';
import { Footer as PublicFooter } from './components/Footer';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { Testimonials } from './components/Testimonials';
import { About } from './components/About';
import { Services } from './components/Services';
import { Portfolio } from './components/Portfolio';
import { ProcessTimeline } from './components/ProcessTimeline';
import { Contact } from './components/Contact';
import { AiAssistant } from './components/AiAssistant';

import { 
  Building2, MessageSquareLock, ShieldAlert, Cpu, Lock, 
  HelpCircle, UserCheck, Settings, LogOut, LayoutDashboard, KeyRound,
  Sun, Moon, Tv, Search, Keyboard, X, UserCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'overview' | 'showcase' | 'chat' | 'dashboard' | 'cms'>('overview');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Global Theme Pref State
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem('ai_innovations_theme') as 'light' | 'dark' | 'system') || 'system';
  });

  const handleUpdateTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    localStorage.setItem('ai_innovations_theme', newTheme);
  };

  // Global Search State
  const [globalSearch, setGlobalSearch] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Accessibility Modal State
  const [showAccessibilityModal, setShowAccessibilityModal] = useState(false);

  // Toast Notification System
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);

  const addToast = (message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  // Automated Inactivity Session Timeout States
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  // Server memory database mirrors
  const [products, setProducts] = useState<Product[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [cmsBlocks, setCmsBlocks] = useState<CMSBlock[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string>('chan-general');

  const [loading, setLoading] = useState(true);

  // Fetch initial corporate datasets on load
  const fetchData = async () => {
    try {
      setLoading(true);
      const [resProd, resCs, resCms, resChans] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/case-studies'),
        fetch('/api/cms-blocks'),
        fetch('/api/channels'),
      ]);

      const prodData = await resProd.json();
      const csData = await resCs.json();
      const cmsData = await resCms.json();
      const chansData = await resChans.json();

      setProducts(prodData);
      setCaseStudies(csData);
      setCmsBlocks(cmsData);
      setChannels(chansData);
    } catch (err) {
      console.error('Failed to parse database records from Express endpoints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Recover cached logged-in user from localStorage for continuous authentication
    const cached = localStorage.getItem('ai_innovations_user');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.token && parsed.expiresAt) {
          if (Date.now() < parsed.expiresAt) {
            setCurrentUser(parsed.user);
          } else {
            localStorage.removeItem('ai_innovations_user');
          }
        } else if (parsed.id) {
          setCurrentUser(parsed);
        }
      } catch (e) {
        localStorage.removeItem('ai_innovations_user');
      }
    }
  }, []);

  // Theme preference live processor
  useEffect(() => {
    const handleThemeStyleProcess = () => {
      const activeSysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const targetTheme = theme === 'system' ? (activeSysDark ? 'dark' : 'light') : theme;
      if (targetTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    handleThemeStyleProcess();

    const mediaDetector = window.matchMedia('(prefers-color-scheme: dark)');
    if (theme === 'system') {
      mediaDetector.addEventListener('change', handleThemeStyleProcess);
    }
    return () => mediaDetector.removeEventListener('change', handleThemeStyleProcess);
  }, [theme]);

  // Global Inactivity Detector
  useEffect(() => {
    if (!currentUser) {
      setShowTimeoutWarning(false);
      return;
    }

    const refreshLastActiveTime = () => setLastActivity(Date.now());

    window.addEventListener('mousemove', refreshLastActiveTime);
    window.addEventListener('keydown', refreshLastActiveTime);
    window.addEventListener('click', refreshLastActiveTime);
    window.addEventListener('scroll', refreshLastActiveTime);

    return () => {
      window.removeEventListener('mousemove', refreshLastActiveTime);
      window.removeEventListener('keydown', refreshLastActiveTime);
      window.removeEventListener('click', refreshLastActiveTime);
      window.removeEventListener('scroll', refreshLastActiveTime);
    };
  }, [currentUser]);

  // Session tick sweep
  useEffect(() => {
    if (!currentUser) return;

    const sessionTick = setInterval(() => {
      const idleTime = Date.now() - lastActivity;
      // 30 minutes in milliseconds
      const limitRaw = 30 * 60 * 1000;
      // Alert 30 seconds before timeout (at 29.5 minutes = 1770000 ms)
      const warningLimit = 29.5 * 60 * 1000;

      if (idleTime >= limitRaw) {
        handleLogout();
        setShowTimeoutWarning(false);
        alert('Cryptographic session expired due to 30 minutes of inactivity. Handshake revoked.');
      } else if (idleTime >= warningLimit) {
        setShowTimeoutWarning(true);
        setTimeLeft(Math.ceil((limitRaw - idleTime) / 1000));
      } else {
        setShowTimeoutWarning(false);
      }
    }, 1000);

    return () => clearInterval(sessionTick);
  }, [currentUser, lastActivity]);

  // Global Keyboard Accessibility Shortcuts Manager (Shift + ?)
  useEffect(() => {
    const handleAccessShortcuts = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchResults(p => !p);
      } else if (e.key === '?' && e.shiftKey) {
        e.preventDefault();
        setShowAccessibilityModal(p => !p);
      } else if (e.key === 'Escape') {
        setShowAccessibilityModal(false);
      } else if (e.altKey) {
        if (e.key === '1') {
          e.preventDefault();
          setActiveTab('overview');
        } else if (e.key === '2') {
          e.preventDefault();
          setActiveTab('showcase');
        } else if (e.key === '3') {
          e.preventDefault();
          handleTabClick('chat');
        } else if (e.key === '4') {
          e.preventDefault();
          handleTabClick('dashboard');
        } else if (e.key === '5' && currentUser?.role === 'admin') {
          e.preventDefault();
          handleTabClick('cms');
        }
      }
    };

    window.addEventListener('keydown', handleAccessShortcuts);
    return () => window.removeEventListener('keydown', handleAccessShortcuts);
  }, [currentUser, activeTab]);

  const handleAuthSuccess = (user: User, rememberMe: boolean = false) => {
    setCurrentUser(user);
    
    // Generate a cryptographically secure token
    const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0')).join('');
      
    const sessionData = {
      user,
      token,
      expiresAt: Date.now() + (rememberMe ? 7 * 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000)
    };
    
    localStorage.setItem('ai_innovations_user', JSON.stringify(sessionData));
    setShowAuthModal(false);
    
    // Redirect admin user directly to the CMS panel
    if (user.role === 'admin' && activeTab === 'showcase') {
      setActiveTab('cms');
    } else if (activeTab === 'showcase') {
      setActiveTab('chat');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ai_innovations_user');
    setActiveTab('showcase');
  };

  // Channel Creation Trigger Handlers (CMS or Sidebar)
  const handleAddChannel = async (name: string, description: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setChannels(prev => [...prev, data.channel]);
        addToast(`Channel #${name} created successfully.`);
        return true;
      } else {
        addToast(data.error || 'Failed to instantiate channel router.');
        return false;
      }
    } catch (err) {
      console.error('API Error adding channel:', err);
      addToast('Error adding channel.');
      return false;
    }
  };

  // CMS Catalog Item Updates inside Memory Server
  const handleUpdateProduct = async (product: Partial<Product>): Promise<boolean> => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        await fetchData(); // refresh catalogs
        addToast(`Product catalog updated successfully.`);
        return true;
      }
      addToast('Failed to update product.');
      return false;
    } catch (err) {
      console.error('API Error updating catalogs:', err);
      return false;
    }
  };

  const handleDeleteProduct = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        await fetchData();
        addToast('Product successfully decommissioned.');
        return true;
      }
      return false;
    } catch (err) {
      console.error('API Error deleting product listing:', err);
      return false;
    }
  };

  // CMS block text copy update
  const handleUpdateCmsBlock = async (block: CMSBlock): Promise<boolean> => {
    try {
      const response = await fetch('/api/cms-blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(block),
      });
      if (response.ok) {
        await fetchData();
        addToast('CMS Block synchronized and updated.');
        return true;
      }
      return false;
    } catch (err) {
      console.error('API Error updating CMS blocks:', err);
      return false;
    }
  };

  // User details preference update inside Dashboard
  const handleUpdateUser = async (updatedFields: Partial<User>): Promise<boolean> => {
    if (!currentUser) return false;
    try {
      const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser.username,
          ...updatedFields
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setCurrentUser(data.user);
        const cached = localStorage.getItem('ai_innovations_user');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (parsed.token) {
              parsed.user = data.user;
              localStorage.setItem('ai_innovations_user', JSON.stringify(parsed));
            } else {
              localStorage.setItem('ai_innovations_user', JSON.stringify(data.user));
            }
          } catch(e) {
            localStorage.setItem('ai_innovations_user', JSON.stringify(data.user));
          }
        } else {
          localStorage.setItem('ai_innovations_user', JSON.stringify(data.user));
        }
        addToast('Identity preferences saved.');
        return true;
      }
      addToast('Failed to update preferences.');
      return false;
    } catch (err) {
      console.error('API Error updating user settings:', err);
      return false;
    }
  };

  // Sync activeTab state from location pathname
  useEffect(() => {
    if (location.pathname === '/workspace') {
      setActiveTab('overview');
    } else if (location.pathname.startsWith('/workspace/showcase')) {
      setActiveTab('showcase');
    } else if (location.pathname.startsWith('/workspace/chat')) {
      setActiveTab('chat');
    } else if (location.pathname.startsWith('/workspace/dashboard')) {
      setActiveTab('dashboard');
    } else if (location.pathname.startsWith('/workspace/cms')) {
      setActiveTab('cms');
    }
  }, [location.pathname]);

  // Security barrier logic for click triggers
  const handleTabClick = (tab: 'overview' | 'showcase' | 'chat' | 'dashboard' | 'cms') => {
    if (tab === 'overview') {
      setActiveTab('overview');
      navigate('/workspace');
      return;
    }
    if (tab === 'showcase') {
      setActiveTab('showcase');
      navigate('/workspace/showcase');
      return;
    }

    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    setActiveTab(tab);
    navigate(`/workspace/${tab}`);
  };

  const filteredSearchProducts = globalSearch.trim()
    ? products.filter(p => 
        p.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(globalSearch.toLowerCase())
      )
    : [];

  const filteredSearchCaseStudies = globalSearch.trim()
    ? caseStudies.filter(cs => 
        cs.title.toLowerCase().includes(globalSearch.toLowerCase()) || 
        cs.client.toLowerCase().includes(globalSearch.toLowerCase())
      )
    : [];

  const filteredSearchChannels = globalSearch.trim()
    ? channels.filter(c => 
        c.name.toLowerCase().includes(globalSearch.toLowerCase())
      )
    : [];

  const isWorkspace = location.pathname.startsWith('/workspace');

  if (!isWorkspace) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col justify-between selection:bg-blue-600 selection:text-white transition-colors duration-250">
        <PublicHeader theme={theme === 'dark' ? 'dark' : 'light'} toggleTheme={() => handleUpdateTheme(theme === 'dark' ? 'light' : 'dark')} />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={
              <div className="pt-16 sm:pt-18 md:pt-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
                <Hero />
                <Marquee />
                <About />
                <Services />
                <Portfolio />
                <ProcessTimeline />
                <Testimonials />
                <Contact />
              </div>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <PublicFooter theme={theme === 'dark' ? 'dark' : 'light'} toggleTheme={() => handleUpdateTheme(theme === 'dark' ? 'light' : 'dark')} />

        <BackToTop />

        <AiAssistant />

        <AnimatePresence>
          {showAuthModal && (
            <AuthModal
              onClose={() => setShowAuthModal(false)}
              onSuccess={handleAuthSuccess}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex flex-col justify-between selection:bg-blue-600 selection:text-white transition-colors duration-250">
      
      {/* HEADER NAVIGATION SHELL */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-3 shadow-xs transition-colors duration-250">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link 
            to="/"
            className="flex items-center gap-3 active:scale-98 transition-transform group text-left"
          >
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              <img src="/oits_logo.png" alt="" className="w-full h-full object-contain" onError={(e) => (e.target as any).style.display = 'none'} />
              <Cpu className="w-4 h-4 text-blue-600 group-hover:rotate-12 transition-transform" />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-black tracking-tight text-slate-850 dark:text-slate-100 block leading-none font-sans uppercase bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 dark:from-white dark:to-slate-400">OITS Dhaka</span>
              <div className="text-[9px] font-sans text-blue-600 dark:text-blue-400 tracking-wider uppercase block font-black leading-none mt-1">ENGINEERING PLATFORM</div>
            </div>
          </Link>

          {/* GLOBAL SEARCH INPUT BAR */}
          <div className="relative hidden md:block w-48 lg:w-64">
            <button
              onClick={() => setShowSearchResults(true)}
              className="w-full text-left text-[10.5px] font-medium bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-900 rounded-xl pl-8 pr-3 py-1.5 text-slate-400 dark:text-slate-500 transition-all font-semibold flex items-center"
            >
              <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-405 dark:text-slate-500">
                <Search className="w-3.5 h-3.5" />
              </span>
              Search products, channels...
              <span className="ml-auto text-[9px] border border-slate-200 dark:border-slate-700 rounded px-1">⌘K</span>
            </button>
          </div>

          {/* Nav pills */}
          <nav className="flex items-center bg-slate-100 p-1 border border-slate-200 rounded-xl overflow-hidden font-sans font-bold shadow-inner">
            <button
              onClick={() => handleTabClick('overview')}
              className={`text-[9.5px] uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'overview' 
                  ? 'bg-white text-slate-800 shadow-xs border border-slate-200/55' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
              }`}
            >
              OPS CONTROL TOWER
            </button>
            <button
              onClick={() => handleTabClick('showcase')}
              className={`text-[9.5px] uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'showcase' 
                  ? 'bg-white text-slate-800 shadow-xs border border-slate-200/55' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
              }`}
            >
              DIRECTORY SHOWCASE
            </button>
            <button
              onClick={() => handleTabClick('chat')}
              className={`text-[9.5px] uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'chat' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
              }`}
            >
              <MessageSquareLock className="w-3.5 h-3.5 shrink-0" />
              SECURE CHAT
            </button>
            <button
              onClick={() => handleTabClick('dashboard')}
              className={`text-[9.5px] uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'dashboard' 
                  ? 'bg-white text-slate-800 shadow-xs border border-slate-200/55' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
              }`}
            >
              IDENTITY
            </button>
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => handleTabClick('cms')}
                className={`text-[9.5px] uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'cms' 
                    ? 'bg-white text-slate-800 shadow-xs border border-slate-200/55' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
                }`}
              >
                CMS PANEL
              </button>
            )}
          </nav>

          {/* User controls */}
          <div className="flex items-center gap-2">
            
            {/* Quick Header Theme Toggler */}
            <button
              onClick={() => handleUpdateTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-amber-400 transition-colors"
              title={`Toggle Style Theme (Current: ${theme})`}
              aria-label="Toggle dark mode theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
            </button>

            {/* Account Icon Beside Theme Toggler */}
            <button
              onClick={() => handleTabClick('dashboard')}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-sky-400 transition-colors"
              title="Authentication / Account Dashboard"
              aria-label="Toggle account dashboard"
            >
              <UserCircle className="w-4 h-4 shrink-0" strokeWidth={2.5} />
            </button>
            
            {/* Keyboard Shortcuts Help Badge */}
            <button
              onClick={() => setShowAccessibilityModal(true)}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-amber-400 transition-colors hidden sm:block"
              title="Keyboard Accessibility Panel (Shift + ?)"
              aria-label="Keyboard shortcuts helper panel"
            >
              <Keyboard className="w-4 h-4 shrink-0" />
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="text-right hidden lg:block">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block leading-none">{currentUser.username}</span>
                  <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase font-semibold block mt-1">{currentUser.role} node</span>
                </div>
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt="identity avatar" className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 hidden lg:block object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 hidden lg:flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Logout Session"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-sans font-bold px-3.5 py-1.5 rounded-xl transition-all active:scale-95 flex items-center gap-1.5 shadow-xs shadow-blue-105"
              >
                <KeyRound className="w-3.5 h-3.5" />
                Authenticate
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER PANEL */}
      <main className="flex-1 bg-[#F1F5F9] relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-32 space-y-4">
            <RefreshSpinner />
            <span className="font-mono text-xs text-slate-500 uppercase tracking-widest block animate-pulse">Initializing Database Kernels...</span>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
              className="max-w-7xl mx-auto py-4"
            >
              {activeTab === 'overview' && (
                <OpsControlTower
                  currentUser={currentUser}
                  products={products}
                  caseStudies={caseStudies}
                  cmsBlocks={cmsBlocks}
                  channels={channels}
                  onNavigate={handleTabClick}
                  onOpenAuth={() => setShowAuthModal(true)}
                />
              )}

              {activeTab === 'showcase' && (
                <ShowcaseView 
                  products={products}
                  caseStudies={caseStudies}
                  cmsBlocks={cmsBlocks}
                  onTriggerDemo={(room) => {
                    setActiveRoomId(room);
                    handleTabClick('chat');
                  }}
                />
              )}

              {activeTab === 'chat' && currentUser && (
                <ChatroomView
                  currentUser={currentUser}
                  channels={channels}
                  onAddChannel={handleAddChannel}
                  activeRoomId={activeRoomId}
                  onChangeRoom={(id) => setActiveRoomId(id)}
                />
              )}

              {activeTab === 'dashboard' && currentUser && (
                <UserDashboardView
                  currentUser={currentUser}
                  onUpdateUser={handleUpdateUser}
                  theme={theme}
                  onUpdateTheme={handleUpdateTheme}
                />
              )}

              {activeTab === 'cms' && (
                <CMSAdminView
                  currentUser={currentUser}
                  products={products}
                  caseStudies={caseStudies}
                  cmsBlocks={cmsBlocks}
                  channels={channels}
                  onUpdateProduct={handleUpdateProduct}
                  onDeleteProduct={handleDeleteProduct}
                  onUpdateCmsBlock={handleUpdateCmsBlock}
                  onAddChannel={handleAddChannel}
                  onTriggerAuthRedirect={() => setShowAuthModal(true)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      <BackToTop />

      <AnimatePresence>
        {showSearchResults && (
          <GlobalSearchModal
            isOpen={showSearchResults}
            onClose={() => setShowSearchResults(false)}
            products={products}
            channels={channels}
            caseStudies={caseStudies}
            onSelectProduct={() => {
              setActiveTab('showcase');
              setShowSearchResults(false);
            }}
            onSelectChannel={(c) => {
              setActiveRoomId(c.id);
              handleTabClick('chat');
              setShowSearchResults(false);
            }}
            onSelectCaseStudy={() => {
              setActiveTab('showcase');
              setShowSearchResults(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* GLOBAL AUTHORIZATION POPUP OVERLAY MODAL */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md"
            >
              <AuthModal 
                onSuccess={handleAuthSuccess}
                onClose={() => setShowAuthModal(false)}
              />
              
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-xs font-mono text-slate-500 hover:text-slate-300 bg-slate-950/40 p-1 rounded-md border border-slate-850"
              >
                ESC
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GLOBAL KEYBOARD ACCESSIBILITY short-cut modal */}
      <AnimatePresence>
        {showAccessibilityModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Keyboard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-sm font-bold font-sans text-slate-800 dark:text-slate-100">Keyboard Accessibility Dashboard</h3>
                </div>
                <button
                  onClick={() => setShowAccessibilityModal(false)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] font-sans text-slate-500 dark:text-slate-400 mb-4 font-medium">
                AI Innovations platform is structured for instant terminal access. Leverage these global standard shortcuts:
              </p>

              <div className="space-y-3 font-sans">
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-150/60 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Accessibility Manual Panel</span>
                  <kbd className="px-2 py-1 text-[9.5px] font-bold font-mono bg-white dark:bg-slate-800 border border-slate-350 dark:border-slate-650 rounded-lg shadow-sm text-slate-700 dark:text-slate-200">Shift + ?</kbd>
                </div>

                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-150/60 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Go to Ops Control Tower</span>
                  <div className="flex gap-1">
                    <kbd className="px-2 py-1 text-[9.5px] font-bold font-mono bg-white dark:bg-slate-800 border border-slate-350 dark:border-slate-650 rounded-lg shadow-sm text-slate-700 dark:text-slate-200">Alt</kbd>
                    <span>+</span>
                    <kbd className="px-2 py-1 text-[9.5px] font-bold font-mono bg-white dark:bg-slate-800 border border-slate-350 dark:border-slate-650 rounded-lg shadow-sm text-slate-700 dark:text-slate-200">1</kbd>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-150/60 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Go to Directory Showcase</span>
                  <div className="flex gap-1">
                    <kbd className="px-2 py-1 text-[9.5px] font-bold font-mono bg-white dark:bg-slate-800 border border-slate-350 dark:border-slate-650 rounded-lg shadow-sm text-slate-700 dark:text-slate-200">Alt</kbd>
                    <span>+</span>
                    <kbd className="px-2 py-1 text-[9.5px] font-bold font-mono bg-white dark:bg-slate-800 border border-slate-350 dark:border-slate-650 rounded-lg shadow-sm text-slate-700 dark:text-slate-200">2</kbd>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-150/60 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Go to Secure Chat Space</span>
                  <div className="flex gap-1">
                    <kbd className="px-2 py-1 text-[9.5px] font-bold font-mono bg-white dark:bg-slate-800 border border-slate-350 dark:border-slate-650 rounded-lg shadow-sm text-slate-700 dark:text-slate-200">Alt</kbd>
                    <span>+</span>
                    <kbd className="px-2 py-1 text-[9.5px] font-bold font-mono bg-white dark:bg-slate-800 border border-slate-350 dark:border-slate-650 rounded-lg shadow-sm text-slate-700 dark:text-slate-200">3</kbd>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-150/60 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Go to Identity Dashboard</span>
                  <div className="flex gap-1">
                    <kbd className="px-2 py-1 text-[9.5px] font-bold font-mono bg-white dark:bg-slate-800 border border-slate-350 dark:border-slate-650 rounded-lg shadow-sm text-slate-700 dark:text-slate-200">Alt</kbd>
                    <span>+</span>
                    <kbd className="px-2 py-1 text-[9.5px] font-bold font-mono bg-white dark:bg-slate-800 border border-slate-350 dark:border-slate-650 rounded-lg shadow-sm text-slate-700 dark:text-slate-200">4</kbd>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-150/60 dark:border-slate-800">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">Go to CMS Admin Console</span>
                    <span className="text-[9px] text-slate-405 block font-medium">Authorised role check is enforced</span>
                  </div>
                  <div className="flex gap-1">
                    <kbd className="px-2 py-1 text-[9.5px] font-bold font-mono bg-white dark:bg-slate-800 border border-slate-350 dark:border-slate-650 rounded-lg shadow-sm text-slate-700 dark:text-slate-200">Alt</kbd>
                    <span>+</span>
                    <kbd className="px-2 py-1 text-[9.5px] font-bold font-mono bg-white dark:bg-slate-800 border border-slate-350 dark:border-slate-650 rounded-lg shadow-sm text-slate-700 dark:text-slate-200">5</kbd>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-150/60 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 font-sans">Dismiss Panel / Warn States</span>
                  <kbd className="px-2 py-1 text-[9.5px] font-bold font-mono bg-white dark:bg-slate-800 border border-slate-350 dark:border-slate-650 rounded-lg shadow-sm text-slate-700 dark:text-slate-200">ESC / Close</kbd>
                </div>
              </div>

              <div className="mt-5 text-center font-mono text-[9px] text-slate-400 dark:text-slate-500 uppercase select-none">
                AI INNOVATIONS SECURITY GROUP COMPLIANCE DIRECTIVE
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SESSION INACTIVITY COMPLIANCE ALERT MODAL */}
      <AnimatePresence>
        {showTimeoutWarning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-950 border-2 border-amber-500/80 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-left space-y-4"
            >
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-10 h-10 text-amber-500 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold font-sans text-slate-800 dark:text-slate-100">Security warning: Idle handshakes</h3>
                  <p className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">30-minute security clearance timing is expiring.</p>
                </div>
              </div>

              <p className="text-[11.5px] text-slate-600 dark:text-slate-400 leading-relaxed font-sans font-medium">
                You have been inactive for over 29 minutes. Your cryptographic seat tunnel will be automatically severed in <span className="font-bold text-amber-600 dark:text-amber-500 font-mono text-xs">{timeLeft} seconds</span> for data protection.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-1.5 font-sans">
                <button
                  onClick={() => handleLogout()}
                  className="py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 text-xs rounded-xl font-bold transition-all"
                >
                  LOGOUT NODE
                </button>
                <button
                  onClick={() => {
                    setLastActivity(Date.now());
                    setShowTimeoutWarning(false);
                    addToast('Session successfully extended.');
                  }}
                  className="py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white text-xs rounded-xl font-extrabold shadow-sm hover:scale-102 transition-transform"
                >
                  EXTEND CLEARANCE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SWISS MODERN FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-6 px-6 text-center mt-12 overflow-hidden shrink-0 text-slate-600 dark:text-slate-400 shadow-sm transition-colors duration-250">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-slate-505 font-mono space-y-4 md:space-y-0">
          <div className="flex items-center gap-2 select-none">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping shrink-0" />
            <span className="text-slate-600 font-semibold">Nodes Online: Port 3000 AES-256 Verified TLS</span>
          </div>

          <div className="space-x-4 text-slate-500 font-medium">
            <span className="hover:text-slate-800 transition-colors cursor-pointer select-none">Corporate Directory</span>
            <span>·</span>
            <span className="hover:text-slate-800 transition-colors cursor-pointer select-none">Privacy & HSM Audits</span>
            <span>·</span>
            <span className="hover:text-slate-800 transition-colors cursor-pointer select-none">SecureNet Central</span>
          </div>

          <div className="text-[11px] select-none text-slate-400">
            SYSTEM_TIME_ESTABLISHED_UTC: {new Date().toISOString().substring(0, 10)}
          </div>
        </div>
      </footer>
      <AiAssistant />
      
      {/* GLOBAL TOAST NOTIFICATIONS */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="bg-slate-900/90 dark:bg-slate-800 backdrop-blur-md text-white text-[11px] font-sans font-bold py-2.5 px-5 rounded-full shadow-2xl border border-slate-700/50 pointer-events-auto flex items-center gap-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Beautiful simple custom SVG spinning indicator
function RefreshSpinner() {
  return (
    <svg className="animate-spin h-8 w-8 text-indigo-500 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}

function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-[60] p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl hover:shadow-blue-500/40 transition-all hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-500/20 group"
          aria-label="Scroll back to top"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="group-hover:-translate-y-0.5 transition-transform"
          >
            <path d="m18 15-6-6-6 6"/>
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
