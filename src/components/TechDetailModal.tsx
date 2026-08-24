import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Award, Zap, Terminal, Sparkles, Code, Cpu } from 'lucide-react';

export interface TechDetail {
  title: string;
  category: string;
  tagline: string;
  proficiencyScore: number; // 0 to 100
  proficiencyLevel: string; // e.g. "Elite Core Mastery"
  proficiencyDescription: string;
  solutionProposal: string;
  keyAestheticBenefit: string;
  features: string[];
}

export const TECH_DETAILS: Record<string, TechDetail> = {
  // FRONTEND
  'React': {
    title: 'React',
    category: 'Frontend Engineering',
    tagline: 'High-Density Component-Driven Architecture',
    proficiencyScore: 98,
    proficiencyLevel: 'Elite Core Mastery',
    proficiencyDescription: 'Our developers have built enterprise-level SPAs and complex client interfaces since React 15. We maintain a strict focus on virtual DOM cycle optimizations, concurrent rendering modes, state-isolation patterns, and custom hook utility designs.',
    solutionProposal: 'We propose React to establish interactive, componentized interfaces that scale beautifully. By decoupling presentation layouts from severe business mutations, we ensure application durability, modular extensibility, and rapid feature execution of critical user dashboards.',
    keyAestheticBenefit: 'Instant GUI updates, frictionless input controls, and granular structural animation lifecycles.',
    features: ['Concurrent UI Rendering Pipelines', 'Granular State Isolation & Memoization', 'Custom Performance Telemetry Hooks']
  },
  'Next.js': {
    title: 'Next.js',
    category: 'Frontend Engineering',
    tagline: 'Hybrid SSG/SSR Enterprise Frame Workloads',
    proficiencyScore: 96,
    proficiencyLevel: 'Production Heavy Enterprise',
    proficiencyDescription: 'Deep native integration with App Router, server action optimization, client rendering boundaries, hydration latency controls, and dynamic ISR (Incremental Static Regeneration) structures.',
    solutionProposal: 'For business platforms targeting high organic search discoverability and fast page loads, we propose Next.js as the primary framework. It delivers optimized static page outputs with sub-100ms hydration timings, improving Core Web Vitals to maximize search engine indexing and customer engagement.',
    keyAestheticBenefit: 'No layout shifts, extremely fast content load indices, and fluid navigation states.',
    features: ['Static Generation (SSG) & Edge Cache Routing', 'App Router Server Components Core', 'Optimized Image & Font Resource Engines']
  },
  'Vue.js': {
    title: 'Vue.js',
    category: 'Frontend Engineering',
    tagline: 'Reactive Composability for Lightweight Pipelines',
    proficiencyScore: 92,
    proficiencyLevel: 'Expert Operational Depth',
    proficiencyDescription: 'Full expertise in the Vue Composition API, Pinia system state management, Vite rendering, and modular Single File Components (SFCs).',
    solutionProposal: 'We recommend Vue.js for high-speed lightweight SaaS products where quick development velocity and small bundle sizes are absolute priorities. Vue’s streamlined reactivity model avoids overhead, making it ideal for real-time analytics panels and reactive tools.',
    keyAestheticBenefit: 'Ultra-low runtime memory footprint & predictable fluid rendering behavior.',
    features: ['SFC Composition Architecture', 'Optimized Pinia Store synchronization', 'Reactive Virtual DOM micro-adjustments']
  },
  'TypeScript': {
    title: 'TypeScript',
    category: 'Frontend Engineering',
    tagline: 'Strict Static Compilation & Absolute Type Integration',
    proficiencyScore: 105, // Extra high to denote extreme commitment
    proficiencyLevel: 'Absolute Engineering Protocol',
    proficiencyDescription: 'Our primary tool for typed excellence. We strictly enforce rigid ESLint configurations, zero-any declarations, comprehensive discriminated union mapping, generics abstraction, and compile-time defensive safety checks.',
    solutionProposal: 'We require TypeScript across all core architectures. It turns latent architectural errors into direct compiling barriers, drastically saving testing cycles and giving enterprise clients absolute confidence that our platform will run predictably.',
    keyAestheticBenefit: 'Bulletproof UI responses and error-free client state translations.',
    features: ['Generics & Discriminated Unions', 'Self-Documenting Code Interfaces', 'Comprehensive Compile-Time Defenses']
  },
  'Tailwind CSS': {
    title: 'Tailwind CSS',
    category: 'Frontend Engineering',
    tagline: 'Swiss-Modern Utilitarian Layout Layouts',
    proficiencyScore: 99,
    proficiencyLevel: 'Aesthetic Standard Core',
    proficiencyDescription: 'We build responsive utility sets directly from custom Tailwind themes using exact Swiss grid proportions, variable font tokens, strict variable mappings, and performance-optimized purge rules.',
    solutionProposal: 'We propose Tailwind to eliminate bloating CSS files. By compiling only the exact utility styling rules active in the system, it reduces transfer payloads, leading to lightning-fast load times while maintaining visual consistency on any device viewport.',
    keyAestheticBenefit: 'Absolute pixel-perfect layouts, responsive design consistency, and clean negative space layout rhythms.',
    features: ['Dynamic Media Breakpoint Systems', 'Custom Semantic Theme Mappings', 'Sub-millisecond Browser Layout Calculations']
  },
  'Three.js': {
    title: 'Three.js',
    category: 'Frontend Engineering',
    tagline: 'Immersive Real-Time WebGL Visualizations',
    proficiencyScore: 88,
    proficiencyLevel: 'Advanced Interactive Core',
    proficiencyDescription: 'WebGL rendering optimization, Custom Shader Material configurations, low-level render pipeline balancing, responsive geometry scaling, and React Three Fiber integration.',
    solutionProposal: 'For clients in real-estate, manufacturing, or interactive retail, we use Three.js to construct high-performance 3D models direct inside browser viewports, enabling interactive product customization, physical simulation, and deep digital engagement.',
    keyAestheticBenefit: 'Ultra smooth 60fps WebGL rendering, ambient shadows, and beautiful spatial transformations.',
    features: ['GPU-accelerated viewport render pools', 'Custom GLSL shaders & lighting models', 'Interactive Raycasting & Collision controls']
  },

  // BACKEND
  'Node.js': {
    title: 'Node.js',
    category: 'Backend Architecture',
    tagline: 'High-Concurrency Event-Driven Execution',
    proficiencyScore: 97,
    proficiencyLevel: 'Elite Core Mastery',
    proficiencyDescription: 'Non-blocking I/O orchestration, cluster-level scaling configurations, custom event loop tracking, native stream integrations, and optimized V8 engine execution environments.',
    solutionProposal: 'We propose Node.js for heavy, high-volume real-time services like communication gateways, streaming servers, and transaction-intensive SaaS products. Its event-driven architecture handles thousands of concurrent packets effortlessly with very low overhead.',
    keyAestheticBenefit: 'Sub-millisecond Server response times and ultra-responsive real-time data streaming.',
    features: ['Non-blocking asynchronous I/O loops', 'Native stream memory optimization pipelines', 'Worker Thread cluster pool scaling']
  },
  'Python': {
    title: 'Python',
    category: 'Backend Architecture',
    tagline: 'Data Processing, Automation & Inference Engines',
    proficiencyScore: 94,
    proficiencyLevel: 'Expert Operational Depth',
    proficiencyDescription: 'Rich scripting, ETL process designs, custom API microservices (FastAPI/Django), machine learning inference orchestration, and deep statistical math computation.',
    solutionProposal: 'For ML-driven solutions, scheduled backend automations, and deep parsing layers, we leverage Python. By pairing modular FastAPI gateways with high-intensity vector compute engines, we deliver lightning-fast data processing pipelines.',
    keyAestheticBenefit: 'Structured and highly reliable transactional processing systems.',
    features: ['FastAPI asynchronous endpoint networks', 'Modular statistical calculations algorithms', 'Robust background thread processing']
  },
  'Rust': {
    title: 'Rust',
    category: 'Backend Architecture',
    tagline: 'Memory-Safe Systems Programming without Overhead',
    proficiencyScore: 89,
    proficiencyLevel: 'Advanced Engineering Core',
    proficiencyDescription: 'Zero-cost abstractions, robust memory ownership guarantees, concurrency implementations with multithread safety, high-performance binary compilations, and WebAssembly pipelines.',
    solutionProposal: 'For microservices processing millions of concurrent cryptographic packages, financial calculations, or sub-millisecond edge routes, we write low-overhead, memory-safe services in Rust to eliminate crashes, memory leaks, and GC stalls entirely.',
    keyAestheticBenefit: 'Ultimate processing persistence, strict security standards, and zero lag overhead.',
    features: ['Zero-garbage collector execution speeds', 'Compile-time memory safety boundary checks', 'Ultra-high-density atomic execution pools']
  },
  'NestJS': {
    title: 'NestJS',
    category: 'Backend Architecture',
    tagline: 'Enterprise-Grade Modular Architecture',
    proficiencyScore: 95,
    proficiencyLevel: 'Production Heavy Enterprise',
    proficiencyDescription: 'Architectural separation of modules, standard Dependency Injection (DI) engine management, robust interceptor layers, dynamic middleware validation pipes, and Microservices patterns.',
    solutionProposal: 'We propose NestJS for scalable enterprise products. Its strict module structure enforces software engineering best practices, ensuring your backend remains organized, easily testable, and maintainable even with massive, growing engineering squads.',
    keyAestheticBenefit: 'Clean API endpoints, uniform response shapes, and highly reliable data parsing.',
    features: ['Dependency Injection architectural isolation', 'Interactive RxJS Event streaming modules', 'Built-in support for multiple network protocols']
  },
  'PostgreSQL': {
    title: 'PostgreSQL',
    category: 'Backend Architecture',
    tagline: 'Advanced Relational Database Storage & Integrity',
    proficiencyScore: 96,
    proficiencyLevel: 'Elite Core Mastery',
    proficiencyDescription: 'Exquisite query plan indexing optimization, complex JSONB structured storage architectures, safe transactional concurrency triggers, and high availability primary-replica replication setups.',
    solutionProposal: 'PostgreSQL is our default relational database. We utilize its bulletproof transaction engines and advanced indexes to ensure that financial data, user profiles, and operational logs remain secure, accurate, and lightning-fast to query.',
    keyAestheticBenefit: 'Zero data losses and instant database fetch pipelines.',
    features: ['ACID-compliant transaction reliability', 'High-performance JSONB storage indexing', 'Dynamic replication & load balancing pools']
  },
  'GraphQL': {
    title: 'GraphQL',
    category: 'Backend Architecture',
    tagline: 'Unified API Gateway & Single-Request Schemas',
    proficiencyScore: 91,
    proficiencyLevel: 'Expert Operational Depth',
    proficiencyDescription: 'Schema drafting protocols, query resolver optimization, DataLoader pattern execution to bypass N+1 query overheads, and Apollo server integrations.',
    solutionProposal: 'We recommend GraphQL to streamline complex, nested data retrieval on client applications. By providing a single gateway, it allows mobile and web screens to request the exact content they need in one trip, drastically reducing bandwidth and improving platform performance.',
    keyAestheticBenefit: 'Faster page layouts, zero over-fetching, and fluid screen transitions.',
    features: ['DataLoader batching and caching engines', 'Type-safe unified API schema gateways', 'Real-time WebSocket subscriptions support']
  },

  // INFRASTRUCTURE
  'AWS': {
    title: 'AWS',
    category: 'Cloud Infrastructure',
    tagline: 'Resilient Multi-Region Cloud Foundations',
    proficiencyScore: 95,
    proficiencyLevel: 'Production Heavy Enterprise',
    proficiencyDescription: 'Multi-region disaster recoveries, VPC design, IAM permission governance, serverless deployments (Lambda), high-frequency EC2 Auto-Scaling schemes, and ECS/EKS systems.',
    solutionProposal: 'We propose Amazon Web Services (AWS) to host platforms requiring absolute fault tolerance, high elasticity for load spikes, and strict corporate data security standards across global edge distribution networks.',
    keyAestheticBenefit: '99.99% system availability and secure global content edge distribution.',
    features: ['Elastic Load Balancing multi-target routing', 'Highly secure VPC isolation layers', 'Automated cloud asset optimization']
  },
  'Google Cloud (GCP)': {
    title: 'Google Cloud (GCP)',
    category: 'Cloud Infrastructure',
    tagline: 'High-Velocity Container Orchestration & Analytics Group',
    proficiencyScore: 93,
    proficiencyLevel: 'Expert Operational Depth',
    proficiencyDescription: 'Google Kubernetes Engine (GKE) deployments, Cloud Run serverless container execution, multi-stage BigQuery data analytic setups, and robust Cloud IAM architectures.',
    solutionProposal: 'We leverage Google Cloud Platform for solutions that rely heavily on containers and advanced analytics. With instantaneous scale-to-zero capabilities via Cloud Run, GEP minimizes billing overhead while delivering elite performance.',
    keyAestheticBenefit: 'Zero configuration bottlenecks, fast continuous deployments, and deep data insight capabilities.',
    features: ['GKE Autopilot container setups', 'Instant scaling serverless Cloud Run pipelines', 'BigQuery analytics processing modules']
  },
  'Docker': {
    title: 'Docker',
    category: 'Cloud Infrastructure',
    tagline: 'Disposable Application Sandboxing Standards',
    proficiencyScore: 98,
    proficiencyLevel: 'Elite Core Mastery',
    proficiencyDescription: 'Multi-stage lean Dockerfile crafting, layer caching optimizations, minimized micro-image builds (Alpine/Distroless), and complex localized container networking design.',
    solutionProposal: 'Docker containerization is used on every project. By bundling dependencies into static, lightweight structures, we guarantee that the exact software built on your development machine works identical in production — removing "works on my machine" delays entirely.',
    keyAestheticBenefit: 'Fast deployment times across development, testing, and production servers.',
    features: ['Multi-Stage build optimization cycles', 'Secure Distroless lightweight base containers', 'Isolated container network execution models']
  },
  'Kubernetes': {
    title: 'Kubernetes',
    category: 'Cloud Infrastructure',
    tagline: 'Self-Healing Automated Container Desktops',
    proficiencyScore: 91,
    proficiencyLevel: 'Expert Operational Depth',
    proficiencyDescription: 'Custom horizontal pod autoscaling, ingress controller settings, declarative rolling updates configurations, automated secrets management, and persistent volume provisioning.',
    solutionProposal: 'For massive scale systems, we construct self-healing container fleets with Kubernetes. If a server node collapses, Kubernetes instantly spins up healthy replicas on a clean pod, maintaining application uptime even during heavy unexpected load.',
    keyAestheticBenefit: 'Uninterrupted user experiences during server maintenance and software updates.',
    features: ['Self-healing automatic server restarts', 'Horizontal Pod Autoscaler (HPA) resource allocations', 'Near zero-downtime rolling deployment systems']
  },
  'Terraform': {
    title: 'Terraform',
    category: 'Cloud Infrastructure',
    tagline: 'Infrastructure as Code Declarative Automation',
    proficiencyScore: 94,
    proficiencyLevel: 'Expert Operational Depth',
    proficiencyDescription: 'Writing clean declarative HCL modules, secure state file remote locking structures, dynamic cloud resources provisioning, and multi-cloud environment replication.',
    solutionProposal: 'We use Terraform to define entire cloud networks in declarative code files. This makes setting up identical Testing, Staging, and Production environments instant, secure, and entirely free from manual human configuration errors.',
    keyAestheticBenefit: '100% predictable cloud environment performance without manual setup delays.',
    features: ['Declarative layout blueprint state setups', 'Multi-cloud resource provisioning modules', 'Immutable platform update audits logging']
  },
  'CI/CD': {
    title: 'CI/CD',
    category: 'Cloud Infrastructure',
    tagline: 'Continuous Automated Delivery & Quality Pipelines',
    proficiencyScore: 97,
    proficiencyLevel: 'Elite Core Mastery',
    proficiencyDescription: 'GitHub Actions config, multi-stage parallel task pipelines, automated linting/testing gating, safe canary deployments, and integrated vulnerability scanning.',
    solutionProposal: 'Our fully integrated CI/CD pipelines automate the testing, building, and deploying processes. Every code adjustment is thoroughly analyzed for security flaws and run through unit suites automatically before pushing live, minimizing human error.',
    keyAestheticBenefit: 'Fast feature releases without manual operational bottlenecks or deployment bugs.',
    features: ['Parallelized test pipeline executions', 'Automated security scanning gate check systems', 'Canary dynamic deploy configuration structures']
  },

  // SPECIALIZED
  'AI & Machine Learning': {
    title: 'AI & Machine Learning',
    category: 'Specialized Engineering',
    tagline: 'Predictive Inference & Advanced Automation',
    proficiencyScore: 92,
    proficiencyLevel: 'Expert Operational Depth',
    proficiencyDescription: 'Integration of deep learning neural networks, model fine-tuning via PyTorch/TensorFlow, LLM vector search architectures, and real-time inference optimization.',
    solutionProposal: 'We build proprietary predictive and generative features to automate complex workflows. By integrating smart forecasting, categorization models, or automated language engines, we transform data-dense apps into intelligent workflows.',
    keyAestheticBenefit: 'Empowers interfaces with proactive suggestions, prediction graphs, and contextual insights.',
    features: ['Vector Search & Embeddings pipelines', 'Machine learning predictive classification engines', 'LLM generative business assistant nodes']
  },
  'Internet of Things (IoT)': {
    title: 'Internet of Things (IoT)',
    category: 'Specialized Engineering',
    tagline: 'High-Concurrency Sensor Networks & Edge Systems',
    proficiencyScore: 87,
    proficiencyLevel: 'Advanced Engineering Core',
    proficiencyDescription: 'Protocol setups (MQTT, CoAP), high-frequency data ingestion networks, sub-second edge telemetry parsing architectures, and hardware-software hardware interfaces.',
    solutionProposal: 'For clients tracking fleet logistics, monitoring factories, or processing smart home data, we build IoT networks that securely capture massive sensor streams, rendering clean dashboards in real time.',
    keyAestheticBenefit: 'Ultra-low latency real-time sensor charts, warnings, and alerts in high-fidelity interfaces.',
    features: ['High-throughput MQTT telemetry handlers', 'Optimized time-series database indexing', 'Edge compute device security frameworks']
  },
  'AR & VR Solutions': {
    title: 'AR & VR Solutions',
    category: 'Specialized Engineering',
    tagline: 'Spatial Interactive Browser Interfacing',
    proficiencyScore: 85,
    proficiencyLevel: 'Advanced Engineering Core',
    proficiencyDescription: 'Responsive WebXR API integrations, low-head-latency UI rendering, spatial audio setups, and optimizing complex assets for quick downloads.',
    solutionProposal: 'We propose web-based AR/VR to remove the barrier of installing native apps. Users can interact with 3D product configurations or view spatial layouts on mobile browsers with zero setup required.',
    keyAestheticBenefit: 'Highly engaging interactive simulations that allow deep product visualization.',
    features: ['WebXR device interface connections', 'High-performance spatial coordinate math modeling', 'Optimized low-poly 3D assets delivery']
  },
  'Blockchain, Web-3 & DApp': {
    title: 'Blockchain, Web-3 & DApp',
    category: 'Specialized Engineering',
    tagline: 'Decentralized Cryptographic Ledgers & Smart Contracts',
    proficiencyScore: 89,
    proficiencyLevel: 'Expert Operational Depth',
    proficiencyDescription: 'Secure Solidity smart contract authorship, complete ethers.js client event integrations, cryptographically-secure transaction pipeline designs, and Web3Auth protocols.',
    solutionProposal: 'For tracking supply chain transparency, verifying data integrity, or building secure digital assets, we propose Web-3/DApp solutions. Decentralized trust guarantees that critical entries remain entirely audit-proof.',
    keyAestheticBenefit: 'Transparent data visualizations, cryptographically signed events, and tamper-proof history grids.',
    features: ['Solidity secure smart contract compilation', 'Ethers.js asynchronous transaction handling', 'Decentralized IPFS distributed storage syncing']
  },
  'Intelligent Features Augmentation': {
    title: 'Intelligent Features Augmentation',
    category: 'Specialized Engineering',
    tagline: 'Seamless Workflow Intelligence Injection',
    proficiencyScore: 93,
    proficiencyLevel: 'Expert Operational Depth',
    proficiencyDescription: 'Contextual AI interfaces, predictive text suggestions, intelligent form auto-completes, search anomaly classification, and dynamic user layout adaptations.',
    solutionProposal: 'We enrich digital platforms by injecting adaptive smart features directly into user workflows, automatically removing tedious administrative steps, predicting form entries, and streamlining daily actions.',
    keyAestheticBenefit: 'Modern, personalized user experiences that adapt to unique professional behaviors.',
    features: ['Predictive context-aware search inputs', 'Dynamic layout adjustment algorithms', 'Automated document analysis and tagging']
  },
  'Cross-Platform Solutions': {
    title: 'Cross-Platform Solutions',
    category: 'Specialized Engineering',
    tagline: 'Single Codebase Multi-Device Engineering',
    proficiencyScore: 94,
    proficiencyLevel: 'Expert Operational Depth',
    proficiencyDescription: 'Highly optimized React Native structure, robust Flutter builds, fast single-source compilation, device sensor integrations, and consistent performance profiling.',
    solutionProposal: 'We propose cross-platform architectures to drastically reduce initial product development costs. By crafting a single, shared codebase, we deploy beautiful interfaces on both iOS and Android simultaneously, saving months of duplicate work.',
    keyAestheticBenefit: 'Perfect visual consistency and smooth interactions across all devices.',
    features: ['Single-source shared codebase pipelines', 'Optimized platform-native rendering pipelines', 'Device native API standard adapters']
  },
  'Progressive Web Apps (PWA)': {
    title: 'Progressive Web Apps (PWA)',
    category: 'Specialized Engineering',
    tagline: 'Offline-First Installable Browser Platforms',
    proficiencyScore: 95,
    proficiencyLevel: 'Production Heavy Enterprise',
    proficiencyDescription: 'Advanced Service Worker script compilation, Workbox cache optimization strategy, offline database setups, push notification systems, and manifest security.',
    solutionProposal: 'For clients deploying apps in areas with intermittent networks, we build PWAs. Installing directly onto native device desktops from any web browser, they run completely offline while maintaining full speed.',
    keyAestheticBenefit: 'Frictionless, instant mobile installs and reliable offline usability.',
    features: ['Offline Workbox static resource caching', 'Desktop & Mobile prompt installation drivers', 'Background data sync once network restores']
  }
};

