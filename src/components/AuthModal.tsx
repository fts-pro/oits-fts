import React, { useState } from 'react';
import { User } from '../types';
import { KeyRound, ShieldCheck, Mail, User as UserIcon, Lock, Globe, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  onSuccess: (user: User, rememberMe?: boolean) => void;
  onClose?: () => void;
}

export default function AuthModal({ onSuccess, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('user'); // pre-filled for demo ease
  const [password, setPassword] = useState('user123'); // pre-filled
  const [email, setEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  // MFA states
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaSecret, setMfaSecret] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 5) score += 1;
    if (pass.length > 8) score += 1;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return Math.min(4, score);
  };

  // Trigger simulated third-party OAuth
  const handleOAuth = async (provider: 'Google' | 'GitHub') => {
    setIsLoading(true);
    setError(null);
    try {
      const mockEmail = `${username || 'oauth-user'}@gmail.com`;
      const response = await fetch('/api/auth/oauth-mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          email: mockEmail,
          name: username || 'OAuth User',
          mockId: `oauth-${Math.random().toString(36).substr(2, 5)}`
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        onSuccess(data.user, rememberMe);
      } else {
        setError(data.error || 'OAuth Authentication failed.');
      }
    } catch (err) {
      setError('Failed to connect to authentication server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please provide both username and password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (mfaRequired) {
        // Submit MFA verification
        const response = await fetch('/api/auth/verify-mfa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, code: mfaCode }),
        });
        const data = await response.json();
        if (response.ok && data.success) {
          onSuccess({ ...data.user, twoFactorVerified: true }, rememberMe);
        } else {
          setError(data.error || 'Invalid 6-digit verification code.');
        }
      } else if (isLogin) {
        // Standard Login
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.error || 'Login failed.');
        } else if (data.mfaRequired) {
          setMfaRequired(true);
          setMfaSecret(data.secretPlaceholder);
          setError(null);
        } else {
          onSuccess(data.user, rememberMe);
        }
      } else {
        // Standard Register
        if (!email) {
          setError('Email address is required for registration.');
          setIsLoading(false);
          return;
        }
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
        });
        const data = await response.json();
        if (response.ok && data.success) {
          onSuccess(data.user, rememberMe);
        } else {
          setError(data.error || 'Registration failed.');
        }
      }
    } catch (err) {
      setError('Failed to connect to authentication server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={mfaRequired ? 'mfa' : isLogin ? 'login' : 'register'}
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -30, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="p-6 w-full"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 border border-blue-100 text-blue-600 rounded-xl mb-3 shadow-xs">
              <KeyRound className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold font-sans text-slate-850 tracking-tight">
              {mfaRequired ? 'Multi-Factor Verification' : isLogin ? 'Access Portal' : 'Register Corporate Account'}
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-1 leading-normal font-medium">
              {mfaRequired 
                ? 'Complete the 2FA audit guidelines to generate your E2EE workspace session.' 
                : 'Access secure, encrypted real-time communications.'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-lg font-mono font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!mfaRequired ? (
              <>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold font-sans mb-1.5">
                    Username ({isLogin ? 'Use "admin" or "user"' : 'Letters & Numbers'})
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <UserIcon className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.trim())}
                      className="w-full bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-slate-800 pl-9 pr-3 py-2.5 text-xs font-semibold outline-none transition-all placeholder:text-slate-400 shadow-inner"
                      placeholder="admin or user"
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold font-sans mb-1.5">
                      Corporate Email
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value.trim())}
                        className="w-full bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-slate-800 pl-9 pr-3 py-2.5 text-xs font-semibold outline-none transition-all placeholder:text-slate-400 shadow-inner"
                        placeholder="name@ai-innovations.corp"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold font-sans mb-1.5">
                    Enterprise Credentials ({isLogin ? 'Use "admin123" or "user123"' : 'Min 6 characters'})
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-slate-800 pl-9 pr-3 py-2.5 text-xs font-semibold outline-none transition-all placeholder:text-slate-400 shadow-inner"
                      placeholder="supersecret"
                    />
                  </div>
                  {!isLogin && password && (
                    <div className="mt-2 flex gap-1">
                      {[1, 2, 3, 4].map((level) => {
                        const strength = calculateStrength(password);
                        let color = 'bg-slate-200';
                        if (level <= strength) {
                          if (strength <= 2) color = 'bg-rose-500';
                          else if (strength === 3) color = 'bg-amber-500';
                          else color = 'bg-emerald-500';
                        }
                        return <div key={level} className={`h-1 flex-1 rounded-full ${color} transition-colors`} />;
                      })}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-2 mt-1">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="rememberMe" className="text-[10.5px] text-slate-500 font-sans font-semibold cursor-pointer">
                    Remember my device for 7 days
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
                >
                  {isLoading ? 'Verifying authentication...' : isLogin ? 'Authenticate Session' : 'Create Credentials'}
                </button>
                
                {isLogin && (
                  <div className="text-center font-sans text-[9px] text-slate-450 pt-1 leading-normal font-semibold">
                    DEMO LOGIN CLUES: <br />
                    <span className="text-slate-500">Admin credentials (CMS power + MFA mandatory)</span>: <span className="text-blue-600 font-bold">'admin'</span> / <span className="text-blue-600 font-bold">'admin123'</span> <br />
                    <span className="text-slate-500">Standard user (Dashboard config + MFA optional)</span>: <span className="text-blue-600 font-bold">'user'</span> / <span className="text-blue-600 font-bold">'user123'</span> <br />
                    <span className="text-slate-500">Viewer role (Read-only access)</span>: <span className="text-blue-600 font-bold">'viewer'</span> / <span className="text-blue-600 font-bold">'viewer123'</span>
                  </div>
                )}

                <div className="relative my-4 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <span className="relative px-2 bg-white text-[10px] uppercase font-sans font-bold text-slate-400 tracking-wider">
                    Or Onboard via Federated OAuth
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleOAuth('Google')}
                    className="flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 hover:border-slate-350 hover:bg-slate-100/50 text-slate-700 font-sans font-bold text-xs py-2 px-3 rounded-xl transition-all shadow-xs"
                  >
                    <Globe className="w-3.5 h-3.5 text-blue-650" />
                    Google Workspace
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOAuth('GitHub')}
                    className="flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 hover:border-slate-350 hover:bg-slate-100/50 text-slate-700 font-sans font-bold text-xs py-2 px-3 rounded-xl transition-all shadow-xs"
                  >
                    <Github className="w-3.5 h-3.5 text-slate-750" />
                    GitHub Enterprise
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">2FA Required for {username}</h4>
                      <p className="text-[10px] text-slate-500 font-medium font-sans">Authenticator token: <span className="font-mono text-blue-600 font-bold">{mfaSecret}</span></p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold font-sans mb-1.5 text-center">
                    Enter 6-Digit Authenticator Token
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full font-mono text-xl text-center bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-slate-900 tracking-[0.75em] py-3 outline-none transition-all placeholder:text-slate-300 font-semibold"
                    placeholder="------"
                  />
                  <span className="block text-[9px] text-slate-450 text-center font-sans font-semibold mt-2">
                    (Simulated MFA: enter <span className="text-slate-650 font-bold">'123456'</span> or any 6 digits to verify)
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || mfaCode.length !== 6}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
                >
                  Verify & Authorize Keyring
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setMfaRequired(false);
                    setMfaCode('');
                  }}
                  className="w-full bg-transparent hover:bg-slate-50 text-slate-505 hover:text-slate-800 font-sans font-bold text-xs py-2 rounded-xl transition-all border border-transparent hover:border-slate-200"
                >
                  Back to Login
                </button>
              </div>
            )}

            {!mfaRequired && (
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError(null);
                  }}
                  className="text-xs font-sans text-blue-600 hover:text-blue-700 font-bold transition-colors"
                >
                  {isLogin ? "Don't have a corporate seat? Register" : "Already have access? Log in"}
                </button>
              </div>
            )}
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
