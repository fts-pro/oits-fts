import { Product, CaseStudy, Channel, CMSBlock } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-medical-ai',
    title: 'Medical AI Assistant & Digital Doctor',
    category: 'Healthcare & Life Sciences',
    description: 'Autonomous medical system fusing convolutional neural networks and GPT-vision models to parse CT/MRI/X-Ray scans and handwritten prescriptions. Supports GP-level symptom checkers with clinician oversight and regional Bangla/English dialetic models.',
    metricLabel: 'Early Detection Increase',
    metricValue: '40%',
    impactMetrics: [
      { label: 'Radiologist Workload Reduction', value: '35%' },
      { label: 'Prescription OCR Accuracy', value: '95.6%' },
      { label: 'Screening Time Compression', value: '85%' },
    ],
    status: 'Live & Production',
    icon: 'Activity',
  },
  {
    id: 'prod-diag-centre',
    title: 'DiagnosticCentre AI Solution',
    category: 'Healthcare Digital Transformation',
    description: 'Complete digital patient engagement system enabling online booking with real-time slot availability, QR-enabled paperless report management, and LIS integration. Features an embeddable symptom-triage helper (MedBot).',
    metricLabel: 'Staff Workload Reduction',
    metricValue: '60%',
    impactMetrics: [
      { label: 'Portal Adoption Rate', value: '>50%' },
      { label: 'Booking Time', value: '<3 min' },
    ],
    status: 'Live & Production',
    icon: 'Stethoscope',
  },
  {
    id: 'prod-luna',
    title: 'LUNA Multimodal Conversational Platform',
    category: 'Conversational AI',
    description: 'An omni-vertical agent framework providing real-time voice and text support with voice biometrics (99.1% accuracy), sentiment escalation logic, and a dynamic negotiation engine. Supports native Bangla-English-Banglish dialogs.',
    metricLabel: 'Support Agent Deflection',
    metricValue: '70%',
    impactMetrics: [
      { label: 'Conversational Commerce Lift', value: '22%' },
      { label: 'Average Order Value (AOV)', value: '+12%' },
      { label: 'User Retention Score', value: '+18 NPS' },
    ],
    status: 'Live & Production',
    icon: 'MessageSquare',
  },
  {
    id: 'prod-banking-ocr',
    title: 'Banking OCR/ICR Intelligent Engine',
    category: 'Document Intelligence',
    description: 'On-premises enterprise platform powered by LLaMA Vision and Tesseract to extract data from account-opening and check forms. Incorporates confidence-based routing into auto-pass, maker-checker, and manual verification lines.',
    metricLabel: 'Verification Accuracy',
    metricValue: '95%',
    impactMetrics: [
      { label: 'Bangla Handwriting Accuracy', value: '85%' },
      { label: 'Form Processing Speedup', value: '75%' },
    ],
    status: 'MVP Complete',
    icon: 'FileSpreadsheet',
  },
  {
    id: 'prod-digital-wallet',
    title: 'Digital Wallet, Payments & Ledger Core',
    category: 'Fintech & Stored Value Platforms',
    description: 'Unified financial infrastructure containing secure identity and access, multibalance wallet management, payout services, double-entry general ledger, sanctions/screening integration (OFAC parsing), and web3-stablecoin readiness.',
    metricLabel: 'Ledger Audit Readiness',
    metricValue: '100%',
    impactMetrics: [
      { label: 'Fraud Deflection Rate', value: '45%' },
      { label: 'Compliance Accuracy', value: '100%' },
    ],
    status: 'Live & Production',
    icon: 'Wallet',
  },
  {
    id: 'prod-decision-support',
    title: 'Project Eugenia: Real-Estate Decision Support',
    category: 'PropTech Analytics',
    description: 'System-agnostic cloud analytics platform consolidating data across 7+ property systems. Deploys XGBoost forecasting, Isolation Forest anomaly detectors, and hedonic pricing models to lower energy and maintenance costs.',
    metricLabel: 'Energy Consumption Savings',
    metricValue: '12%',
    impactMetrics: [
      { label: 'Operational Cost Reduction', value: '15%' },
      { label: 'Tenant Satisfaction Lift', value: '5%' },
    ],
    status: 'Demo Only',
    icon: 'BarChart3',
  },
  {
    id: 'prod-medical-lms',
    title: 'Medical LMS & Surgical Simulators',
    category: 'EdTech & Immersive Environments',
    description: 'Meta Quest 3 and HoloLens 2 virtual dissection and physiology platform with real-time pathology generation (500+ states). Includes haptic-feedback surgical simulators with AI scoring on tissue damage and trajectory.',
    metricLabel: 'Knowledge Retention Lift',
    metricValue: '78%',
    impactMetrics: [
      { label: 'Anatomy Lab Cost Savings', value: '60%' },
      { label: 'Surgical Complications reduction', value: '50%' },
    ],
    status: 'MVP Complete',
    icon: 'GraduationCap',
  },
  {
    id: 'prod-jotax',
    title: 'Jotax Automated Financial BI Suite',
    category: 'Business Intelligence',
    description: 'Consolidated reporting and data automation utilizing 80+ DAX measures and Power Automate workflows. Supports custom, localized business calculations such as the Finnish business and fiscal calendar constraints.',
    metricLabel: 'Reporting Overhead Reduction',
    metricValue: '80%',
    impactMetrics: [
      { label: 'Calculation Error Prevention', value: '100%' },
      { label: 'Quarterly Cashflow Reconciliation', value: 'Solved' },
    ],
    status: 'Live & Production',
    icon: 'PieChart',
  },
];

