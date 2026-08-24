export interface Message {
  id: string;
  senderId: string;
  username: string;
  avatar: string;
  ciphertext: string;
  iv: string;
  room: string;
  timestamp: string;
  isEncrypted: boolean;
  isPinned?: boolean;
  readBy?: string[];
}

export interface SecurityLog {
  id: string;
  timestamp: string;
  ip: string;
  action: string;
  status: 'success' | 'failure';
  type: 'LOGIN' | 'MFA' | 'SIGN';
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  role: 'user' | 'admin' | 'viewer';
  mfaEnabled: boolean;
  mfaSecret?: string;
  twoFactorVerified?: boolean;
  blockedUsers?: string[];
  pushEnabled?: boolean;
  securityLogs?: SecurityLog[];
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  passphrase?: string; // used locally for E2EE
  isStatic?: boolean;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  description: string;
  metricLabel: string;
  metricValue: string;
  impactMetrics: { label: string; value: string }[];
  status: 'Live & Production' | 'MVP Complete' | 'Demo Only';
  icon: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  challenge: string[];
  solution: string[];
  results: string[];
  duration: string;
  status: string;
}

export interface CMSBlock {
  id: string;
  key: string;
  title: string;
  content: string;
  category: string;
}

export enum SectionId {
  HOME = 'home',
  ABOUT = 'about',
  SERVICES = 'services',
  PORTFOLIO = 'portfolio',
  PROCESS = 'process',
  CONTACT = 'contact',
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  fullDescription?: string;
  problemStatement?: string;
  technicalApproach?: string;
  results?: string;
  technologies?: string[];
  status?: string;
  duration?: string;
  imageUrl: string;
  demoVideoUrl?: string;
}

export interface Service {
  id: string;
  category: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  detailedFeatures?: string[];
  advantages?: string[];
  caseStudy?: { impact: string; quote: string; client: string };
  documentationUrl?: string;
}

