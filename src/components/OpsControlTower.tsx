import React, { useState, useEffect } from 'react';
import { Product, CaseStudy, CMSBlock, Channel, User } from '../types';
import { 
  ShieldCheck, Cpu, Activity, Layers, Clock, Terminal, Globe, 
  MessageSquareLock, UserCheck, Database, ArrowRight, Radio, KeyRound, Server, AlertCircle, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';

interface OpsControlTowerProps {
  currentUser: User | null;
  products: Product[];
  caseStudies: CaseStudy[];
  cmsBlocks: CMSBlock[];
  channels: Channel[];
  onNavigate: (tab: 'showcase' | 'chat' | 'dashboard' | 'cms') => void;
  onOpenAuth: () => void;
}

interface HealthStatus {
  status: string;
  time: string;
  latency?: number;
  dbSynced?: boolean;
}

interface MiniAuditLog {
  id: string;
  action: string;
  username: string;
  detail: string;
  timestamp: string;
}

export default function OpsControlTower({
  currentUser,
  products,
  caseStudies,
  cmsBlocks,
  channels,
  onNavigate,
  onOpenAuth,
}: OpsControlTowerProps) {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [testingPing, setTestingPing] = useState(false);
  const [pingResult, setPingResult] = useState<number | null>(null);
  const [recentLogs, setRecentLogs] = useState<MiniAuditLog[]>([]);
  const [fetchingLogs, setFetchingLogs] = useState(false);

  // Mock activity data for recharts
  const platformActivityData = [
    { name: 'Mon', active: 45, messages: 120 },
    { name: 'Tue', active: 52, messages: 155 },
    { name: 'Wed', active: 61, messages: 198 },
    { name: 'Thu', active: 58, messages: 180 },
    { name: 'Fri', active: 75, messages: 245 },
    { name: 'Sat', active: 40, messages: 90 },
    { name: 'Sun', active: 35, messages: 75 },
  ];

  // Fetch server health metrics
  const fetchHealth = async () => {
    try {
      const start = performance.now();
      const res = await fetch('/api/health');
      const data = await res.json();
      const end = performance.now();
      setHealth({
        status: data.status,
        time: data.time,
        latency: Math.round(end - start),
        dbSynced: true
      });
    } catch (e) {
      console.error('Failed to read live server telemetry:', e);
    }
  };

  // Fetch recent audit logs for the central terminal feed
  const fetchRecentLogs = async () => {
    try {
      setFetchingLogs(true);
      const res = await fetch('/api/audit-logs');
      if (res.ok) {
        const data = await res.json();
        // Take the latest 5 records
        setRecentLogs(data.slice(0, 5));
      }
    } catch (e) {
      console.error('Failed to retrieve recent actions:', e);
    } finally {
      setFetchingLogs(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    fetchRecentLogs();
    
    // Auto-refresh telemetry every 10 seconds for real-time vibe
    const interval = setInterval(() => {
      fetchHealth();
      fetchRecentLogs();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const triggerPingTest = () => {
    setTestingPing(true);
    setPingResult(null);
    const start = performance.now();
    fetch('/api/products')
      .then(() => {
        const end = performance.now();
        setPingResult(Math.round(end - start));
      })
      .finally(() => setTestingPing(false));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 select-none text-left">
      
      {/* MONOREPO TITLE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-5 gap-3">
        <div>
          <span className="text-[10px] uppercase font-mono text-blue-600 tracking-widest block mb-1 font-bold">MONOREPO SYSTEMS CONTROL TOWER</span>
          <h1 className="text-3xl font-bold font-sans text-slate-900 tracking-tight">Enterprise Ops & Control Tower</h1>
          <p className="text-xs text-slate-500 font-sans mt-0.5">Central orchestrator uniting customer showcases, secure websocket tunnels, user directory, and administrative catalog controls.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9.5px] font-mono text-blue-700 bg-blue-50 px-3 py-1.5 border border-blue-100 rounded-full font-bold flex items-center gap-1.5 leading-none">
            <Radio className="w-3.5 h-3.5 text-blue-650 animate-pulse" />
            CORE ACTIVE: PORT 3000
          </span>
        </div>
      </div>

      {/* TOP STATS STATS GRID */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-xs"
        >
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-mono text-slate-400 font-bold tracking-wider block">Showcase Solutions</span>
            <span className="text-2xl font-extrabold text-slate-850 block leading-none">{products.length} Active Modules</span>
            <span className="text-[10.5px] text-slate-500 font-sans block">Healthcare, FinTech, Call NLP</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-xs"
        >
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-mono text-slate-400 font-bold tracking-wider block">Communication Ports</span>
            <span className="text-2xl font-extrabold text-slate-850 block leading-none">{channels.length} Secured Links</span>
            <span className="text-[10.5px] text-slate-500 font-sans block">Static & On-Demand Slots</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <Radio className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-xs"
        >
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-mono text-slate-400 font-bold tracking-wider block">CMS Block Copy</span>
            <span className="text-2xl font-extrabold text-slate-850 block leading-none">{cmsBlocks.length} Variables</span>
            <span className="text-[10.5px] text-slate-500 font-sans block">Modifiable by Administration</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-xs"
        >
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-mono text-slate-400 font-bold tracking-wider block">Telemetry Health</span>
            <span className="text-2xl font-extrabold text-slate-850 block leading-none">
              {health?.status === 'ok' ? 'Online' : 'Loading...'} {health?.latency && `(${health.latency}ms)`}
            </span>
            <span className="text-[10.5px] text-slate-505 font-mono block leading-none">Status Code: HTTP 200</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
        </motion.div>

      </motion.div>

      {/* CONSOLIDATED CORE WORKSPACE GRIDS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* SUB-APP MONOREPO LAUNCHERS (LEFT COLUMN) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold font-sans text-slate-800 flex items-center gap-2">
                <Server className="w-4.5 h-4.5 text-blue-600" /> Monorepo Services Hub
              </h3>
              <p className="text-[11px] text-slate-450 mt-0.5 leading-normal font-sans font-semibold">
                Directly interact with the self-contained operational pipelines below. Credentials and shared preferences synchronize seamlessly in real-time.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* LAUNCHER 1: WEBSITE SHOWCASE */}
              <div className="border border-slate-205 p-4 rounded-xl space-y-3.5 hover:border-slate-350 bg-slate-50/20 transition-all group flex flex-col justify-between font-semibold">
                <div>
                  <div className="flex items-center gap-2 text-blue-700">
                    <Globe className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider font-mono">1. Public Showcase</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mt-1.5">Interactive Solutions & D3 Graph</h4>
                  <p className="text-[10.5px] text-slate-450 mt-1 lines-clamp-3 font-sans leading-normal">
                    Proprietary website directory with live-load metrics and SVG force-link network cluster maps coengineered with regional health nodes.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('showcase')}
                  className="text-[10px] font-sans font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform self-start mt-2"
                >
                  LOAD PORTFOLIO <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* LAUNCHER 2: E2EE CHATROOMS */}
              <div className="border border-slate-205 p-4 rounded-xl space-y-3.5 hover:border-slate-350 bg-slate-50/20 transition-all group flex flex-col justify-between font-semibold">
                <div>
                  <div className="flex items-center gap-2 text-purple-705">
                    <MessageSquareLock className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider font-mono">2. WebSocket Chat</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mt-1.5">E2E Multiplex Messaging Tunnels</h4>
                  <p className="text-[10.5px] text-slate-450 mt-1 lines-clamp-3 font-sans leading-normal">
                    Secure channel routers allowing browser symmetric crypto handshakes. Block system feeds dynamically or create dynamic sockets.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('chat')}
                  className="text-[10px] font-sans font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform self-start mt-2"
                >
                  OPEN TUNNELS <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* LAUNCHER 3: IDENTITY & 2FA */}
              <div className="border border-slate-205 p-4 rounded-xl space-y-3.5 hover:border-slate-350 bg-slate-50/20 transition-all group flex flex-col justify-between font-semibold">
                <div>
                  <div className="flex items-center gap-2 text-emerald-705">
                    <UserCheck className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider font-mono">3. Security Settings</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-805 mt-1.5">Asymmetric Keyrings & Telemetry</h4>
                  <p className="text-[10.5px] text-slate-450 mt-1 lines-clamp-3 font-sans leading-normal">
                    Manage RSA certificates, generate Authenticator seeds, configure firewall blocks, and track telemetry metrics on Recharts.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="text-[10px] font-sans font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform self-start mt-2"
                >
                  CONFIGURE CREDS <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* LAUNCHER 4: CMS ADMIN SWITCHBOARD */}
              <div className="border border-slate-205 p-4 rounded-xl space-y-3.5 hover:border-slate-350 bg-slate-50/20 transition-all group flex flex-col justify-between font-semibold">
                <div>
                  <div className="flex items-center gap-2 text-orange-705">
                    <Layers className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider font-mono">4. CMS & Audit Logs</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-805 mt-1.5">Administrative Override Console</h4>
                  <p className="text-[10.5px] text-slate-450 mt-1 lines-clamp-3 font-sans leading-normal">
                    Rewrite marketing text blocks, decommission solutions from the core HSM index, create static sockets, and audit real blockchain operations logs.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('cms')}
                  className="text-[10px] font-sans font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform self-start mt-2"
                >
                  ACCESS CMS PANEL <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TELEMETRY AND TERMINAL AUDITS */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* USER SESSION AND SEAT BARRIER */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold font-sans text-slate-850">Client Session Status</h3>
              <span className={`text-[8.5px] font-sans uppercase font-extrabold px-2.5 py-0.5 border rounded-full ${
                currentUser ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-rose-50 text-rose-800 border-rose-100'
              }`}>
                {currentUser ? 'AUTHENTICATED' : 'ANONYMOUS TUNNEL'}
              </span>
            </div>

            {currentUser ? (
              <div className="space-y-4 font-semibold">
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="relative shrink-0">
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt="User Avatar" className="w-10 h-10 rounded-full border border-slate-200 object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full border border-slate-200 bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
                        {currentUser.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm" title="Online"></span>
                  </div>
                  <div className="text-left font-semibold">
                    <span className="text-xs font-bold text-slate-800 block">@{currentUser.username}</span>
                    <span className="text-[10px] font-mono text-slate-500 block uppercase tracking-wider mt-0.5">{currentUser.role} seat clearance</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                    <span className="text-[9px] font-mono text-slate-400 block uppercase">2FA Compliant</span>
                    <span className="font-bold text-[11px] text-slate-705 mt-0.5 block">
                      {currentUser.mfaEnabled ? '✓ Fully Verified' : '✗ Deactivated'}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                    <span className="text-[9px] font-mono text-slate-400 block uppercase">Browser Alerts</span>
                    <span className="font-bold text-[11px] text-slate-705 mt-0.5 block">
                      {currentUser.pushEnabled ? '✓ Enabled' : '✗ Blocked'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-center py-2 font-semibold">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto select-none" />
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-normal">
                  Standard directory resources are read-only. Please authenticate using the proper seat key in the terminal block to establish write permissions.
                </p>
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-1.5 mx-auto shadow-sm"
                >
                  <KeyRound className="w-3.5 h-3.5" /> Authenticate Port
                </button>
              </div>
            )}
          </div>

          {/* TELEMETRY PACKET PING WIDGET */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
            <h3 className="text-sm font-bold font-sans text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-1.5">
              <TrendingUp className="w-4.5 h-4.5 text-blue-600" /> Platform Activity Trends
            </h3>

            <div className="h-[200px] w-full min-w-[200px] min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100}>
                <AreaChart data={platformActivityData}>
                  <defs>
                    <linearGradient id="colorMsg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} stroke="#94a3b8" />
                  <YAxis fontSize={10} tickLine={false} axisLine={false} stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="messages" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorMsg)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-3 font-semibold text-xs pt-4 border-t border-slate-50">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-mono text-slate-450 block">SIMULATE DELAY PROBE:</span>
                <button
                  onClick={triggerPingTest}
                  disabled={testingPing}
                  className="bg-slate-900 text-white text-[10px] font-mono font-bold px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800"
                >
                  {testingPing ? 'PROBING...' : 'TEST PROTOCOL'}
                </button>
              </div>

              {pingResult !== null && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-lg text-[10.5px] font-mono font-bold flex justify-between">
                  <span>SYSTEM FEEDBACK DELAY (RTT):</span>
                  <span>{pingResult} ms</span>
                </div>
              )}

              <div className="space-y-1 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-400 select-text leading-relaxed">
                <div className="flex justify-between text-slate-500 font-bold border-b border-slate-850 pb-1.5 mb-1.5">
                  <span>METRIC TELEMETRY PARAM</span>
                  <span>VALUE LOGGED</span>
                </div>
                <div className="flex justify-between">
                  <span>Secure Port Binding:</span>
                  <span className="text-emerald-450 font-bold">0.0.0.0:3000</span>
                </div>
                <div className="flex justify-between">
                  <span>Node.js Env Mode:</span>
                  <span className="text-blue-400 font-bold">{health?.status ? 'Development' : 'Loading...'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dynamic Seed Databases:</span>
                  <span className="text-purple-400 font-bold">SQL Light Memory</span>
                </div>
                <div className="flex justify-between">
                  <span>Server Local Time:</span>
                  <span className="text-yellow-400 font-bold">{health?.time ? new Date(health.time).toLocaleTimeString() : 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* STREAMING AUDIT LOG TICKER */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold font-sans text-slate-850 flex items-center gap-1.5">
                <Terminal className="w-4.5 h-4.5 text-blue-600 shrink-0" /> Enterprise Audit Logs Ticker
              </h3>
              <button
                onClick={fetchRecentLogs}
                disabled={fetchingLogs}
                className="text-[9.5px] font-sans font-bold text-blue-600 hover:text-blue-500"
                type="button"
              >
                REFRESH LOGS
              </button>
            </div>

            <div className="space-y-3 font-semibold">
              {recentLogs.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 font-sans font-bold">
                  Telemetry terminal buffer clear.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {recentLogs.map((log) => {
                    const isMfaOrBoot = log.action.includes('Boot') || log.action.includes('MFA') || log.action.includes('Success');
                    return (
                      <div 
                        key={log.id} 
                        className="p-2.5 bg-slate-50/50 rounded-xl border border-slate-150 flex items-start justify-between gap-3 font-mono text-[10px]"
                      >
                        <div className="space-y-1 max-w-[280px]">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[8.5px] uppercase font-bold text-blue-700">@{log.username}</span>
                            <span className="text-slate-400 font-bold">·</span>
                            <span className={`text-[8px] font-bold uppercase rounded px-1.5 py-0.5 border leading-none ${
                              isMfaOrBoot ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-650'
                            }`}>
                              {log.action}
                            </span>
                          </div>
                          <span className="block text-[10.5px] font-medium text-slate-600 leading-normal">{log.detail}</span>
                        </div>
                        <span className="text-[8.5px] text-slate-400 font-bold shrink-0">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