export const INITIAL_CASE_STUDIES: CaseStudy[] = [
  {
    id: 'case-labaid',
    title: '24-Hour Cancer Screening: Telehealth Diagnosis in Rural Contexts',
    client: 'LABAID Cancer Hospital & LifePlus Telemedicine',
    challenge: [
      'Diagnostic bottlenecks caused by a 30-50% annual radiologist workload increase.',
      'A 65% rural oncologist shortage resulting in four- to six-week oncology assessment delays.',
      'Frequent medication errors arising from illegible handwritten prescriptions.',
    ],
    solution: [
      'Deployed LABAID GPT prescription parsing and CT/MRI imaging annotation.',
      'Built custom vision transformer modules with localized medical dictionary training.',
      'Wired 24/7 symptom pre-screening and medical triage using clinical BERT models.',
    ],
    results: [
      'Successfully compressed wait times from 3 weeks to under 24 hours (85% reduction).',
      'Boosted early-stage malignant anomalies detection by 40%.',
      'Deflected 30% of low-acuity appointments, returning clinical bandwidth to complex cases.',
    ],
    duration: '9 Months',
    status: 'Live & Implemented',
  },
  {
    id: 'case-prime',
    title: 'Automating Customer Onboarding and Form OCR in Commercial Banking',
    client: 'Prime Commercial Bank',
    challenge: [
      'Excessive manual entry times taking up to 15-20 minutes per onboarding document.',
      'Inconsistent scan qualities featuring messy handwriting, cross-outs, and mixed-idiom text.',
      'Rigorous central-bank auditing rules requiring verifiable logs and duplicate checks.',
    ],
    solution: [
      'Constructed a containerized OCR/ICR pipeline using LLaMA 3.2 Vision models.',
      'Integrated an automated confidence scoring router with human-in-the-loop (HITL) maker-checker validation.',
      'Deployed on-premises to guarantee data sovereignty and compliance.',
    ],
    results: [
      'Achieved 95%+ English-text reading accuracy and 85%+ handwritten Bangla accuracy.',
      'Accelerated average form reviewing times to under 3 minutes (70-80% speedup).',
      'Satisfied 100% of audit requirements with immutable digital audit logs.',
    ],
    duration: '4 Months',
    status: 'Live Pilot',
  },
];

export const INITIAL_CHANNELS: Channel[] = [
  {
    id: 'chan-general',
    name: 'general',
    description: 'Welcome to AI Innovations! General discussion channel for secure, peer-to-peer corporate chat.',
    passphrase: 'GeneralSecret123',
    isStatic: true,
  },
  {
    id: 'chan-healthcare',
    name: 'healthcare-ai-assistance',
    description: 'End-to-end encrypted channel for discussing clinical assistance, pre-screening, and image reader optimizations.',
    passphrase: 'LabaidPrecisionCare2026',
    isStatic: true,
  },
  {
    id: 'chan-fintech',
    name: 'fintech-digital-wallet',
    description: 'High-security discussion regarding double-entry ledger, secure payment gateways, and KYC/KYB integrations.',
    passphrase: 'E2EEDoubleEntrySecureKey',
    isStatic: true,
  },
];

export const INITIAL_CMS_BLOCKS: CMSBlock[] = [
  {
    id: 'cms-hero-title',
    key: 'hero_title',
    title: 'Hero Banner Title',
    content: 'Enterprise AI Engineering. Crafted for Scale.',
    category: 'Hero Section',
  },
  {
    id: 'cms-hero-sub',
    key: 'hero_subtitle',
    title: 'Hero Banner Subtitle',
    content: 'We design, deploy, and maintain world-class AI solutions across Healthcare, Fintech, retail and property operations.',
    category: 'Hero Section',
  },
  {
    id: 'cms-ethics',
    key: 'ethics_compliance',
    title: 'Ethics & Compliance Mandate',
    content: 'AI Innovations is committed to upholding the highest standards of data security, human-in-the-loop safety, and clinical ethics. Our systems comply with HIPAA, GDPR, PCI-DSS, and local central-bank specifications.',
    category: 'Legal & Ethics',
  },
];

