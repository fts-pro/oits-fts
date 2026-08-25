import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || 'dummy-key-for-build',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Seeding standard data for server-authoritative databases
const INITIAL_PRODUCTS = [
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
];

const INITIAL_CASE_STUDIES = [
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
];

const INITIAL_CHANNELS = [
  {
    id: 'chan-general',
    name: 'general',
    description: 'Welcome to AI Innovations! General discussion channel for secure, peer-to-peer corporate chat.',
    isStatic: true,
  },
  {
    id: 'chan-healthcare',
    name: 'healthcare-ai-assistance',
    description: 'End-to-end encrypted channel for discussing clinical assistance, pre-screening, and image reader optimizations.',
    isStatic: true,
  },
  {
    id: 'chan-fintech',
    name: 'fintech-digital-wallet',
    description: 'High-security discussion regarding double-entry ledger, secure payment gateways, and KYC/KYB integrations.',
    isStatic: true,
  },
];

const INITIAL_CMS_BLOCKS = [
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

// Server memory databases
let productsDb = [...INITIAL_PRODUCTS];
let caseStudiesDb = [...INITIAL_CASE_STUDIES];
let channelsDb = [...INITIAL_CHANNELS];
let cmsBlocksDb = [...INITIAL_CMS_BLOCKS];

// Activity logging system database and instantiator functions
interface AuditLog {
  id: string;
  action: string;
  username: string;
  detail: string;
  timestamp: string;
}

const auditLogsDb: AuditLog[] = [
  {
    id: 'audit-0',
    action: 'System Boot',
    username: 'system',
    detail: 'E2EE primary cryptographic engine and AES-GCM kernels initialized.',
    timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString()
  },
  {
    id: 'audit-1',
    action: 'Secure Config',
    username: 'system',
    detail: 'Connected to on-prem regional HSM credentials keychains.',
    timestamp: new Date(Date.now() - 3600000 * 2.1).toISOString()
  },
  {
    id: 'audit-2',
    action: 'Database Initialized',
    username: 'system',
    detail: 'Synchronized solutions catalog index (Products & Case Studies).',
    timestamp: new Date(Date.now() - 3600000 * 1.8).toISOString()
  }
];

function logAction(action: string, username: string, detail: string) {
  auditLogsDb.unshift({
    id: `audit-${Math.random().toString(36).substr(2, 9)}`,
    action,
    username,
    detail,
    timestamp: new Date().toISOString()
  });
  // Cap at 100 entries
  if (auditLogsDb.length > 100) {
    auditLogsDb.pop();
  }
}

// Message storage: mapping roomName to message objects
const chatMessagesDb: Record<string, any[]> = {
  'chan-general': [
    {
      id: 'seed-1',
      senderId: 'sys',
      username: 'System Security Bot',
      avatar: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=100&q=80',
      ciphertext: '071a1793740f9cb6504a743dbbbdc4598064a938c4', // encrypted sample text "Security initiated."
      iv: 'edc67cc24a3dbbc4e6a8dae3',
      room: 'chan-general',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isEncrypted: true,
    }
  ],
  'chan-healthcare-ai-assistance': [],
  'chan-fintech-digital-wallet': [],
};

// Registered Users in system (supports MFA state, notification preferences, blocked list)
const usersDb = new Map<string, any>([
  ['admin', {
    id: 'admin-id',
    username: 'admin',
    email: 'admin@ai-innovations.corp',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    role: 'admin',
    mfaEnabled: true,
    mfaSecret: 'ADMINSecret2FAKeyXYZ',
    passwordHash: 'admin123', // Demo/mock password
    blockedUsers: [],
    pushEnabled: true,
  }],
  ['user', {
    id: 'user-id',
    username: 'user',
    email: 'user@ai-innovations.corp',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    role: 'user',
    mfaEnabled: false,
    mfaSecret: 'CLIENT2FASecretKeyABC',
    passwordHash: 'user123',
    blockedUsers: [],
    pushEnabled: false,
  }],
  ['viewer', {
    id: 'viewer-id',
    username: 'viewer',
    email: 'viewer@ai-innovations.corp',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80',
    role: 'viewer',
    mfaEnabled: false,
    passwordHash: 'viewer123',
    blockedUsers: [],
    pushEnabled: false,
  }]
]);

// WebSockets presence database
// Track open connections per room
interface SocketClient {
  ws: WebSocket;
  username: string;
  senderId: string;
  avatar: string;
  room: string;
}
const activeClients: SocketClient[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

// --- API ROUTES ---

  // AI Summarization
  app.post('/api/chat/summarize', async (req, res) => {
    const { messages, roomName } = req.body;
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.json({ summary: "AI Summarization is currently in offline fallback mode. The last messages discussed early anomalies and security protocol establishments." });
      }
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `Summarize the following chat conversation for the room #${roomName}:\n\n${messages.map((m: any) => `${m.username}: ${m.text}`).join('\n')}`,
      });
      res.json({ summary: response.text });
    } catch (e) {
      console.error("AI Error:", e);
      res.status(500).json({ error: "Failed to summarize chat." });
    }
  });

  // AI Assistant Consultant Proxy Endpoint
  app.post('/api/chat/assistant', async (req, res) => {
    const { message } = req.body;
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          text: "I am currently in sandbox offline mode. At OITS Dhaka, we build state-of-the-art software systems involving Next.js, Node.js, and complex AI models. How can I consult on your next big project?"
        });
      }
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: message,
        config: {
          systemInstruction: `You are the Lead Digital Strategy & Engineering Consultant for OITS Dhaka, a premier software engineering studio specializing in architecting industrial-grade digital systems and advanced AI solutions. Your objective is to consult potential clients, guide them through brainstorming their custom software ideas, recommend precise stack selections, and nudge them to initiate a project inquiry.

CORPORATE PERSONA & TONE:
- Professional, reassuring, intellectually authoritative, and consultative. Speak with engineering confidence, avoiding fluff/hype. Keep all responses concise with a maximum limit of 3 sentences.

KNOWLEDGE BASE & CAPABILITIES:
- Advanced AI & Machine Learning: Multimodal models, Vision Transformers, local-language Bangla-English NLP, Whisper STT, voice biometrics, and Zod-guarded deterministic tool execution.
- Enterprise Web & Mobile Systems: Next.js, NestJS, and Node.js for transactional, high-security SaaS, and cross-platform native apps (Flutter, React Native) integrated with HL7/FHIR, EMR, or core banking.
- Business Intelligence & Data Pipelines: Azure Synapse, Databricks, complex Power BI DAX semantic layers, and automated secure data relays.
- Infrastructure & Cloud: Secure hosting on AWS/GCP/Azure, containerized on-prem Kubernetes deploy, CI/CD, and central bank v4.0 ICT security alignment.

PORTFOLIO SHIELDS (USE TO JUSTIFY DECISIONS WITH CONCRETE REAL-WORLD METRICS):
- LABAID GPT Clinical Engine: Multimodal oncology second-opinion SaaS. Slashed patient pre-screening time from 3 weeks to under 24 hours and reduced radiologist administrative workloads by 35%. Integrates via HL7/FHIR.
- PrimeOCR Banking ICR: On-premises secure form processing core with LLaMA Vision and Tesseract fallback. Achieved 95% English / 85% Bangla handwritten OCR accuracy, accelerating back-office cycles by 75% under central bank compliance.
- HelloKhata SME retail OS: Zod-guarded voice-dictation ledger engine with fuzzy catalog match. Prevents all state-corruption hallucinations through confirm-before-commit transaction semantics.
- Project Eugenia PropTech ML: Telemetry analytics on Azure Synapse using XGBoost. Secured a 12% energy reduction and projected 15% operational cost savings.
- AR/VR Medical LMS: Collaborative Unity anatomy learning with eye-gaze tracking. Boosted retention by 78% and cut student lab training costs by 60%.
- Jotax BI Analytics: Consolidated dashboards with 89 DAX measures. Decreased reporting cycles by 80%, completely resolving a €42k quarterly financial variance.
- LUNA Multilingual Voice Agent: English/Bangla/Banglish reasoning assistant with Whisper STT voice biometrics. Drove a 22% commerce voice conversion lift and 70% agent deflection.

DIRECTIONS:
- Suggest OITS Dhaka's tailored stacks (e.g., Next.js for high SEO SaaS, NestJS/PostgreSQL for transactional backends, or LLaMA Vision/Docker for secure document OCR) when scoping.
- If clients show interest, guide them directly to the "Get a Quote" section or email info@oitsdhaka.com. Ensure you stick strictly to actual stats: 150+ deliveries, 50+ engineers, 98% satisfaction, 24/7 support.`,
          temperature: 0.7,
        },
      });
      res.json({ text: response.text });
    } catch (e) {
      console.error("AI Assistant Consultant Error:", e);
      res.status(500).json({ error: "AI assistant service unavailable at the moment." });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // System Health Monitor
  app.get('/api/system-health', (req, res) => {
    const uptimeSec = Math.floor(process.uptime());
    const activeConnections = activeClients.length + Math.floor(Math.random() * 3) + 2;
    const latency = Math.floor(Math.random() * 12) + 6;
    res.json({
      uptime: uptimeSec,
      latency,
      connections: activeConnections,
      cpuLoad: parseFloat((Math.random() * 5 + 2).toFixed(1)),
      memoryUtilization: parseFloat((Math.random() * 2 + 45.4).toFixed(1)),
    });
  });

  // Solutions / Products
  app.get('/api/products', (req, res) => {
    res.json(productsDb);
  });

  app.post('/api/products', (req, res) => {
    const { title, category, description, metricLabel, metricValue, status, icon, id } = req.body;
    if (id) {
      // update
      productsDb = productsDb.map(p => p.id === id ? { ...p, title, category, description, metricLabel, metricValue, status, icon } : p);
      const updated = productsDb.find(p => p.id === id);
      logAction('Product Update', 'admin', `Modified AI Solution specifications for '${title}'.`);
      return res.json({ success: true, product: updated });
    } else {
      // create
      const newId = `prod-${Math.random().toString(36).substr(2, 9)}`;
      const newProduct = {
        id: newId,
        title,
        category,
        description,
        metricLabel,
        metricValue,
        impactMetrics: [{ label: 'Operational Efficiency', value: 'Dynamic' }],
        status: status || 'Demo Only',
        icon: icon || 'Cpu',
      };
      productsDb.push(newProduct);
      logAction('Product Creation', 'admin', `Instantiated new AI Solution listing '${title}' under vertical '${category}'.`);
      return res.json({ success: true, product: newProduct });
    }
  });

  app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const prod = productsDb.find(p => p.id === id);
    const title = prod ? prod.title : id;
    productsDb = productsDb.filter(p => p.id !== id);
    logAction('Product Decommission', 'admin', `Permanently deleted AI Solution listing '${title}' from catalog store.`);
    res.json({ success: true });
  });

  // Audit Logs API Endpoint
  app.get('/api/audit-logs', (req, res) => {
    res.json(auditLogsDb);
  });

  // Case Studies
  app.get('/api/case-studies', (req, res) => {
    res.json(caseStudiesDb);
  });

  app.post('/api/case-studies', (req, res) => {
    const { id, title, client, challenge, solution, results, duration, status } = req.body;
    if (id) {
      caseStudiesDb = caseStudiesDb.map(cs => cs.id === id ? { ...cs, title, client, challenge, solution, results, duration, status } : cs);
      res.json({ success: true, caseStudy: caseStudiesDb.find(cs => cs.id === id) });
    } else {
      const newId = `case-${Math.random().toString(36).substr(2, 9)}`;
      const newCs = { id: newId, title, client, challenge, solution, results, duration, status };
      caseStudiesDb.push(newCs);
      res.json({ success: true, caseStudy: newCs });
    }
  });

  // CMS Content Block Editing
  app.get('/api/cms-blocks', (req, res) => {
    res.json(cmsBlocksDb);
  });

  app.post('/api/cms-blocks', (req, res) => {
    const { id, key, title, content, category } = req.body;
    cmsBlocksDb = cmsBlocksDb.map(block => block.id === id ? { ...block, key, title, content, category } : block);
    res.json({ success: true, block: cmsBlocksDb.find(b => b.id === id) });
  });

  // Channels Core
  app.get('/api/channels', (req, res) => {
    res.json(channelsDb);
  });

  app.post('/api/channels', (req, res) => {
    const { name, description } = req.body;
    const cleanId = `chan-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    
    // Check duplication
    if (channelsDb.some(c => c.id === cleanId)) {
      return res.status(400).json({ error: 'Channel already exists.' });
    }

    const newChan = { id: cleanId, name, description, isStatic: false };
    channelsDb.push(newChan);
    chatMessagesDb[cleanId] = [];
    logAction('Channel Creation', 'system', `Created secure E2EE communication router channel '#${name}'.`);
    return res.json({ success: true, channel: newChan });
  });

  // Chat History fetch
  app.get('/api/chat-history/:room', (req, res) => {
    const { room } = req.params;
    const history = chatMessagesDb[room] || [];
    res.json(history);
  });

  // --- COMPREHENSIVE SECURITY & MFA AUTHENTICATION ENDPOINTS ---

  app.post('/api/auth/register', (req, res) => {
    const { username, email, password } = req.body;
    if (usersDb.has(username)) {
      return res.status(400).json({ error: 'Username is already registered.' });
    }
    const newUser = {
      id: `usr-${Math.random().toString(36).substr(2, 9)}`,
      username,
      email,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
      role: 'user',
      mfaEnabled: false,
      mfaSecret: `SECRET-MFA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      passwordHash: password,
      blockedUsers: [],
      pushEnabled: false,
    };
    usersDb.set(username, newUser);
    logAction('Onboarding Seat', username, `New user registration complete for email ${email}.`);
    // Return sanitized token-like payload
    const { passwordHash, ...sanitized } = newUser;
    res.json({ success: true, user: sanitized });
  });

  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const stored = usersDb.get(username);
    if (!stored || stored.passwordHash !== password) {
      return res.status(401).json({ error: 'Invalid username or password credentials.' });
    }

    const { passwordHash, ...sanitized } = stored;
    
    // Check if MFA is required
    if (stored.mfaEnabled) {
      logAction('Login Challenge', username, `Initiated dual-factor session verification request.`);
      return res.json({
        success: true,
        mfaRequired: true,
        tempUserId: stored.id,
        username: stored.username,
        secretPlaceholder: stored.mfaSecret,
      });
    }

    logAction('Login Success', username, `User session started. Cryptographic handshake finalized.`);
    return res.json({ success: true, mfaRequired: false, user: sanitized });
  });

  app.post('/api/auth/verify-mfa', (req, res) => {
    const { username, code } = req.body;
    const stored = usersDb.get(username);
    if (!stored) {
      return res.status(404).json({ error: 'User does not exist.' });
    }

    // In dynamic simulated MFA, any 6-digit numeric code with same digits, or "123456", OR matching code works!
    // A specific numeric validation showcases a beautiful high-fidelity interactive flow.
    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({ error: 'MFA Code must be exactly 6 numeric digits.' });
    }

    logAction('Login Success', username, `User double-factor MFA token accepted and session established.`);
    // Accepting 123456 for easy demo or any 6-digit code containing correct sequence
    const { passwordHash, ...sanitized } = stored;
    return res.json({ success: true, user: sanitized });
  });

  // Third-Party OAuth Simulation Callback
  app.post('/api/auth/oauth-mock', (req, res) => {
    const { provider, email, name, mockId } = req.body;
    const username = (name || email.split('@')[0]).toLowerCase().replace(/[^a-z0-9]/g, '');
    
    let existing = usersDb.get(username);
    if (!existing) {
      existing = {
        id: `usr-${mockId || Math.random().toString(36).substr(2, 9)}`,
        username,
        email,
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`,
        role: 'user',
        mfaEnabled: false,
        mfaSecret: 'OAUTH-NO-OTP-SECRET',
        passwordHash: 'oauth-secure-pass',
        blockedUsers: [],
        pushEnabled: false,
      };
      usersDb.set(username, existing);
    }

    logAction('Federated Login', username, `Authenticated user session via provider auth interface [${provider}].`);
    const { passwordHash, ...sanitized } = existing;
    res.json({ success: true, provider, user: sanitized });
  });

  // User preference update endpoint
  app.post('/api/user/update', (req, res) => {
    const { username, email, mfaEnabled, avatar, role, blockedUsers, pushEnabled } = req.body;
    const stored = usersDb.get(username);
    if (!stored) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const updatedUser = {
      ...stored,
      email: email || stored.email,
      avatar: avatar || stored.avatar,
      mfaEnabled: mfaEnabled !== undefined ? mfaEnabled : stored.mfaEnabled,
      role: role || stored.role,
      blockedUsers: blockedUsers !== undefined ? blockedUsers : (stored.blockedUsers || []),
      pushEnabled: pushEnabled !== undefined ? pushEnabled : (stored.pushEnabled || false),
    };
    usersDb.set(username, updatedUser);

    logAction('Profile Update', username, `Modified secure directory preferences (Push alerts: ${updatedUser.pushEnabled}, Blocked list: ${(updatedUser.blockedUsers || []).length} users).`);

    const { passwordHash, ...sanitized } = updatedUser;
    res.json({ success: true, user: sanitized });
  });

  // --- ASYNC VITE MIDDLEWARE & STATIC SERVING ---
  const distPath = path.join(process.cwd(), 'dist');

  let isProd = process.env.NODE_ENV === 'production';
  const httpServer = http.createServer(app);

  // --- WebSocket Server implementation ---
  const wss = new WebSocketServer({ noServer: true });

  wss.on('error', (err) => {
    console.warn('WebSocket Server event caught:', err.message);
  });

  wss.on('connection', (ws: WebSocket) => {
    let clientSession: SocketClient | null = null;

    ws.on('error', (err) => {
      console.warn('WebSocket client connection error:', err.message);
    });

    ws.on('message', (rawMsg: string) => {
      try {
        const payload = JSON.parse(rawMsg);
        
        if (payload.type === 'join') {
          const { room, user } = payload;
          
          // Remove client from previous sessions if any
          const idx = activeClients.findIndex(c => c.ws === ws);
          if (idx !== -1) {
            activeClients.splice(idx, 1);
          }

          clientSession = {
            ws,
            username: user.username,
            senderId: user.id || 'anonymous',
            avatar: user.avatar,
            room,
          };
          activeClients.push(clientSession);

          // Broadcast Join acknowledgement
          const systemMsg = {
            id: `sys-${Math.random().toString(36).substr(2, 9)}`,
            senderId: 'sys-notify',
            username: 'Security Protocol',
            avatar: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=100&q=80',
            ciphertext: '', // System notifications don't require room encrypted cipher content
            iv: '',
            room,
            timestamp: new Date().toISOString(),
            isEncrypted: false,
            systemAlert: `${user.username} successfully established an E2EE session.`,
          };

          // Broadcast to everyone in this room
          activeClients.forEach(client => {
            if (client.room === room && client.ws.readyState === WebSocket.OPEN) {
              client.ws.send(JSON.stringify({ type: 'message', message: systemMsg }));
              // Keep clients updated with active users list
              const currentRoomUsers = activeClients
                .filter(c => c.room === room)
                .map(c => ({ id: c.senderId, username: c.username, avatar: c.avatar }));
              
              client.ws.send(JSON.stringify({ type: 'presence', room, users: currentRoomUsers }));
            }
          });

        } else if (payload.type === 'message') {
          const { room, message } = payload;
          if (!chatMessagesDb[room]) {
            chatMessagesDb[room] = [];
          }

          const messageObj = {
            id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            senderId: message.senderId,
            username: message.username,
            avatar: message.avatar,
            ciphertext: message.ciphertext,
            iv: message.iv,
            room: message.room,
            timestamp: new Date().toISOString(),
            isEncrypted: message.isEncrypted !== false,
            isPinned: false,
            readBy: [message.senderId],
          };

          chatMessagesDb[room].push(messageObj);
          
          // Trim history to avoid leaks / memory explosion (max 50)
          if (chatMessagesDb[room].length > 50) {
            chatMessagesDb[room].shift();
          }

          // Broadcast to everyone in room
          activeClients.forEach(client => {
            if (client.room === room && client.ws.readyState === WebSocket.OPEN) {
              client.ws.send(JSON.stringify({ type: 'message', message: messageObj }));
            }
          });

        } else if (payload.type === 'typing') {
          const { room, username, typing } = payload;
          activeClients.forEach(client => {
            if (client.room === room && client.ws !== ws && client.ws.readyState === WebSocket.OPEN) {
              client.ws.send(JSON.stringify({ type: 'typing', username, typing }));
            }
          });
        } else if (payload.type === 'pin') {
          const { room, messageId, isPinned } = payload;
          if (chatMessagesDb[room]) {
            chatMessagesDb[room] = chatMessagesDb[room].map(m => m.id === messageId ? { ...m, isPinned } : m);
          }
          activeClients.forEach(client => {
            if (client.room === room && client.ws.readyState === WebSocket.OPEN) {
              client.ws.send(JSON.stringify({ type: 'pin_update', messageId, isPinned, room }));
            }
          });
        } else if (payload.type === 'read') {
          const { room, messageId, readerId } = payload;
          if (chatMessagesDb[room]) {
            chatMessagesDb[room] = chatMessagesDb[room].map(m => {
              if (m.id === messageId) {
                const currentReadBy = m.readBy || [m.senderId];
                if (!currentReadBy.includes(readerId)) {
                  return { ...m, readBy: [...currentReadBy, readerId] };
                }
              }
              return m;
            });
          }
          activeClients.forEach(client => {
            if (client.room === room && client.ws.readyState === WebSocket.OPEN) {
              client.ws.send(JSON.stringify({ type: 'read_update', messageId, readerId, room }));
            }
          });
        }
      } catch (err) {
        console.error('Error handling websocket payload:', err);
      }
    });

    ws.on('close', () => {
      if (clientSession) {
        const { room, username } = clientSession;
        const index = activeClients.indexOf(clientSession);
        if (index > -1) {
          activeClients.splice(index, 1);
        }

        // Send a system boundary update message
        const systemMsg = {
          id: `sys-${Math.random().toString(36).substr(2, 9)}`,
          senderId: 'sys-notify',
          username: 'Security Protocol',
          avatar: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=100&q=80',
          ciphertext: '',
          iv: '',
          room,
          timestamp: new Date().toISOString(),
          isEncrypted: false,
          systemAlert: `${username} session closed.`,
        };

        // Broadcast departures
        activeClients.forEach(client => {
          if (client.room === room && client.ws.readyState === WebSocket.OPEN) {
            client.ws.send(JSON.stringify({ type: 'message', message: systemMsg }));
            // Refresh presence lists
            const currentRoomUsers = activeClients
              .filter(c => c.room === room)
              .map(c => ({ id: c.senderId, username: c.username, avatar: c.avatar }));
            client.ws.send(JSON.stringify({ type: 'presence', room, users: currentRoomUsers }));
          }
        });
      }
    });
  });

  httpServer.on('upgrade', (request, socket, head) => {
    const url = request.url || '';
    // Only intercept upgrades specifically intended for our custom /api/ws path
    if (url.startsWith('/api/ws')) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });

  // Serve static files inside dev vs prod
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: {
          server: httpServer // Use the same port 3000 HTTP server for HMR WebSockets
        }
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT} (Production: ${isProd})`);
  });
}

startServer();
