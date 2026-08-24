import React, { useState, useEffect, useRef } from 'react';
import { Product, CaseStudy, CMSBlock } from '../types';
import { 
  Activity, Stethoscope, MessageSquare, FileSpreadsheet, Wallet, 
  BarChart3, GraduationCap, PieChart, ArrowUpRight, CheckCircle2, 
  Sparkles, Award, Shield, Cpu, RefreshCw, Layers, Network, Info, Link2, ExternalLink, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as d3 from 'd3';

interface ShowcaseViewProps {
  products: Product[];
  caseStudies: CaseStudy[];
  cmsBlocks: CMSBlock[];
  onTriggerDemo: (room: string) => void;
}

// Icon helper mapping strings to Lucide icon components
export const IconMapper: Record<string, React.ComponentType<any>> = {
  Activity,
  Stethoscope,
  MessageSquare,
  FileSpreadsheet,
  Wallet,
  BarChart3,
  GraduationCap,
  PieChart,
  Cpu,
};

interface NetworkNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: 'core' | 'healthcare' | 'fintech' | 'module';
  caseStudyId?: string;
  group: number;
}

interface NetworkLink extends d3.SimulationLinkDatum<NetworkNode> {
  source: string;
  target: string;
  value: number;
}

export default function ShowcaseView({ products, caseStudies, cmsBlocks, onTriggerDemo }: ShowcaseViewProps) {
  const [selectedDomain, setSelectedDomain] = useState<'All' | 'Healthcare' | 'FinTech' | 'Conversational' | 'PropTech'>('All');
  
  // Product Comparison State
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // D3 Selection State
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>('case-labaid-care-tele');
  const [selectedNodeName, setSelectedNodeName] = useState<string>('Labaid Care Telehealth');
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Filter products by domain categories
  const filteredProducts = products.filter(p => {
    if (selectedDomain === 'All') return true;
    if (selectedDomain === 'Healthcare') return p.category.includes('Healthcare');
    if (selectedDomain === 'FinTech') return p.category.includes('Fintech') || p.category.includes('Wallet');
    if (selectedDomain === 'Conversational') return p.category.includes('Conversational');
    if (selectedDomain === 'PropTech') return p.category.includes('PropTech') || p.category.includes('Business');
    return true;
  });

  // Fetch CMS strings
  const getCmsContent = (key: string, fb: string) => {
    return cmsBlocks.find(b => b.key === key)?.content || fb;
  };

  const getCmsTitle = (key: string, fb: string) => {
    return cmsBlocks.find(b => b.key === key)?.title || fb;
  };

  const topStats = [
    { label: 'Telehealth Waiting Wait Times', value: '85% Reduction', desc: 'Compressed from 3 weeks to under 24 hours in Labaid Care clinical trials.' },
    { label: 'Early Malignant Detection', value: '+40% Clinical Rate', desc: 'Powered by 3D Convolutional prescription models.' },
    { label: 'Consumer Call Auto-Deflection', value: '70% Deflected', desc: 'Through Bangla & Banglish dialectic speech engines.' },
    { label: 'Banking Document Audits', value: '95.6% OCR Pass', desc: 'Maker-checker flow with on-prem data protection compliance.' }
  ];

  // Dynamic D3.js Network Topology Engine
  useEffect(() => {
    if (!svgRef.current) return;

    // Clear existing children from re-render cycles
    d3.select(svgRef.current).selectAll('*').remove();

    const width = 600;
    const height = 330;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', '100%');

    // Network definitions
    const nodes: NetworkNode[] = [
      { id: 'core', name: 'Cognitive Enterprise Core', type: 'core', group: 0 },
      { id: 'healthcare', name: 'Clinical NLP Router', type: 'module', group: 1 },
      { id: 'fintech', name: 'Handshake Ledger Engine', type: 'module', group: 2 },
      
      // Case Nodes
      { id: 'node-labaid-care-tele', name: 'Labaid Care Telehealth', type: 'healthcare', caseStudyId: 'case-labaid-care-tele', group: 1 },
      { id: 'node-e-doc-diagnostics', name: 'E-Doc Diagnostics', type: 'healthcare', caseStudyId: 'case-e-doc-diagnostics', group: 1 },
      { id: 'node-payoneer-bangla-speech', name: 'Payoneer Dialectic Voice', type: 'fintech', caseStudyId: 'case-payoneer-bangla-speech', group: 2 },
      { id: 'node-bkash-smart-audit', name: 'bKash Auto Audit', type: 'fintech', caseStudyId: 'case-bkash-smart-audit', group: 2 }
    ];

    const links: NetworkLink[] = [
      { source: 'core', target: 'healthcare', value: 3 },
      { source: 'core', target: 'fintech', value: 3 },
      { source: 'healthcare', target: 'node-labaid-care-tele', value: 2 },
      { source: 'healthcare', target: 'node-e-doc-diagnostics', value: 2 },
      { source: 'fintech', target: 'node-payoneer-bangla-speech', value: 2 },
      { source: 'fintech', target: 'node-bkash-smart-audit', value: 2 }
    ];

    // Force simulation configurations
    const simulation = d3.forceSimulation<NetworkNode>(nodes)
      .force('link', d3.forceLink<NetworkNode, NetworkLink>(links).id(d => d.id).distance(75))
      .force('charge', d3.forceManyBody().strength(-150))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(22));

    // Render connecting links
    const link = svg.append('g')
      .attr('stroke', '#cbd5e1')
      .attr('stroke-opacity', 0.5)
      .attr('stroke-width', 1.5)
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke-dasharray', (d: any) => d.value > 2 ? 'none' : '4 3');

    // Create container groups for interactive nodes
    const node = svg.append('g')
      .selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        if (d.caseStudyId) {
          setSelectedCaseId(d.caseStudyId);
          setSelectedNodeName(d.name);
        }
      })
      .call(d3.drag<SVGGElement, NetworkNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    // Glowing auras
    node.filter(d => d.type === 'core' || d.caseStudyId !== undefined)
      .append('circle')
      .attr('r', d => d.type === 'core' ? 14 : 9)
      .attr('fill', d => d.type === 'core' ? '#3b82f6' : d.type === 'healthcare' ? '#10b981' : '#8b5cf6')
      .attr('opacity', 0.15)
      .attr('class', 'animate-pulse');

    // Core circles
    node.append('circle')
      .attr('r', d => d.type === 'core' ? 8 : d.caseStudyId ? 6 : 5)
      .attr('fill', d => {
        if (d.type === 'core') return '#2563eb';
        if (d.type === 'healthcare') return '#10b981';
        if (d.type === 'fintech') return '#8b5cf6';
        return '#475569';
      })
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1.5);

    // Dynamic clean text labels
    node.append('text')
      .attr('dx', d => d.type === 'core' ? 12 : 9)
      .attr('dy', '.35em')
      .text(d => d.name)
      .attr('font-size', '8.5px')
      .attr('font-family', 'ui-monospace, monospace')
      .attr('font-weight', d => d.type === 'core' ? '800' : '650')
      .attr('fill', d => d.id === `node-${selectedCaseId}` ? '#1e3a8a' : '#475569');

    // Drag handlers
    function dragstarted(event: any, d: NetworkNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: NetworkNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: NetworkNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Tick callbacks
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('transform', (d: any) => `translate(${d.x}, ${d.y})`);
    });

  }, [selectedCaseId]);

  // Find matching case Study record
  const currentCaseDetail = caseStudies.find(cs => cs.id === selectedCaseId);

  return (
    <div className="space-y-16 py-6 pb-16">
      
      {/* Dynamic Jumbotron Hero Section */}
      <section className="text-center max-w-4xl mx-auto px-4 mt-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full text-blue-705 text-xs font-sans font-semibold mb-6 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-blue-600" />
          <span>PROPRIETARY COGNITIVE INFRASTRUCTURE · FINTECH & MEDICINE</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold font-sans tracking-tight text-slate-900 leading-none"
        >
          {getCmsContent('hero_title', 'Enterprise AI Engineering. Crafted for Scale.')}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-6 text-base sm:text-lg text-slate-600 font-sans max-w-2xl mx-auto leading-relaxed"
        >
          {getCmsContent('hero_subtitle', 'We design, deploy, and maintain world-class autonomous intelligence systems across Healthcare Providers, Fintech Platforms, and Commercial Analytics.')}
        </motion.p>

        {/* Dynamic Launch Buttons */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <button 
            onClick={() => onTriggerDemo('chan-general')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-550 text-white font-sans text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-md shadow-blue-100 hover:-translate-y-0.5 active:translate-y-0"
          >
            Launch Encrypted Chatroom
            <ArrowUpRight className="w-4 h-4" />
          </button>
          <a 
            href="#network-topology"
            className="flex items-center bg-white border border-slate-200 hover:border-slate-300 text-slate-755 font-sans text-xs font-bold px-5 py-3 rounded-xl transition-all hover:bg-slate-50/80"
          >
            Explore Interactive Map
          </a>
        </motion.div>
      </section>

      {/* Corporate Impact Metrics Board */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
        {topStats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between hover:scale-101 hover:shadow-sm hover:border-slate-300 transition-all group"
          >
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider font-bold block mb-2">{stat.label}</span>
              <h3 className="text-2xl font-bold font-sans text-blue-600 tracking-tight group-hover:text-blue-750 transition-colors">{stat.value}</h3>
            </div>
            <p className="text-[11px] text-slate-500 font-sans mt-3 border-t border-slate-100 pt-3 leading-relaxed">{stat.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* HIGH FIDELITY D3.JS NETWORK TOPOLOGY VIEW MAP */}
      <section id="network-topology" className="max-w-7xl mx-auto px-4 space-y-6 scroll-mt-6 text-left">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-[10px] uppercase font-mono text-blue-600 tracking-widest block mb-1 font-bold">TOPOLOGICAL INFRASTRUCTURE VISUALIZATION</span>
          <h2 className="text-2xl font-bold font-sans text-slate-900 tracking-tight flex items-center gap-2">
            <Network className="w-6 h-6 text-blue-600 shrink-0" /> AI-Powered Solutions Map
          </h2>
          <p className="text-xs text-slate-500 font-sans mt-1">Drag nodes to test load balance. Click on healthcare or fintech nodes to review real co-engineered diagnostic cases.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* D3 FORCE LINK GRAPH SECTION */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-450 font-bold select-none">
              <span>MAPPED SYSTEMS COHERENCE CLUSTERING</span>
              <span className="text-blue-600 flex items-center gap-1">
                <Info className="w-3.5 h-3.5" /> INTERACTIVE NODES
              </span>
            </div>
            
            <div className="w-full h-[330px] rounded-xl overflow-hidden bg-white border border-slate-200 relative">
              <svg 
                ref={svgRef} 
                className="w-full h-full select-none"
              />
              <div className="absolute bottom-3 left-3 bg-white/95 border border-slate-150 rounded-lg p-2 text-[9px] font-mono text-slate-500 flex gap-4 shadow-sm font-bold">
                <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-600 border" /> Core Hub</div>
                <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border" /> Medicine</div>
                <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 border" /> FinTech</div>
              </div>
            </div>
          </div>

          {/* DYNAMIC CASE DRILLDOWN DISPLAY SIDEBAR */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              {currentCaseDetail ? (
                <motion.div
                  key={currentCaseDetail.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-slate-200 p-6 rounded-2xl space-y-5 shadow-sm text-left font-semibold"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-[10px] uppercase font-mono text-slate-400 font-bold tracking-wider">ACTIVE NODE SELECTED</span>
                    <span className="text-[9px] font-mono bg-blue-50 text-blue-700 px-2.5 py-0.5 border border-blue-105 rounded font-bold uppercase">
                      {currentCaseDetail.status}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-blue-600 font-bold block">CASE PROFILE</span>
                    <h3 className="text-base font-bold font-sans text-slate-800 tracking-tight mt-1">{currentCaseDetail.title}</h3>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">Corporate Client: {currentCaseDetail.client}</p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div>
                      <h4 className="text-[10px] uppercase font-sans tracking-wider text-slate-500 font-bold mb-1.5 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" /> Operational Challenge
                      </h4>
                      <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600 font-sans">
                        {currentCaseDetail.challenge?.map((ch, i) => <li key={i}>{ch}</li>)}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-[10px] uppercase font-sans tracking-wider text-blue-600 font-bold mb-1.5 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-blue-500" /> Co-Engineered Solution
                      </h4>
                      <ul className="list-disc pl-4 space-y-1 text-xs text-slate-650 font-sans">
                        {currentCaseDetail.solution?.map((sol, i) => <li key={i}>{sol}</li>)}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-slate-150">
                      <h4 className="text-[10px] uppercase font-sans tracking-widest text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-emerald-600 animate-pulse" /> Measured Outcomes
                      </h4>
                      <ul className="list-disc pl-4 space-y-1 text-xs text-emerald-700 font-sans font-bold">
                        {currentCaseDetail.results?.map((res, i) => <li key={i}>{res}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        const demoRoom = currentCaseDetail.title.includes('Labaid') || currentCaseDetail.title.includes('Diagnostics')
                          ? 'chan-healthcare'
                          : 'chan-fintech';
                        onTriggerDemo(demoRoom);
                      }}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-sans font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
                    >
                      <span>LAUNCH SECURE PACKET ROUTER FOR THIS NODE</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl text-center text-xs text-slate-400 font-sans font-bold py-16">
                  Select an active node inside the D3 map network to mount diagnostic case reports.
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* Interactive Domain Explorer Mapping Engine */}
      <section className="max-w-7xl mx-auto px-4 space-y-8 scroll-mt-6 text-left">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-5">
          <div>
            <span className="text-[10px] uppercase font-mono text-blue-600 tracking-widest block mb-1 font-bold">INDEX DIRECTORY REPOSITORY</span>
            <h2 className="text-2xl font-bold font-sans text-slate-900 tracking-tight">Active Solutions Directory</h2>
            <p className="text-xs text-slate-500 font-sans mt-1 font-medium">Select an operational domain sector to isolate proprietary modules</p>
          </div>
          
          {/* Filtering Pillars */}
          <div className="flex flex-wrap gap-1.5 mt-4 md:mt-0 bg-white p-1 border border-slate-200 rounded-xl shadow-xs">
            {(['All', 'Healthcare', 'FinTech', 'Conversational', 'PropTech'] as const).map(domain => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className={`text-[9.5px] font-sans font-bold tracking-wider px-3.5 py-1.5 rounded-lg transition-all ${
                  selectedDomain === domain 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
                }`}
              >
                {domain.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Modular Grid Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const CurrentIcon = IconMapper[product.icon] || Cpu;
            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-sm p-6 rounded-2xl flex flex-col justify-between group relative transition-all shadow-xs text-left"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 border border-blue-100 text-blue-600 rounded-xl flex items-center justify-center shadow-xs">
                        <CurrentIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      </div>
                      <div>
                        <span className="text-[9px] font-sans font-bold text-blue-600 px-2.5 py-0.5 rounded bg-blue-50 border border-blue-100 uppercase tracking-wider">
                          {product.category}
                        </span>
                        <h3 className="text-sm font-bold font-sans text-slate-850 mt-1.5 group-hover:text-blue-600 transition-colors">
                          {product.title}
                        </h3>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <span className={`text-[8.5px] font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shrink-0 ${
                      product.status === 'Live & Production' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : product.status === 'MVP Complete' 
                        ? 'bg-amber-50 text-amber-700 border-amber-100' 
                        : 'bg-blue-50 text-blue-700 border-blue-100'
                    }`}>
                      {product.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-4 leading-relaxed font-sans line-clamp-3 font-semibold">
                    {product.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-100">
                    <div>
                      <span className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-wider block">
                        {product.metricLabel}
                      </span>
                      <span className="text-lg font-extrabold font-sans text-slate-800 tracking-tight block mt-0.5">
                        {product.metricValue}
                      </span>
                    </div>

                    <div className="space-y-1.5 font-semibold">
                      <span className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-wider block">
                        Key KPI Milestones
                      </span>
                      {product.impactMetrics?.slice(0, 2).map((im, i) => (
                        <div key={i} className="flex justify-between text-[10px] font-mono leading-none">
                          <span className="text-slate-500 truncate max-w-[100px]">{im.label}</span>
                          <span className="text-blue-600 font-bold">{im.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                 <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => {
                      const demoRoom = product.category.includes('Healthcare') 
                        ? 'chan-healthcare' 
                        : product.category.includes('Fintech') || product.category.includes('Wallet')
                        ? 'chan-fintech'
                        : 'chan-general';
                      onTriggerDemo(demoRoom);
                    }}
                    className="flex-1 bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-100 hover:text-blue-750 text-slate-600 text-[11px] font-sans font-bold py-2.5 rounded-xl transition-all shadow-xs"
                  >
                    CONNECT LIVE
                  </button>
                  <button
                    onClick={() => {
                      if (compareIds.includes(product.id)) {
                        setCompareIds(compareIds.filter(id => id !== product.id));
                      } else if (compareIds.length < 3) {
                        setCompareIds([...compareIds, product.id]);
                        setShowCompareModal(true);
                      }
                    }}
                    className={`p-2.5 rounded-xl border transition-all ${
                      compareIds.includes(product.id)
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-100'
                    }`}
                    title={compareIds.includes(product.id) ? 'Remove from comparison' : 'Add to comparison (Max 3)'}
                  >
                    <RefreshCw className={`w-4 h-4 ${compareIds.includes(product.id) ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Case Studies Accordion & Multi-Domain Results */}
      <section className="bg-white border-y border-slate-200 py-12 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-10">
          <div className="text-center">
            <span className="text-[10px] uppercase font-mono text-blue-600 tracking-widest block mb-1 font-bold">PROVEN DEPLOYMENTS</span>
            <h2 className="text-2xl font-bold font-sans text-slate-900 tracking-tight">Enterprise Success Paradigms</h2>
            <p className="text-xs text-slate-550 max-w-md mx-auto mt-1 font-sans font-medium">Empirical records validating early stage diagnostic screening and fintech compliance speeds</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {caseStudies.map((caseStudy) => {
              return (
                <div 
                  key={caseStudy.id}
                  className="bg-slate-50/50 border border-slate-200 hover:border-slate-350 hover:bg-white p-6 rounded-2xl flex flex-col justify-between transition-all shadow-xs group text-left"
                >
                  <div>
                    <div className="flex items-center justify-between pointer-events-none mb-3">
                      <span className="text-[9px] font-sans tracking-wider font-bold text-emerald-700 uppercase px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
                        {caseStudy.status}
                      </span>
                      <span className="text-[10px] font-sans font-bold text-slate-400">
                        Duration: {caseStudy.duration}
                      </span>
                    </div>

                    <h3 className="text-base font-bold font-sans text-slate-800 tracking-tight mb-1 group-hover:text-blue-600 transition-colors">
                      {caseStudy.title}
                    </h3>
                    <p className="text-[11px] font-sans text-blue-600 font-bold">
                      Client: {caseStudy.client}
                    </p>
                    
                    {/* Accordion Detail Panel */}
                    <div className="space-y-4 mt-6">
                      <div>
                        <h4 className="text-[10px] uppercase font-sans tracking-wider text-slate-500 font-bold mb-2 flex items-center gap-1.5 bg-transparent">
                          <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" /> Operational Challenge
                        </h4>
                        <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600 font-sans">
                          {caseStudy.challenge?.map((ch, i) => <li key={i}>{ch}</li>)}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-[10px] uppercase font-sans tracking-wider text-blue-600 font-bold mb-2 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-blue-500" /> Coengineered Solution
                        </h4>
                        <ul className="list-disc pl-4 space-y-1 text-xs text-slate-650 font-sans">
                          {caseStudy.solution?.map((sol, i) => <li key={i}>{sol}</li>)}
                        </ul>
                      </div>

                      <div className="pt-3 border-t border-slate-200">
                        <h4 className="text-[10px] uppercase font-sans tracking-widest text-slate-800 font-bold mb-2 flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-emerald-600 animate-pulse" /> Measured Outcomes
                        </h4>
                        <ul className="list-disc pl-4 space-y-1 text-xs text-emerald-700 font-sans font-bold">
                          {caseStudy.results?.map((res, i) => <li key={i}>{res}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Compliance & Mandate static widget with CMS controls */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <div className="inline-flex w-10 h-10 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full items-center justify-center shadow-xs">
          <Shield className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-bold font-sans text-slate-800 tracking-tight">
          {getCmsTitle('ethics_compliance', 'Ethics, Privacy & Regulatory Compliance')}
        </h3>
        <p className="text-xs text-slate-600 font-sans leading-relaxed max-w-2xl mx-auto font-medium">
          {getCmsContent('ethics_compliance', 'Ethics Guidelines: All AI Innovations platforms are engineered with respect for data privacy and clinical data guidelines. We implement enterprise AES-256 TLS networks, human-in-the-loop validation checkpoints, and locally sovereign database storage options.')}
        </p>
      </section>

      {/* Comparison Modal Overlay */}
      <AnimatePresence>
        {showCompareModal && compareIds.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden border border-slate-200"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 font-sans">Multi-Module Specs Comparison</h2>
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Side-by-side Architectural Audit</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCompareModal(false)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
                >
                  <ExternalLink className="w-5 h-5 rotate-45" />
                </button>
              </div>

              <div className="p-6 overflow-x-auto">
                <div className="grid grid-cols-4 gap-4 min-w-[700px]">
                  <div className="space-y-4 pt-12">
                    {['Category', 'Status', 'Primary Metric', 'Value Prop'].map(label => (
                      <div key={label} className="h-10 flex items-center border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {label}
                      </div>
                    ))}
                  </div>

                  {compareIds.map(id => {
                    const product = products.find(p => p.id === id);
                    if (!product) return null;
                    return (
                      <div key={id} className="space-y-4 border border-slate-100 rounded-2xl p-4 bg-slate-50/30">
                        <div className="h-12 flex flex-col justify-center">
                          <h4 className="text-xs font-black text-slate-800 leading-tight line-clamp-2">{product.title}</h4>
                        </div>
                        <div className="h-10 flex items-center border-b border-slate-100 text-[11px] font-bold text-blue-600">
                          {product.category}
                        </div>
                        <div className="h-10 flex items-center border-b border-slate-100">
                           <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-600">
                            {product.status}
                           </span>
                        </div>
                        <div className="h-10 flex items-center border-b border-slate-100 text-xs font-black text-slate-900">
                          {product.metricValue} {product.metricLabel}
                        </div>
                        <div className="text-[10px] text-slate-500 font-sans leading-relaxed line-clamp-4">
                          {product.description}
                        </div>
                        <div className="pt-4">
                          <button 
                            onClick={() => setCompareIds(compareIds.filter(cid => cid !== id))}
                            className="w-full py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-red-500 hover:bg-red-50 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {compareIds.length < 3 && (
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
                      <Plus className="w-8 h-8 text-slate-300 mb-2" />
                      <p className="text-[10px] font-bold text-slate-400 uppercase px-4 leading-relaxed">
                        Select another solution from the index to populate slot
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                 <button 
                  onClick={() => {
                    setCompareIds([]);
                    setShowCompareModal(false);
                  }}
                  className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 text-[11px] font-bold rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Clear Selection
                </button>
                <button 
                  onClick={() => setShowCompareModal(false)}
                  className="px-8 py-2.5 bg-blue-600 text-white text-[11px] font-bold rounded-xl hover:bg-blue-550 transition-colors shadow-lg shadow-blue-100"
                >
                  Close Audit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