export const COMPANY_NAME = 'OITS Dhaka';
export const TAGLINE = 'Enterprise AI Engineering. Crafted for Scale.';
export const ADDRESS = 'House # 42, Road # 2/A, Block # Z, Dhanmondi, Dhaka 1209, Bangladesh';
export const CONTACT_EMAIL = 'info@oitsdhaka.com';
export const PHONE = '+880 2 9662026';

export const NAV_ITEMS: { label: string; href: string; icon?: string; children?: { label: string; href: string; icon?: string }[] }[] = [
  { label: 'Home', href: '/', icon: 'Home' },
  { 
    label: 'Services', 
    href: '/services', 
    icon: 'Briefcase',
    children: [{ label: 'Workflow', href: '/workflow', icon: 'Zap' }]
  },
  { 
    label: 'About', 
    href: '/about', 
    icon: 'Users'
  }
];

export const TECH_DOMAINS = [
  { 
    id: 'healthcare', 
    label: 'Healthcare', 
    skills: ['Python', 'PyTorch', 'TensorFlow', 'FastAPI', 'PostgreSQL'] 
  },
  { 
    id: 'fintech', 
    label: 'Fintech & Security', 
    skills: ['Rust', 'PostgreSQL', 'Docker', 'Kubernetes', 'Redis'] 
  },
  { 
    id: 'enterprise', 
    label: 'Enterprise AI', 
    skills: ['TypeScript', 'Nextdotjs', 'Tailwindcss', 'Nodedotjs', 'Vite'] 
  },
  { 
    id: 'analytics', 
    label: 'Data & Analytics', 
    skills: ['D3dotjs', 'Pandas', 'Snowflake', 'Jupyter'] 
  },
];

export const TECH_STACK = [
  'Python', 'PyTorch', 'TensorFlow', 'TypeScript', 'Next.js', 
  'FastAPI', 'Rust', 'Kubernetes', 'Docker', 'PostgreSQL', 
  'Redis', 'AWS', 'Google Cloud', 'llama'
];

export const PROCESS_STEPS = [
  {
    id: 'step-discover',
    number: '01',
    icon: 'Search',
    title: 'Discovery & Audit',
    description: 'Deep technical audits of existing legacy infrastructure, data pipelines, and compliance baselines.'
  },
  {
    id: 'step-design',
    number: '02',
    icon: 'Cpu',
    title: 'Architectural Blueprint',
    description: 'System design documents detailing encryption topologies, latency profiles, and model performance baselines.'
  },
  {
    id: 'step-develop',
    number: '03',
    icon: 'Code',
    title: 'Secure Agile Build',
    description: 'Iterative secure software development cycle backed by automatic static and dynamic vulnerability analysis.'
  },
  {
    id: 'step-deploy',
    number: '04',
    icon: 'Globe',
    title: 'Multi-Cloud Deployment',
    description: 'Hardened Kubernetes configurations with Zero-Trust ingress controllers and automated blue-green delivery pipelines.'
  }
];

export const PROJECTS: any[] = [
  {
    id: 'proj-medical',
    title: 'Autonomous Medical Scanning Triage',
    category: 'Healthcare',
    description: 'Deep vision transformer analyzing critical diagnostic scans in sub-millisecond ranges for rural clinics.',
    fullDescription: 'Custom Vision Transformer (ViT) pipeline deployed at LABAID Cancer Hospital, reducing triage queues and enabling radiologist prioritization with high diagnostic speed.',
    problemStatement: 'High radiologist workloads causing up to 4-week delays in rural diagnostic assessments.',
    technicalApproach: 'Fined-tuned convolutional backbones coupled with localized clinical dictionary transformers.',
    results: 'Early detection rates increased by 40%.',
    technologies: ['Python', 'PyTorch', 'TypeScript', 'Kubernetes'],
    status: 'Completed',
    duration: '9 Months',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800',
    demoVideoUrl: ''
  },
  {
    id: 'proj-ledger',
    title: 'Double-Entry Secured Financial Ledger',
    category: 'Fintech & Security',
    description: 'Fault-tolerant, immutable transaction engine complying with PCI-DSS guidelines and web3 integrations.',
    fullDescription: 'Enterprise fintech transaction ledger with zero ledger discrepancies, double-entry validation logic, and secure hardware storage parameters.',
    problemStatement: 'Audit failures and slow settlement times in regional payments core.',
    technicalApproach: 'Built on PostgreSQL with cryptographically chained state updates and secure API wrappers.',
    results: 'Ledger discrepancy rate lowered to 0%.',
    technologies: ['Rust', 'PostgreSQL', 'Docker', 'AWS'],
    status: 'Completed',
    duration: '6 Months',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800',
    demoVideoUrl: ''
  },
  {
    id: 'proj-ocr',
    title: 'Handwritten Form Extraction ICR Engine',
    category: 'Enterprise AI',
    description: 'Multi-lingual optical character recognition engine with confidence-based human-in-the-loop escalation.',
    fullDescription: 'ICR platform designed for commercial banks to extract content from handwritten account opening documents in mixed Bangla/English.',
    problemStatement: 'High resource consumption during manual digitization of physical bank forms.',
    technicalApproach: 'Tesseract engines optimized with customized LLaMA Vision tokenizers for localized handwriting patterns.',
    results: 'Form ingestion speed increased by 75%.',
    technologies: ['Python', 'TensorFlow', 'TypeScript', 'Docker'],
    status: 'Completed',
    duration: '4 Months',
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=800',
    demoVideoUrl: ''
  }
];

