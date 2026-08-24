import React, { useState, useEffect } from 'react';
import { Product, CaseStudy, CMSBlock, Channel, User } from '../types';
import { 
  Lock, LayoutGrid, FileEdit, Plus, Trash2, ShieldAlert, Check, 
  RefreshCw, Layers, Sparkles, Sliders, Settings, Hash, Search, ShieldCheck, Eye,
  Activity, Clock, Cpu, Download, HardDrive
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CMSAdminViewProps {
  currentUser: User | null;
  products: Product[];
  caseStudies: CaseStudy[];
  cmsBlocks: CMSBlock[];
  channels: Channel[];
  onUpdateProduct: (product: Partial<Product>) => Promise<boolean>;
  onDeleteProduct: (id: string) => Promise<boolean>;
  onUpdateCmsBlock: (block: CMSBlock) => Promise<boolean>;
  onAddChannel: (name: string, desc: string) => Promise<boolean>;
  onTriggerAuthRedirect: () => void;
}

interface AuditLog {
  id: string;
  action: string;
  username: string;
  detail: string;
  timestamp: string;
}

export default function CMSAdminView({
  currentUser,
  products,
  caseStudies,
  cmsBlocks,
  channels,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateCmsBlock,
  onAddChannel,
  onTriggerAuthRedirect,
}: CMSAdminViewProps) {
  
  const isAdmin = currentUser?.role === 'admin';

  // Navigation Panel sub-tabs
  const [adminSubTab, setAdminSubTab] = useState<'catalog' | 'audits'>('catalog');

  // CMS state hooks
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [blockContent, setBlockContent] = useState('');

  // Product state hooks for edit / creation
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodTitle, setProdTitle] = useState('');
  const [prodCat, setProdCat] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodMetricLab, setProdMetricLab] = useState('');
  const [prodMetricVal, setProdMetricVal] = useState('');
  const [prodStatus, setProdStatus] = useState<'Live & Production' | 'MVP Complete' | 'Demo Only'>('Demo Only');

  // Channel state hooks
  const [chanName, setChanName] = useState('');
  const [chanDesc, setChanDesc] = useState('');
  
  // Commit tracking
  const [commitMessage, setCommitMessage] = useState('Operational synchronization: applying secure catalog spec updates.');
  
  // Status states
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Dynamic Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [logFilter, setLogFilter] = useState('');

  // System Health Monitor State
  const [healthData, setHealthData] = useState<{
    uptime: number;
    latency: number;
    connections: number;
    cpuLoad: number;
    memoryUtilization: number;
  } | null>(null);

  const fetchHealthData = () => {
    fetch('/api/system-health')
      .then(res => res.json())
      .then(data => setHealthData(data))
      .catch(err => console.error('Error fetching system health metrics:', err));
  };

  useEffect(() => {
    fetchHealthData();
    const interval = setInterval(fetchHealthData, 4000);
    return () => clearInterval(interval);
  }, []);

  const formatUptimeValue = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const handleExportAuditsCSV = () => {
    const headers = ['Timestamp UTC', 'Event Action', 'Operator Link', 'Transcript Details'];
    const csvLines = [headers.join(',')];
    
    filteredLogs.forEach(log => {
      const timeStr = new Date(log.timestamp).toISOString().replace(/"/g, '""');
      const actionStr = log.action.replace(/"/g, '""');
      const operatorStr = `@${log.username}`.replace(/"/g, '""');
      const detailStr = log.detail.replace(/"/g, '""');
      
      const values = [
        `"${timeStr}"`,
        `"${actionStr}"`,
        `"${operatorStr}"`,
        `"${detailStr}"`
      ];
      csvLines.push(values.join(','));
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(csvLines.join('\n'));
    const anchor = document.createElement('a');
    anchor.setAttribute("href", csvContent);
    anchor.setAttribute("download", `enterprise_audit_log_export_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  const handleExportProductsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const anchor = document.createElement('a');
    anchor.setAttribute("href", dataStr);
    anchor.setAttribute("download", `solutions_catalog_backup_${new Date().toISOString().substring(0, 10)}.json`);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  const fetchAuditLogs = () => {
    setLoadingLogs(true);
    fetch('/api/audit-logs')
      .then(res => res.json())
      .then(logs => {
        setAuditLogs(logs);
      })
      .catch(err => console.error('Failed to load audits:', err))
      .finally(() => setLoadingLogs(false));
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (adminSubTab === 'audits') {
      fetchAuditLogs();
      interval = setInterval(fetchAuditLogs, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [adminSubTab]);

  const handleCmsBlockSelect = (block: CMSBlock) => {
    setSelectedBlockId(block.id);
    setBlockContent(block.content);
  };

  const handleCMSBlockSubmit = async (e: React.FormEvent, block: CMSBlock) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    try {
      const success = await onUpdateCmsBlock({
        ...block,
        content: blockContent
      });
      if (success) {
        setSuccessMsg('Website block content updated successfully.');
        setTimeout(() => setSuccessMsg(null), 3000);
        setSelectedBlockId(null);
        setCommitMessage('');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleProductEditSelect = (prod: Product) => {
    setEditingProductId(prod.id);
    setProdTitle(prod.title);
    setProdCat(prod.category);
    setProdDesc(prod.description);
    setProdMetricLab(prod.metricLabel);
    setProdMetricVal(prod.metricValue);
    setProdStatus(prod.status);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);

    const payload: Partial<Product> = {
      title: prodTitle,
      category: prodCat,
      description: prodDesc,
      metricLabel: prodMetricLab,
      metricValue: prodMetricVal,
      status: prodStatus,
    };

    if (editingProductId && editingProductId !== 'new') {
      payload.id = editingProductId;
    }

    try {
      const success = await onUpdateProduct(payload);
      if (success) {
        setSuccessMsg(editingProductId === 'new' ? 'New AI Solution Catalog created.' : 'AI Solution Catalog listing updated.');
        setTimeout(() => setSuccessMsg(null), 3000);
        setEditingProductId(null);
        setCommitMessage('');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProductClick = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this AI solution listing? This is irreversible.')) return;
    setSaving(true);
    try {
      const success = await onDeleteProduct(id);
      if (success) {
        setSuccessMsg('Solution listing successfully expunged.');
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleChannelCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chanName.trim()) return;

    setSaving(true);
    try {
      const success = await onAddChannel(chanName.trim(), chanDesc.trim());
      if (success) {
        setSuccessMsg(`Secure Channel #${chanName} successfully instantiated.`);
        setTimeout(() => setSuccessMsg(null), 3000);
        setChanName('');
        setChanDesc('');
      }
    } finally {
      setSaving(false);
    }
  };

  // Guard Clause of Admin access denied panel
  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center select-none">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6 shadow-md">
          <div className="w-12 h-12 bg-red-50 border border-red-200 text-red-500 rounded-xl flex items-center justify-center mx-auto">
            <Lock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-sans text-slate-850 tracking-tight">Access Control Restrictions</h2>
            <p className="text-xs text-slate-500 font-sans max-w-sm mx-auto mt-2 leading-relaxed font-semibold">
              Website CMS and System Auditing require corporate administrative privileges. Authenticate your session using the proper directory credentials.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 max-w-sm mx-auto text-left space-y-1">
            <span className="text-[9px] font-mono text-slate-450 uppercase tracking-wider block font-bold">DIRECTORY INSTRUCTIONS:</span>
            <p className="text-xs text-slate-700 font-sans leading-relaxed font-semibold">
              Log out from settings and sign back in as username <strong className="text-blue-700 font-mono">admin</strong> with password <strong className="text-blue-700 font-mono">admin123</strong> to authorize dashboard features.
            </p>
          </div>

          <button
            onClick={onTriggerAuthRedirect}
            className="bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-semibold py-2.5 px-6 rounded-xl transition-all shadow-md active:scale-95"
          >
            Open Credentials Terminal
          </button>
        </div>
      </div>
    );
  }

  // Filter logs logic
  const filteredLogs = auditLogs.filter(log => {
    const q = logFilter.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.username.toLowerCase().includes(q) ||
      log.detail.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 select-none">
      
      {/* CMS header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-5 gap-3">
        <div>
          <span className="text-[10px] uppercase font-mono text-blue-600 tracking-widest block mb-1 font-bold">CMS ADMIN PORTAL</span>
          <h1 className="text-3xl font-bold font-sans text-slate-900 tracking-tight">Enterprise CMS & Audit logs</h1>
          <p className="text-xs text-slate-500 font-sans mt-0.5">Configure active solutions, tweak marketing copy blocks, and audit corporate operational actions</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 uppercase font-bold tracking-wider flex items-center gap-1.5 leading-none">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            Cryptographic Admin Session Active
          </span>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-bold shadow-xs">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Sub tabs selectors */}
      <div className="flex border-b border-slate-200 pb-1 gap-6 text-xs font-sans font-bold">
        <button
          onClick={() => setAdminSubTab('catalog')}
          className={`pb-3.5 transition-all text-xs font-bold ${
            adminSubTab === 'catalog' 
              ? 'border-b-2 border-blue-600 text-blue-750' 
              : 'text-slate-450 hover:text-slate-700'
          }`}
        >
          CATALOG REPOSITORIES & COPY COPY
        </button>
        <button
          onClick={() => setAdminSubTab('audits')}
          className={`pb-3.5 transition-all text-xs font-bold flex items-center gap-1.5 ${
            adminSubTab === 'audits' 
              ? 'border-b-2 border-blue-600 text-blue-750' 
              : 'text-slate-450 hover:text-slate-700'
          }`}
        >
          🛡️ CRITICAL SYSTEM AUDITING LOGS
        </button>
      </div>

      {/* RENDER BASED ON TAB */}
      <AnimatePresence mode="wait">
        {adminSubTab === 'catalog' ? (
          <motion.div
            key="catalog-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* LEFT COLUMN: EDITING SOLUTIONS LIST */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* SOLUTIONS MANAGEMENT GRID CARD */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold font-sans text-slate-800 flex items-center gap-2">
                    <Layers className="w-4.5 h-4.5 text-blue-600" /> AI Solutions Catalog Index ({products.length})
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportProductsJSON}
                      className="text-[10px] font-sans font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 px-3 py-2"
                      title="Export Catalog as JSON"
                    >
                      <Download className="w-3.5 h-3.5" /> EXPORT JSON
                    </button>
                    <button
                      onClick={() => {
                        setEditingProductId('new');
                        setProdTitle('');
                        setProdCat('');
                        setProdDesc('');
                        setProdMetricLab('');
                        setProdMetricVal('');
                        setProdStatus('Demo Only');
                      }}
                      className="bg-blue-600 hover:bg-blue-550 text-white text-[11px] font-sans font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" /> ADD NEW CATALOG
                    </button>
                  </div>
                </div>

                {/* Editing state drawer */}
                {editingProductId && (
                  <form onSubmit={handleProductSubmit} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                    <h4 className="text-xs font-bold text-slate-800">
                      {editingProductId === 'new' ? 'Instantiate New Catalog Record' : 'Edit Specifications Record'}
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-semibold">
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-slate-550 font-sans mb-1 font-bold">Solution name</label>
                        <input
                          type="text"
                          value={prodTitle}
                          onChange={(e) => setProdTitle(e.target.value)}
                          className="w-full bg-white border border-slate-200 text-xs rounded px-2.5 py-1.5 text-slate-805 outline-none focus:border-blue-500 font-sans"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-slate-550 font-sans mb-1 font-bold">Strategic category / Vertical</label>
                        <input
                          type="text"
                          value={prodCat}
                          onChange={(e) => setProdCat(e.target.value)}
                          placeholder="e.g. Healthcare, Fintech"
                          className="w-full bg-white border border-slate-200 text-xs rounded px-2.5 py-1.5 text-slate-805 outline-none focus:border-blue-500 font-sans"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-slate-550 font-sans mb-1 font-bold">Architecture details & value proposition</label>
                      <textarea
                        rows={3}
                        value={prodDesc}
                        onChange={(e) => setProdDesc(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-xs rounded px-2.5 py-1.5 text-slate-805 outline-none focus:border-blue-500 font-sans font-semibold"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-semibold">
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-slate-550 font-sans mb-1 font-bold">KPI label</label>
                        <input
                          type="text"
                          value={prodMetricLab}
                          onChange={(e) => setProdMetricLab(e.target.value)}
                          placeholder="e.g. Reductions"
                          className="w-full bg-white border border-slate-200 text-xs rounded px-2.5 py-1.5 text-slate-805 outline-none focus:border-blue-500 font-sans"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-slate-550 font-sans mb-1 font-bold">KPI target value</label>
                        <input
                          type="text"
                          value={prodMetricVal}
                          onChange={(e) => setProdMetricVal(e.target.value)}
                          placeholder="e.g. 85%"
                          className="w-full bg-white border border-slate-200 text-xs rounded px-2.5 py-1.5 text-slate-805 outline-none focus:border-blue-500 font-sans"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-slate-550 font-sans mb-1 font-bold">Commit message (Required for Audit Trail)</label>
                        <input
                          type="text"
                          value={commitMessage}
                          onChange={(e) => setCommitMessage(e.target.value)}
                          placeholder="Briefly describe why this change is being made..."
                          className="w-full bg-white border border-slate-200 text-xs rounded px-2.5 py-1.5 text-slate-700 outline-none focus:border-blue-500 font-sans font-medium"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-slate-550 font-sans mb-1 font-bold">Launch status</label>
                        <select
                          value={prodStatus}
                          onChange={(e) => setProdStatus(e.target.value as any)}
                          className="w-full bg-white border border-slate-200 text-xs rounded px-2.5 py-1.5 text-slate-700 outline-none focus:border-blue-500 font-sans font-bold"
                        >
                          <option value="Live & Production">Live & Production</option>
                          <option value="MVP Complete">MVP Complete</option>
                          <option value="Demo Only">Demo Only</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setEditingProductId(null)}
                        className="text-[10px] font-mono px-3.5 py-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold"
                      >
                        CANCEL
                      </button>
                      <button
                        type="submit"
                        disabled={saving || commitMessage.trim().length === 0}
                        className="text-[10px] font-sans font-bold px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-550 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? 'UPDATING...' : 'COMMIT STAGED CHANGES'}
                      </button>
                    </div>
                  </form>
                )}

                {/* List products for edits */}
                <div className="space-y-3 font-semibold pb-4">
                  {products.map(prod => (
                    <div key={prod.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-slate-50/50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors gap-3">
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">{prod.title}</span>
                          <span className="text-[8.5px] font-sans font-bold uppercase bg-blue-50 px-2 py-0.5 border border-blue-100 rounded text-blue-700 leading-none">{prod.category}</span>
                        </div>
                        <span className="block text-[10px] text-slate-500 mt-1 truncate max-w-md">{prod.description}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleProductEditSelect(prod)}
                          className="text-[9px] font-sans font-bold text-blue-600 bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
                        >
                          EDIT
                        </button>
                        <button
                          onClick={() => handleDeleteProductClick(prod.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                          title="Decommission listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

              {/* WEBSITE MARKETING CMS CONTROLS card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                <h3 className="text-sm font-bold font-sans text-slate-200 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Sliders className="w-4.5 h-4.5 text-blue-600" /> Website Layout Copy CMS Blocks
                </h3>

                <div className="space-y-4">
                  {cmsBlocks.map(block => {
                    const isSelected = selectedBlockId === block.id;
                    return (
                      <div key={block.id} className="bg-slate-50/40 p-4 border border-slate-200 rounded-xl text-left space-y-3 font-semibold">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[9.5px] font-sans text-slate-400 block leading-none font-bold">KEY IDENTIFIER: {block.key}</span>
                            <span className="text-xs font-bold text-slate-850 block mt-1">{block.title}</span>
                          </div>
                          <span className="text-[8.5px] font-sans font-bold uppercase bg-blue-50 text-blue-750 px-2 py-0.5 border border-blue-100 rounded-full">{block.category}</span>
                        </div>

                        {isSelected ? (
                          <form onSubmit={(e) => handleCMSBlockSubmit(e, block)} className="space-y-2 pt-2">
                            <textarea
                              rows={3}
                              value={blockContent}
                              onChange={(e) => setBlockContent(e.target.value)}
                              className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs rounded-xl p-2.5 text-slate-805 outline-none leading-relaxed font-sans"
                            />
                            <div className="space-y-1">
                              <label className="block text-[9px] uppercase tracking-wider text-slate-550 font-sans mb-1 font-bold">Commit message (Audit Trail)</label>
                              <input
                                type="text"
                                value={commitMessage}
                                onChange={(e) => setCommitMessage(e.target.value)}
                                placeholder="Describe this content update..."
                                className="w-full bg-white border border-slate-200 text-xs rounded px-2.5 py-1.5 text-slate-700 outline-none focus:border-blue-500 font-sans font-medium"
                                required
                              />
                            </div>
                            <div className="flex gap-2 justify-end">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedBlockId(null);
                                  setCommitMessage('');
                                }}
                                className="text-[9px] font-mono px-3.5 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold"
                              >
                                CANCEL
                              </button>
                              <button
                                type="submit"
                                disabled={saving || commitMessage.trim().length === 0}
                                className="text-[9px] font-sans font-bold px-4 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-550 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {saving ? 'UPDATING...' : 'COMMIT STAGED CHANGES'}
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="flex items-start justify-between gap-4">
                            <p className="text-xs text-slate-500 leading-relaxed font-sans max-w-xl">{block.content}</p>
                            <button
                              onClick={() => handleCmsBlockSelect(block)}
                              className="text-[10px] font-sans font-bold text-blue-600 shrink-0"
                            >
                              EDIT VALUE
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: ADDITIONAL UTILITIES */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* INSTANTIATE SECURE CHANNELS OVERLAY */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm text-left">
                <h3 className="text-sm font-bold font-sans text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Hash className="w-4.5 h-4.5 text-blue-600" /> Dispatch Router Setup
                </h3>
                
                <p className="text-[10.5px] text-slate-500 font-sans leading-relaxed font-semibold">
                  Create secure, on-demand WebSocket channels and link them to clinical or financial partitions instantly.
                </p>

                <form onSubmit={handleChannelCreateSubmit} className="space-y-3 pt-2 font-semibold">
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-slate-500 font-mono mb-1 font-bold">Channel slug handle</label>
                    <input
                      type="text"
                      value={chanName}
                      onChange={(e) => setChanName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="e.g. clinical-talk"
                      className="w-full bg-white border border-slate-200 text-xs rounded-xl px-3 py-2.5 text-slate-800 font-mono focus:border-blue-500 hover:border-slate-300 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-slate-500 font-mono mb-1 font-bold font-bold">Scope focus explain</label>
                    <input
                      type="text"
                      value={chanDesc}
                      onChange={(e) => setChanDesc(e.target.value)}
                      placeholder="e.g. Clinical diagnosis triage sync"
                      className="w-full bg-white border border-slate-200 text-xs rounded-xl px-3 py-2.5 text-slate-705 focus:border-blue-500 hover:border-slate-300 outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving || !chanName}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-sans py-2.5 rounded-xl transition-all font-bold tracking-wider"
                  >
                    {saving ? 'INJECTING RE-ENTRY PORT...' : 'LAUNCH WEBSOCKET PORT'}
                  </button>
                </form>
              </div>

              {/* ACTIVE DISPATCH PORTS LIST */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm text-left pb-4">
                <h3 className="text-sm font-bold font-sans text-slate-800 border-b border-slate-100 pb-2">Operational Channels ({channels.length})</h3>
                <div className="space-y-2 font-mono text-[10.5px]">
                  {channels.map(chan => (
                    <div key={chan.id} className="flex justify-between items-center p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold">
                      <span className="text-slate-850">#{chan.name}</span>
                      <span className="text-[8px] font-sans text-blue-700 bg-blue-50 px-2.5 py-0.5 border border-blue-100 rounded-xl uppercase">
                        {chan.isStatic ? 'Permanent' : 'Dynamic'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        ) : (
          <motion.div
            key="audits-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* SYSTEM HEALTH WIDGET PANEL */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
                  <Clock className="w-5 h-5 shrink-0" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500 block leading-none font-bold">SYSTEM UPTIME</span>
                  <span className="text-sm font-semibold dark:text-slate-200 block mt-1.5 font-mono select-all">
                    {healthData ? formatUptimeValue(healthData.uptime) : 'Loading...'}
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl relative">
                  <Activity className="w-5 h-5 shrink-0" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-slate-900 animate-pulse"></span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500 block leading-none font-bold">TUNNEL LATENCY</span>
                  <span className="text-sm font-semibold dark:text-slate-200 block mt-1.5 font-mono">
                    {healthData ? `${healthData.latency} ms` : '6 ms'}
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  <Layers className="w-5 h-5 shrink-0" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500 block leading-none font-bold">ACTIVE TUNNEL NODES</span>
                  <span className="text-sm font-semibold dark:text-slate-200 block mt-1.5 font-mono">
                    {healthData ? `${healthData.connections} sessions` : '3 sessions'}
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-605 dark:text-indigo-400 rounded-xl">
                  <Cpu className="w-5 h-5 shrink-0" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500 block leading-none font-bold">CPU & MEMORY LOAD</span>
                  <span className="text-xs font-semibold dark:text-slate-200 block mt-1.5 font-mono">
                    {healthData ? `CPU: ${healthData.cpuLoad}% | RAM: ${healthData.memoryUtilization}%` : 'CPU: 3.4% | RAM: 45.4%'}
                  </span>
                </div>
              </div>
            </div>

            {/* Audit Logs Controls / Header bar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div className="relative flex-1 max-w-md font-semibold">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Search className="w-4.5 h-4.5" />
                </span>
                <input
                  type="text"
                  value={logFilter}
                  onChange={(e) => setLogFilter(e.target.value)}
                  placeholder="Filter by operator, category, action detail..."
                  className="w-full bg-slate-50 dark:bg-slate-800 dark:text-slate-100 hover:border-slate-350 dark:hover:border-slate-700 border border-slate-200 dark:border-slate-700 focus:border-blue-500 text-xs rounded-xl pl-10 pr-4 py-2.5 outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={handleExportAuditsCSV}
                  className="bg-emerald-600 hover:bg-emerald-505 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white text-xs font-sans font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 hover:scale-103 transition-all select-none shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  EXPORT CSV
                </button>

                <button
                  type="button"
                  onClick={fetchAuditLogs}
                  disabled={loadingLogs}
                  className="bg-slate-900 dark:bg-slate-800 text-white text-xs font-sans font-bold px-4 py-2.5 border border-slate-705 dark:border-slate-700 rounded-xl flex items-center gap-1.5 hover:bg-slate-800 hover:scale-105 transition-all select-none shadow-xs disabled:opacity-40"
                >
                  <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${loadingLogs ? 'animate-spin' : ''}`} />
                  REFRESH LOGS
                </button>
              </div>
            </div>

            {/* Audit list container */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-secondary dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex items-center justify-between select-none">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-sans font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                  <span>System Activity Dashboard ({filteredLogs.length} events logged)</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500">SHA-256 Crypto Verification Protocol Enabled</span>
              </div>

              {filteredLogs.length === 0 ? (
                <div className="p-16 text-center text-slate-505 dark:text-slate-400 font-sans text-xs">
                  No operational records found matching filter constraints inside active HSM databases.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-150 dark:border-slate-800 text-[10px] font-sans font-bold text-slate-4:00 dark:text-slate-500 uppercase select-none">
                        <th className="p-3.5 pl-6">TIMESTAMP UTC</th>
                        <th className="p-3.5">EVENT ACTION</th>
                        <th className="p-3.5">OPERATOR LINK</th>
                        <th className="p-3.5 pr-6">TRANSCRIPT METRICS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      {filteredLogs.map(log => {
                        const isPrimary = log.action.includes('Boot') || log.action.includes('Success');
                        const isCreateOrUpdate = log.action.includes('Create') || log.action.includes('Update') || log.action.includes('Onboarding');
                        return (
                          <tr key={log.id} className="hover:bg-slate-50/55 dark:hover:bg-slate-800/40 transition-colors font-sans text-xs text-slate-700 dark:text-slate-300">
                            <td className="p-3.5 pl-6 font-mono text-[10px] text-slate-450 dark:text-slate-500 whitespace-nowrap">
                              {new Date(log.timestamp).toLocaleString()}
                            </td>
                            <td className="p-3.5 whitespace-nowrap">
                              <span className={`text-[9px] font-mono px-2.5 py-0.5 border rounded-xl uppercase font-bold tracking-tight ${
                                isPrimary 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900' 
                                  : isCreateOrUpdate 
                                  ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900' 
                                  : 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900'
                              }`}>
                                {log.action}
                              </span>
                            </td>
                            <td className="p-3.5 font-mono text-[10.5px] text-blue-700 dark:text-blue-400 font-bold whitespace-nowrap">
                              @{log.username}
                            </td>
                            <td className="p-3.5 pr-6 text-slate-605 dark:text-slate-400 font-mono text-[11px] leading-relaxed break-all">
                              {log.detail}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