interface TechDetailModalProps {
  techName: string;
  onClose: () => void;
}

export const TechDetailModal: React.FC<TechDetailModalProps> = ({ techName, onClose }) => {
  const detail = TECH_DETAILS[techName];

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

  if (!detail) {
    // Elegant fallback if description is missing
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
        <div className="relative bg-white dark:bg-slate-900 p-8 rounded-[2rem] w-full max-w-md text-center border border-slate-200 dark:border-slate-800 z-10 shadow-2xl">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><X size={20} /></button>
          <Cpu className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-bounce" />
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{techName}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs mb-6">Expert technical capabilities and architectural software integrations at OITS Dhaka.</p>
          <button onClick={onClose} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest">ACKNOWLEDGE</button>
        </div>
      </div>
    );
  }

  const scoreArray = Array.from({ length: 5 }, (_, i) => i * 20 + 20);

  return (
    <div 
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tech-modal-title"
    >
      {/* Absolute backdrop blur */}
      <div 
        className="absolute inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="relative bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-[3rem] shadow-2xl border border-slate-250 dark:border-slate-800 flex flex-col z-20 no-scrollbar"
      >
        {/* Dismiss Button */}
        <button 
          onClick={onClose}
          aria-label="Close technology details"
          className="absolute top-6 right-6 p-3 bg-slate-100 hover:bg-red-500 dark:bg-slate-800 text-slate-500 hover:text-white rounded-full transition-all hover:rotate-90 hover:scale-110 z-30 shadow-md border border-slate-200/50 dark:border-slate-700/50"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Main info Column (Left) */}
          <div className="lg:col-span-7 p-8 sm:p-10 md:p-12 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 text-[10px] font-mono font-black uppercase tracking-widest w-fit mb-6">
              <Code size={12} /> {detail.category}
            </div>

            <h3 id="tech-modal-title" className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight mb-2">
              {detail.title}
            </h3>
            
            <p className="text-xs font-mono text-blue-600 dark:text-blue-400 uppercase tracking-widest font-bold mb-8">
              // {detail.tagline}
            </p>

            <div className="space-y-8">
              <div>
                <h4 className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-505 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Terminal size={12} className="text-blue-500" /> Proposed Software Solution
                </h4>
                <p className="text-sm font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
                  {detail.solutionProposal}
                </p>
              </div>

              <div>
                <h4 className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-505 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Sparkles size={12} className="text-blue-500" /> Key Aesthetic & Performance Impact
                </h4>
                <p className="text-xs font-semibold leading-relaxed text-slate-500 dark:text-slate-400 italic">
                  "{detail.keyAestheticBenefit}"
                </p>
              </div>
            </div>
          </div>

          {/* Proficiency and Features Column (Right) */}
          <div className="lg:col-span-5 bg-slate-50/50 dark:bg-slate-950/25 p-8 sm:p-10 md:p-12 flex flex-col justify-between">
            <div className="space-y-8">
              {/* Proficiency score rating block */}
              <div>
                <div className="flex justify-between items-baseline mb-3">
                  <h4 className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-505 uppercase tracking-widest flex items-center gap-1.5">
                    <Award size={12} className="text-blue-500" /> OITS Proficiency
                  </h4>
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{detail.proficiencyScore}%</span>
                </div>
                
                <p className="text-xs font-black text-slate-805 dark:text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Zap size={12} className="text-amber-500 fill-current" /> {detail.proficiencyLevel}
                </p>

                {/* Score slider indicator */}
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex mb-4">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                    style={{ width: `${Math.min(detail.proficiencyScore, 100)}%` }}
                  />
                </div>

                <p className="text-xs font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
                  {detail.proficiencyDescription}
                </p>
              </div>

              {/* Core Features / Applications list */}
              <div>
                <h4 className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-505 uppercase tracking-widest mb-4">
                  Standard Specifications We Deliver
                </h4>
                <ul className="space-y-3">
                  {detail.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-350 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-3.5 rounded-2xl shadow-sm">
                      <span className="w-5 h-5 shrink-0 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 mt-0.5">
                        <Check size={12} strokeWidth={2.5} />
                      </span>
                      <span className="leading-tight">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-200/60 dark:border-slate-800 mt-8">
              <button
                onClick={onClose}
                className="w-full text-center py-3.5 bg-slate-900 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-500/10 focus-visible:ring-4 focus-visible:ring-blue-500/20 active:scale-[0.98] transform-gpu"
              >
                ACKNOWLEDGE PROTOCOL
              </button>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};