export const TESTIMONIALS = [
  {
    id: 't-1',
    content: 'The deployment of AI Innovations custom diagnostic scan taging engine transformed our patient workflows completely. Turnaround times dropped from weeks to minutes.',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=150',
    name: 'Dr. Tariqul Islam',
    role: 'Chief Medical Officer',
    company: 'LABAID Cancer Hospital & LifePlus Telemedicine'
  },
  {
    id: 't-2',
    content: 'Their fintech core double-entry engine has given us total auditor confidence. Sanctions screening works flawlessly in sub-second timelines. Truly world-class.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150',
    name: 'Faisal Karim',
    role: 'Director of Security Systems',
    company: 'Prime Commercial Bank'
  },
  {
    id: 't-3',
    content: 'Working with OITS on our corporate data transformation strategy has been stellar. Their agile teams delivered our document OCR engine ahead of timeline.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150',
    name: 'Anika Rahman',
    role: 'Head of Digital Innovation',
    company: 'APAC Partner Group'
  }
];

export const SERVICES: any[] = [
  {
    id: 'serv-medical',
    category: 'Healthcare',
    icon: 'Activity',
    title: 'Diagnostic Imaging Models',
    description: 'Autonomous machine learning pipelines to detect malignancies and anomalies in MRI and CT scans.',
    features: ['ISO 13485 Compliant ML', 'Sub-millisecond diagnostics', 'Bangla OCR Patient triage'],
    detailedFeatures: ['Convolutional Neural Network (CNN) feature map extractions', 'Dynamic multi-class tumor boundaries classification', 'Automatic radiologist report draft synthesizers'],
    advantages: ['85% reduction in scan processing latency', 'Zero-leakage local storage protocols', 'High clinician-in-the-loop satisfaction rating'],
    caseStudy: {
      impact: '85% Wait Time Compression',
      quote: 'The vision systems provided early detections that allowed radiologists to prioritise critical cancer cases immediately.',
      client: 'LABAID Oncology Group'
    },
    documentationUrl: '/services'
  },
  {
    id: 'serv-fintech',
    category: 'Fintech & Security',
    icon: 'Wallet',
    title: 'Enterprise Transaction Hubs',
    description: 'Encrypted scalable Double-Entry ledger systems with automated sanctions checking.',
    features: ['PCI-DSS compliant code', 'Double-entry audit assertions', 'Real-time sanctions filtering'],
    detailedFeatures: ['HSM-secured cryptographic key rings', 'Automated anti-fraud transaction graph analyzers', 'Instant settlement ledger systems'],
    advantages: ['100% auditable ledger entries', 'Zero single points of failure in ledger replication', '45% fraud attempts deflected at gateway stage'],
    caseStudy: {
      impact: '0% ledger imbalance recorded',
      quote: 'The payment settlement pipeline achieved perfect replication and passed central-bank auditing rules cleanly.',
      client: 'Prime Commercial Bank'
    },
    documentationUrl: '/services'
  },
  {
    id: 'serv-document',
    category: 'Enterprise AI',
    icon: 'Cpu',
    title: 'Intelligent ICR Solutions',
    description: 'Dynamic local OCR pipelines parsing handwriting patterns in bilingual layouts.',
    features: ['Handwriting ICR processing', 'Confidence metric escalations', 'Zero internet dependence'],
    detailedFeatures: ['High-accuracy multilingual form coordinate alignments', 'Multi-layer confidence scores filtering', 'Secure maker-checker web control panels'],
    advantages: ['75% processing speed improvements', 'Elimination of clerical transcription errors', 'Secure sandbox execution environments'],
    caseStudy: {
      impact: '75% Intake Acceleration Rate',
      quote: 'Data typing tasks are automated completely, allowing branch staff to prioritize real relationships.',
      client: 'Prime Commercial Core'
    },
    documentationUrl: '/services'
  }
];

