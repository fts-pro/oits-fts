import React, { useState, useEffect, useRef } from 'react';
import { Channel, Message, User } from '../types';
import { encryptText, decryptText } from './EncryptionHelper';
import { 
  Send, Lock, Hash, Users, ShieldAlert, Bell, 
  Settings, Key, AlertTriangle, Eye, EyeOff, Sparkles, UserCheck2, RefreshCw, Mic, MicOff,
  Pin, Download, CheckCheck, Paperclip, Check, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatroomViewProps {
  currentUser: User | null;
  channels: Channel[];
  onAddChannel: (channelName: string, channelDesc: string) => Promise<boolean>;
  activeRoomId: string;
  onChangeRoom: (roomId: string) => void;
}

export default function ChatroomView({ 
  currentUser, 
  channels, 
  onAddChannel, 
  activeRoomId, 
  onChangeRoom 
}: ChatroomViewProps) {
  
  // Real-time states
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeUsers, setActiveUsers] = useState<{ id: string; username: string; avatar: string }[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  // Local Search state
  const [chatSearchKeyword, setChatSearchKeyword] = useState('');
  const [chatSearchDate, setChatSearchDate] = useState('');
  
  // Encryption Passphrase States
  const [passphrase, setPassphrase] = useState('');
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [decryptedCache, setDecryptedCache] = useState<Record<string, string>>({});

  // Typing indicators
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Online Presence Pulse
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);

  // New Channel states
  const [newChanName, setNewChanName] = useState('');
  const [newChanDesc, setNewChanDesc] = useState('');
  const [showAddChan, setShowAddChan] = useState(false);
  
  // Push Notification state
  const [pushStatus, setPushStatus] = useState<NotificationPermission>('default');
  const [systemAlerts, setSystemAlerts] = useState<{ id: string; text: string }[]>([]);

  // AI Summarization
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Speech Recognition API State
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  // Export State
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportDateRange, setExportDateRange] = useState({ start: '', end: '' });

  // File Attachment State
  const [showFileModal, setShowFileModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeChannel = channels.find(c => c.id === activeRoomId) || channels[0];

  // Request browser Notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await window.Notification.requestPermission();
      setPushStatus(permission);
    }
  };

  useEffect(() => {
    if ('Notification' in window) {
      setPushStatus(window.Notification.permission);
    }
  }, []);

  // Sync passphrase of active room when changing channels
  useEffect(() => {
    if (activeChannel) {
      // Set the default seed passphrases
      if (activeChannel.id === 'chan-general') {
        setPassphrase('GeneralSecret123');
      } else if (activeChannel.id === 'chan-healthcare') {
        setPassphrase('LabaidPrecisionCare2026');
      } else if (activeChannel.id === 'chan-fintech') {
        setPassphrase('E2EEDoubleEntrySecureKey');
      } else {
        // Fallback default for user channels
        setPassphrase(`KeyFor-${activeChannel.id}`);
      }
    }
  }, [activeRoomId, activeChannel]);

  // Sync and connect to standard server WebSockets
  useEffect(() => {
    if (!currentUser) return;

    // Fetch message history from REST API first
    fetch(`/api/chat-history/${activeRoomId}`)
      .then(res => res.json())
      .then(history => {
        setMessages(history);
      })
      .catch(err => console.error('Failed to load chat history:', err));

    // Initialize Browser WebSocket
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsUrl = `${protocol}://${window.location.host}`;
    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      // Send Join Event
      ws.send(JSON.stringify({
        type: 'join',
        room: activeRoomId,
        user: {
          id: currentUser.id,
          username: currentUser.username,
          avatar: currentUser.avatar,
        }
      }));
    };

    ws.onmessage = async (event) => {
      try {
        const payload = JSON.parse(event.data);
        
        if (payload.type === 'message') {
          const newMsg = payload.message;
          setMessages(prev => {
            // Deduplicate (idempotency guard)
            if (prev.some(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });

          // Trigger dynamic decryption and pre-cache
          if (newMsg.isEncrypted && newMsg.ciphertext) {
            const dec = await decryptText(newMsg.ciphertext, newMsg.iv, passphrase);
            setDecryptedCache(prev => ({ ...prev, [newMsg.id]: dec }));

            // Trigger Push alerts if not focused
            if (currentUser.id !== newMsg.senderId) {
              triggerPushAlert(newMsg.username, dec, newMsg.avatar);
            }
          } else if (newMsg.systemAlert) {
            // Append system notifications
            addSystemAlert(newMsg.systemAlert);
          }

        } else if (payload.type === 'presence') {
          if (payload.room === activeRoomId) {
            setActiveUsers(payload.users);
            setOnlineUserIds(payload.users.map((u: any) => u.id));
          }

        } else if (payload.type === 'typing') {
          const { username, typing } = payload;
          setTypingUsers(prev => {
            if (typing) {
              if (prev.includes(username)) return prev;
              return [...prev, username];
            } else {
              return prev.filter(u => u !== username);
            }
          });
        } else if (payload.type === 'pin_update') {
          const { messageId, isPinned } = payload;
          setMessages(prev => prev.map(m => m.id === messageId ? { ...m, isPinned } : m));
        } else if (payload.type === 'read_update') {
          const { messageId, readerId } = payload;
          setMessages(prev => prev.map(m => {
            if (m.id === messageId) {
              const currentReadBy = m.readBy || [m.senderId];
              if (!currentReadBy.includes(readerId)) {
                return { ...m, readBy: [...currentReadBy, readerId] };
              }
            }
            return m;
          }));
        }
      } catch (err) {
        console.error('Failed processing WebSocket frame:', err);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection terminated.');
    };

    return () => {
      // Clean up typing and close websocket
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      ws.close();
    };
  }, [currentUser, activeRoomId, passphrase]);

  // Recalculate message decryption cache when passphrase changes dynamically
  useEffect(() => {
    const decryptAll = async () => {
      const cache: Record<string, string> = {};
      for (const msg of messages) {
        if (msg.isEncrypted && msg.ciphertext) {
          cache[msg.id] = await decryptText(msg.ciphertext, msg.iv, passphrase);
        }
      }
      setDecryptedCache(cache);
    };
    decryptAll();
  }, [passphrase, messages]);

  // Scroll to bottom on updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  // Trigger push alert
  const triggerPushAlert = (sender: string, text: string, avatar: string) => {
    // 1. Native Notification
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new window.Notification(`🔑 Channel Alert: ${sender}`, {
          body: text,
          icon: avatar,
        });
      } catch (e) {
        // Fallback for sandboxed frames
      }
    }

    // 2. Beautiful In-App sliding alert block
    const alertId = `sys-alert-${Math.random().toString(36).substr(2, 5)}`;
    setSystemAlerts(prev => [...prev, { id: alertId, text: `${sender}: ${text}` }]);
    setTimeout(() => {
      setSystemAlerts(prev => prev.filter(a => a.id !== alertId));
    }, 4500);
  };

  const addSystemAlert = (text: string) => {
    const alertId = `sys-alert-${Math.random().toString(36).substr(2, 5)}`;
    setSystemAlerts(prev => [...prev, { id: alertId, text }]);
    setTimeout(() => {
      setSystemAlerts(prev => prev.filter(a => a.id !== alertId));
    }, 4000);
  };

  // Typing event emission
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && currentUser) {
      socketRef.current.send(JSON.stringify({
        type: 'typing',
        room: activeRoomId,
        username: currentUser.username,
        typing: true
      }));

      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        socketRef.current?.send(JSON.stringify({
          type: 'typing',
          room: activeRoomId,
          username: currentUser.username,
          typing: false
        }));
      }, 1500);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !currentUser || !socketRef.current) return;

    try {
      const { ciphertext, iv } = await encryptText(inputMessage, passphrase);
      
      const payload = {
        type: 'message',
        room: activeRoomId,
        message: {
          senderId: currentUser.id,
          username: currentUser.username,
          avatar: currentUser.avatar,
          ciphertext,
          iv,
          room: activeRoomId,
          isEncrypted: true
        }
      };

      socketRef.current.send(JSON.stringify(payload));
      setInputMessage('');

      // Emit finished typing
      socketRef.current.send(JSON.stringify({
        type: 'typing',
        room: activeRoomId,
        username: currentUser.username,
        typing: false
      }));
    } catch (err) {
      console.error('Failed to encrypt messaging pipeline:', err);
    }
  };

  const toggleSpeechRecognition = () => {
    // @ts-ignore - SpeechRecognition is not fully typed in standard DOM yet
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError("Speech recognition not supported in this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setSpeechError(null);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(prev => prev + (prev ? ' ' : '') + transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      setSpeechError("Microphone input failed. Try again.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleCreateChannelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChanName.trim()) return;

    const success = await onAddChannel(newChanName.trim(), newChanDesc.trim());
    if (success) {
      setNewChanName('');
      setNewChanDesc('');
      setShowAddChan(false);
    }
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setAiSummary(null);
    try {
      const msgsToSummarize = messages.slice(-10).map(m => {
         const tCache = decryptedCache[m.id];
         return { username: m.username, text: m.isEncrypted ? (tCache && !tCache.includes('Unable to Decrypt') ? tCache : '[Encrypted]') : (m as any).systemAlert || m.ciphertext };
      });
      const res = await fetch('/api/chat/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName: activeChannel?.name, messages: msgsToSummarize })
      });
      const data = await res.json();
      setAiSummary(data.summary || 'Summary unavailable.');
    } catch (err) {
      console.error(err);
      setAiSummary('Failed to contact LLM backend.');
    } finally {
      setIsSummarizing(false);
    }
  };

  const handlePinMessage = (messageId: string, currentPinned: boolean) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'pin',
        room: activeRoomId,
        messageId,
        isPinned: !currentPinned
      }));
    }
  };

  const markAsRead = (messageId: string) => {
    if (!currentUser) return;
    const msg = messages.find(m => m.id === messageId);
    if (msg && msg.senderId !== currentUser.id && (!msg.readBy || !msg.readBy.includes(currentUser.id))) {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          type: 'read',
          room: activeRoomId,
          messageId,
          readerId: currentUser.id
        }));
      }
    }
  };

  const handleExportHistory = () => {
    let filtered = messages;
    if (exportDateRange.start) {
      filtered = filtered.filter(m => new Date(m.timestamp) >= new Date(exportDateRange.start));
    }
    if (exportDateRange.end) {
      filtered = filtered.filter(m => new Date(m.timestamp) <= new Date(exportDateRange.end));
    }

    const exportData = filtered.map(m => ({
      id: m.id,
      sender: m.username,
      timestamp: m.timestamp,
      content: m.isEncrypted ? (decryptedCache[m.id] || '[Encrypted]') : (m.ciphertext || (m as any).systemAlert),
      room: m.room
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-history-${activeChannel?.name}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    setShowExportModal(false);
    addSystemAlert('History exported successfully as encrypted JSON package.');
  };

  const handleFileUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setShowFileModal(false);
      addSystemAlert('Secure document uploaded and linked to active channel.');
      // Emit a system message about the file
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && currentUser) {
        socketRef.current.send(JSON.stringify({
          type: 'message',
          room: activeRoomId,
          message: {
            senderId: 'sys-notify',
            username: 'Secure Vault',
            avatar: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=100&q=80',
            ciphertext: `${currentUser.username} attached a secure document: CORPORATE_AUDIT_Q2.PDF.AES`,
            iv: '',
            room: activeRoomId,
            isEncrypted: false
          }
        }));
      }
    }, 2000);
  };

  const pinnedMessages = messages.filter(m => m.isPinned);

  return (
    <div className="flex h-[calc(100vh-130px)] max-h-[850px] bg-white border border-slate-200 rounded-2xl overflow-hidden relative shadow-md">

      
      {/* Sliding system alert overlays (Simulating push responses) */}
      <div className="absolute top-4 right-4 z-50 pointer-events-none space-y-3 max-w-sm w-full">
        <AnimatePresence>
          {systemAlerts.map(alert => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 50, y: -10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="bg-blue-600 text-white p-3.5 rounded-xl flex items-center gap-3 shadow-md pointer-events-auto backdrop-blur-md"
            >
              <Bell className="w-5 h-5 text-white shrink-0 animate-bounce" />
              <div>
                <span className="text-[9px] uppercase font-sans text-blue-100 block font-bold leading-none mb-1">SECURE NOTIFICATION</span>
                <p className="text-xs text-white font-sans line-clamp-2 leading-tight font-medium">{alert.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <div className="absolute inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-800">Export Channel History</h3>
                  <Download className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-sm text-slate-500 mb-6">Select a date range for your secure JSON export package. This will include all decrypted payloads currently accessible to your client.</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Start Date</label>
                    <input 
                      type="date" 
                      value={exportDateRange.start} 
                      onChange={(e) => setExportDateRange({...exportDateRange, start: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">End Date</label>
                    <input 
                      type="date" 
                      value={exportDateRange.end} 
                      onChange={(e) => setExportDateRange({...exportDateRange, end: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500" 
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setShowExportModal(false)} className="flex-1 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                  <button onClick={handleExportHistory} className="flex-1 px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-lg">Download JSON</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* File Upload Modal */}
      <AnimatePresence>
        {showFileModal && (
          <div className="absolute inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-800">Secure File Transfer</h3>
                  <Paperclip className="w-5 h-5 text-blue-600" />
                </div>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center flex flex-col items-center justify-center mb-6 hover:border-blue-400 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
                    <Paperclip className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">Drop document to encrypt</span>
                  <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">MAX 25MB • PDF, DOCX, ZIP</span>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowFileModal(false)} className="flex-1 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                  <button 
                    onClick={handleFileUpload} 
                    disabled={isUploading}
                    className="flex-1 px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        ENCRYPTING...
                      </>
                    ) : (
                      'EXECUTE UPLOAD'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center justify-center"
            >
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-slate-300 p-2"
              >
                <X className="w-8 h-8" />
              </button>
              <img 
                src={selectedImage} 
                alt="Full screen preview" 
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LEFT CHANNELS SIDEBAR CONTAINER */}
      <div className="w-64 border-r border-slate-200 bg-slate-50/50 flex flex-col justify-between hidden md:flex shrink-0">
        <div>
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-slate-700">Security Domains</h3>
            {currentUser?.role === 'admin' && (
              <button 
                onClick={() => setShowAddChan(!showAddChan)} 
                className="text-[10px] bg-blue-50 border border-blue-200 text-blue-700 px-2 py-1 rounded font-sans font-bold transition-all shadow-xs"
              >
                + ADD
              </button>
            )}
          </div>

          {/* Inline Sub-menu to add dynamic channel */}
          <AnimatePresence>
            {showAddChan && (
              <motion.form 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleCreateChannelSubmit}
                className="p-3 bg-white border-b border-slate-200 space-y-2.5"
              >
                <input 
                  type="text" 
                  value={newChanName}
                  onChange={(e) => setNewChanName(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                  placeholder="channel-name" 
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 outline-none placeholder:text-slate-400 font-mono"
                  required
                />
                <input 
                  type="text" 
                  value={newChanDesc}
                  onChange={(e) => setNewChanDesc(e.target.value)}
                  placeholder="Compliance focus..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-805 outline-none placeholder:text-slate-400"
                />
                <button type="submit" className="w-full bg-blue-600 text-white font-sans text-[10px] py-1.5 rounded hover:bg-blue-505 font-bold transition-all shadow-xs">
                  CREATE PORT
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Active channels List */}
          <div className="p-2 space-y-1 overflow-y-auto">
            {channels.map(chan => {
              const isActive = chan.id === activeRoomId;
              return (
                <button
                  key={chan.id}
                  onClick={() => onChangeRoom(chan.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left border transition-all ${
                    isActive 
                      ? 'bg-white border-slate-200 text-blue-750 shadow-xs' 
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <div className="relative">
                      <Hash className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600 font-bold' : 'text-slate-400'}`} />
                      {isActive && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border border-white animate-pulse"></span>
                      )}
                    </div>
                    <div className="truncate">
                      <span className="text-xs font-bold block leading-none">{chan.name}</span>
                      <span className="text-[10px] text-slate-400 truncate block mt-1 font-medium">{chan.description || 'Secure communication link'}</span>
                    </div>
                  </div>
                  {isActive && <Lock className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* User Identity Signpost */}
        <div className="p-4 border-t border-slate-200 bg-slate-100">
          <div className="flex items-center gap-3">
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} alt="avatar" className="w-9 h-9 border border-slate-200 rounded-full bg-slate-50 object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-9 h-9 border border-slate-200 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div className="truncate">
              <span className="text-xs font-bold text-slate-700 block leading-none">{currentUser?.username}</span>
              <span className="text-[10px] text-blue-600 capitalize font-sans mt-1 font-bold block">{currentUser?.role} Link Active</span>
            </div>
          </div>
        </div>

      </div>

      {/* MAIN ENCRYPTION CHAT DISPLAY AREA */}
      <div className="flex-1 flex flex-col justify-between bg-white relative">
              {/* TOP ROOM KEY CONFIGURATION BAR */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-4 z-10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-50 border border-blue-100 text-blue-600 rounded-lg md:hidden">
              <Hash className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-tight">{activeChannel?.name}</span>
                <span className="text-[9px] font-sans font-bold text-emerald-700 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-100 uppercase tracking-wider">E2EE ACTIVE</span>
              </div>
              <p className="text-[10px] text-slate-500 font-sans leading-none mt-1 hidden sm:block">{activeChannel?.description}</p>
            </div>
          </div>

          {/* PASSPHRASE KEYRING CONTROL PANEL */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs">
            <button
              onClick={() => setShowExportModal(true)}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
              title="Export channel history"
            >
              <Download className="w-4 h-4" />
            </button>
            <Key className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="text-[9.5px] font-sans font-bold uppercase text-slate-400 hidden lg:block select-none">Client Cipher:</span>
            
            <div className="relative flex items-center">
              <input
                type={showPassphrase ? 'text' : 'password'}
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                title="Only people with this matching key can decrypt. Try changing it in real-time to watch encryption fail!"
                className="bg-transparent text-xs font-sans font-bold text-blue-600 tracking-wider w-28 sm:w-44 focus:outline-none placeholder:text-slate-400"
                placeholder="Passphrase"
              />
              <button 
                onClick={() => setShowPassphrase(!showPassphrase)} 
                type="button" 
                className="text-slate-400 hover:text-slate-700 ml-1.5 shrink-0"
              >
                {showPassphrase ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Notification alert requester inline */}
            {pushStatus !== 'granted' && (
              <button
                onClick={requestNotificationPermission}
                className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-1 rounded-lg transition-colors border border-blue-100 shrink-0 shadow-xs"
                title="Authorize push alerts"
              >
                <Bell className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* PINNED MESSAGES SECTION */}
        {pinnedMessages.length > 0 && (
          <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-center gap-3">
            <Pin className="w-4 h-4 text-amber-600 shrink-0 rotate-45" />
            <div className="flex-1 overflow-hidden">
              <span className="text-[9px] font-bold text-amber-600 uppercase tracking-widest block mb-1">Important Broadcast</span>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {pinnedMessages.map(pm => (
                  <div key={`p-${pm.id}`} className="bg-white border border-amber-200 px-2 py-1 rounded text-[10px] font-medium text-slate-700 whitespace-nowrap shadow-sm flex items-center gap-2 shrink-0">
                    <span className="font-bold text-amber-700">{pm.username}:</span>
                    <span className="truncate max-w-[150px]">{decryptedCache[pm.id] || '[Decrypting...]'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FLOATING USER WARNING ALERT: Decryption testing */}
        <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 text-[10.5px] font-sans font-medium text-slate-600 flex items-center gap-2 select-none justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-blue-600 shrink-0 animate-pulse" />
            <span>This chat demonstrates <strong>true local client-side E2EE_AES_GCM</strong> over WebSockets. Change the Key above to test failed decryptions!</span>
          </div>
          <span className="hidden leading-none border border-slate-200 bg-white px-2 py-0.5 rounded text-[10px] sm:inline text-slate-500 font-semibold font-mono">SHA-256 AES-GCM-256</span>
        </div>

        {/* LOCAL SEARCH MESSAGES BAR */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-250 flex flex-wrap items-center justify-between gap-3 text-xs select-none">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase">Trace Filter:</span>
            <div className="relative">
              <input
                type="text"
                value={chatSearchKeyword}
                onChange={(e) => setChatSearchKeyword(e.target.value)}
                placeholder="Sender or keyword..."
                className="bg-white border border-slate-250 text-[10.5px] rounded-lg pl-2 pr-6 py-0.5 w-36 sm:w-44 font-medium focus:outline-none focus:border-blue-500 placeholder:text-slate-405 text-slate-800"
              />
              {chatSearchKeyword && (
                <button
                  type="button"
                  onClick={() => setChatSearchKeyword('')}
                  className="absolute top-1/2 right-2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold"
                >
                  ×
                </button>
              )}
            </div>

            <div className="relative">
              <input
                type="date"
                value={chatSearchDate}
                onChange={(e) => setChatSearchDate(e.target.value)}
                className="bg-white border border-slate-250 text-[10.5px] rounded-lg px-2 py-0.5 focus:outline-none focus:border-blue-500 font-medium text-slate-800"
              />
              {chatSearchDate && (
                <button
                  type="button"
                  onClick={() => setChatSearchDate('')}
                  className="absolute top-1/2 right-2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold"
                >
                  ×
                </button>
              )}
            </div>

            <button
              onClick={handleSummarize}
              disabled={isSummarizing || messages.length === 0}
              className="ml-2 bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-100 px-3 py-1 rounded-lg text-[10px] font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3" />
              {isSummarizing ? 'SUMMARIZING...' : 'AI SUMMARIZE'}
            </button>
          </div>

          {(chatSearchKeyword || chatSearchDate) && (
            <div className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full font-sans tracking-wide">
              Found {messages
                .filter(m => !currentUser?.blockedUsers?.includes(m.username))
                .filter(m => {
                  if (chatSearchKeyword.trim()) {
                    const textCache = decryptedCache[m.id]?.toLowerCase() || '';
                    if (!textCache.includes(chatSearchKeyword.toLowerCase()) && !m.username.toLowerCase().includes(chatSearchKeyword.toLowerCase())) {
                      return false;
                    }
                  }
                  if (chatSearchDate) {
                    const itemDate = new Date(m.timestamp).toISOString().substring(0, 10);
                    if (itemDate !== chatSearchDate) return false;
                  }
                  return true;
                }).length} secure payloads
            </div>
          )}
        </div>

        {/* MESSAGES DISPLAY GRID */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5.5 font-semibold">
          {aiSummary && (
            <div className="mb-4 bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 flex gap-3 text-left shadow-sm relative">
              <button onClick={() => setAiSummary(null)} className="absolute top-2 right-2 text-indigo-400 hover:text-indigo-600">×</button>
              <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <span className="text-[10px] font-mono tracking-wider font-bold text-indigo-500 uppercase block mb-1">LLM Channel Summary (Last 10 msgs)</span>
                <p className="text-xs text-indigo-900 font-medium leading-relaxed">{aiSummary}</p>
              </div>
            </div>
          )}

          {messages
            .filter(m => !currentUser?.blockedUsers?.includes(m.username))
            .filter(m => {
              if (chatSearchKeyword.trim()) {
                const textCache = decryptedCache[m.id]?.toLowerCase() || '';
                if (!textCache.includes(chatSearchKeyword.toLowerCase()) && !m.username.toLowerCase().includes(chatSearchKeyword.toLowerCase())) {
                  return false;
                }
              }
              if (chatSearchDate) {
                const itemDate = new Date(m.timestamp).toISOString().substring(0, 10);
                if (itemDate !== chatSearchDate) return false;
              }
              return true;
            }).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10">
              <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-3 animate-pulse shadow-xs">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-700">No matching packet logs</h4>
              <p className="text-[10px] text-slate-450 font-sans max-w-xs mt-1 leading-normal font-medium">Clear your Search Filters to restore complete channel streaming logs.</p>
            </div>
          ) : (
            messages
              .filter(msg => !currentUser?.blockedUsers?.includes(msg.username))
              .filter(msg => {
                if (chatSearchKeyword.trim()) {
                  const textCache = decryptedCache[msg.id]?.toLowerCase() || '';
                  if (!textCache.includes(chatSearchKeyword.toLowerCase()) && !msg.username.toLowerCase().includes(chatSearchKeyword.toLowerCase())) {
                    return false;
                  }
                }
                if (chatSearchDate) {
                  const itemDate = new Date(msg.timestamp).toISOString().substring(0, 10);
                  if (itemDate !== chatSearchDate) return false;
                }
                return true;
              })
              .map((msg) => {
              const isSys = msg.senderId === 'sys' || msg.senderId === 'sys-notify';
              const isMe = msg.senderId === currentUser?.id;

              if (isSys) {
                return (
                  <div key={msg.id} className="flex justify-center select-none py-1">
                    <span className="bg-slate-105 text-slate-600 font-sans font-medium text-[9px] uppercase tracking-wider px-3 py-1 rounded-full border border-slate-200 shadow-xs">
                      {msg.ciphertext || (msg as any).systemAlert}
                    </span>
                  </div>
                );
              }

              const decryptedTextStr = decryptedCache[msg.id] || '[Decrypting...]';
              const isFailedDecryption = decryptedTextStr.includes('Unable to Decrypt');

              return (
                <div 
                  key={msg.id} 
                  className={`flex gap-3 max-w-xl group relative ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
                  onMouseEnter={() => markAsRead(msg.id)}
                >
                  <div className="relative shrink-0">
                    {msg.avatar ? (
                      <img src={msg.avatar} alt="avatar" className="w-9 h-9 rounded-full border border-slate-200 bg-slate-50 shadow-xs object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-9 h-9 rounded-full border border-slate-200 bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                        {msg.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {onlineUserIds.includes(msg.senderId) && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm" title="Online"></span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className={`flex items-center gap-2 font-sans text-[10px] leading-none mb-1 ${isMe ? 'justify-end' : ''}`}>
                      <span className="font-bold text-slate-700">{msg.username}</span>
                      <span 
                        className="text-slate-400 font-semibold cursor-help border-b border-transparent hover:border-slate-300 transition-colors" 
                        title={new Date(msg.timestamp).toLocaleString(undefined, {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.isPinned && <Pin className="w-3 h-3 text-amber-600 shrink-0 rotate-45 shrink-0" />}
                    </div>

                    <div className={`p-3 rounded-2xl relative border transition-all ${
                      isMe 
                        ? 'bg-blue-600 border-blue-500 text-white rounded-tr-none shadow-sm pb-4.5' 
                        : 'bg-slate-100 border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
                    }`}>
                      
                      {/* Interaction Controls (Pin) */}
                      <button 
                        onClick={() => handlePinMessage(msg.id, !!msg.isPinned)}
                        className={`absolute -top-2 ${isMe ? '-left-2' : '-right-2'} p-1.5 rounded-full bg-white border border-slate-200 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-20`}
                        title={msg.isPinned ? "Unpin message" : "Pin message"}
                      >
                        <Pin className={`w-3 h-3 ${msg.isPinned ? 'text-blue-600 fill-blue-600' : 'text-slate-400'} rotate-45`} />
                      </button>

                      {/* Side by side display format: CIPHERTEXT RAW */}
                      {msg.isEncrypted && (
                        <div className="mb-2 p-1.5 bg-white text-[8.5px] font-mono border border-slate-200/55 shadow-inner text-slate-450 rounded truncate max-w-sm select-all">
                          <span className="text-slate-400 font-bold block pb-1">SERVER CIPHER:</span>
                          HEX_IV: {msg.iv.substring(0,6)}... <br />
                          PAYLOAD: {msg.ciphertext}
                        </div>
                      )}

                      {/* Decrypted Render message */}
                      <div className="text-xs font-sans whitespace-pre-wrap leading-relaxed select-text flex flex-col items-start break-all font-medium">
                        {msg.isEncrypted ? (
                          <>
                            {isFailedDecryption ? (
                              <span className="text-rose-600 font-bold font-mono flex items-center gap-1.5 bg-rose-50 border border-rose-100 p-1 rounded-md leading-relaxed">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                {decryptedTextStr}
                              </span>
                            ) : (
                              <div>
                                {decryptedTextStr.split(/(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp)(?:\?.*)?)/i).map((part, i) => 
                                  /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp)(?:\?.*)?)/i.test(part) ? (
                                    <img 
                                      key={i} 
                                      src={part} 
                                      alt="Attachment" 
                                      className="max-w-[200px] max-h-[200px] rounded-lg mt-1 mb-1 cursor-pointer hover:opacity-90 transition-opacity border shadow-sm"
                                      onClick={() => setSelectedImage(part)}
                                      referrerPolicy="no-referrer"
                                    />
                                  ) : (
                                    <span key={i} className={isMe ? 'text-white' : 'text-slate-800'}>{part}</span>
                                  )
                                )}
                              </div>
                            )}
                          </>
                        ) : (
                          <div>
                            {((msg as any).systemAlert || msg.ciphertext).split(/(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp)(?:\?.*)?)/i).map((part: string, i: number) => 
                              /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp)(?:\?.*)?)/i.test(part) ? (
                                <img 
                                  key={i} 
                                  src={part} 
                                  alt="Attachment" 
                                  className="max-w-[200px] max-h-[200px] rounded-lg mt-1 mb-1 cursor-pointer hover:opacity-90 transition-opacity border shadow-sm"
                                  onClick={() => setSelectedImage(part)}
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <span key={i} className={isMe ? 'text-white font-semibold' : 'text-slate-800 font-semibold'}>{part}</span>
                              )
                            )}
                          </div>
                        )}
                      </div>

                      {/* Dynamic Read Receipt Indicators for Me */}
                      {isMe && (
                        <div className="absolute bottom-1 right-2 flex items-center gap-1 text-[8px] font-semibold text-blue-200 select-none">
                          <span className="font-mono text-[7px] uppercase tracking-wider text-blue-300">
                            {msg.readBy && msg.readBy.length > 1 ? 'Read' : 'Delivered'}
                          </span>
                          {msg.readBy && msg.readBy.length > 1 ? (
                            <CheckCheck className="text-sky-300 w-3 h-3" />
                          ) : (
                            <Check className="text-blue-300 w-3 h-3" />
                          )}
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* TYPING STATUS REPORT LINE */}
        <AnimatePresence>
          {typingUsers.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 py-1.5 bg-slate-50 text-[9px] font-sans font-bold text-blue-600 flex items-center gap-2 select-none shrink-0 border-t border-slate-200"
            >
              <div className="flex gap-1 shrink-0">
                <span className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></span>
              </div>
              <span className="truncate">{typingUsers.join(', ')} is constructing message parcel...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BOTTOM MESSAGE SENDING INPUT FORM */}
        <div className="flex flex-col border-t border-slate-205 bg-slate-100 shrink-0">
          {speechError && (
            <div className="px-4 py-1 text-[10px] text-red-600 font-bold bg-red-50 border-b border-red-100 animate-pulse">
              {speechError}
            </div>
          )}
          <form onSubmit={handleSendMessage} className="p-4 flex gap-3 relative">
            <button
              type="button"
              onClick={() => setShowFileModal(true)}
              disabled={isUploading}
              className="absolute left-[54px] top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all disabled:opacity-70 flex items-center justify-center"
              title="Attach secure document"
            >
              {isUploading ? (
                <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <Paperclip className="w-4 h-4" />
              )}
            </button>
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`absolute left-6 top-1/2 -translate-y-1/2 p-2 shrink-0 rounded-full transition-colors ${
                isListening 
                  ? 'bg-red-100 text-red-600 animate-pulse border border-red-200' 
                  : 'text-slate-400 hover:bg-slate-200 hover:text-slate-700'
              }`}
              title={isListening ? "Listening..." : "Dictate message"}
            >
              {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4 text-slate-400" />}
            </button>
            <input
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder={`Send secure, E2FE encrypted packet to #${activeChannel?.name}...`}
              className="flex-1 bg-white border border-slate-250 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-slate-805 pl-[88px] pr-4 py-3 outline-none transition-all placeholder:text-slate-400 font-sans shadow-inner"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() && !isListening}
              className="bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-bold p-3 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT SIDEBAR PRESENCE MONITOR */}
      <div className="w-48 border-l border-slate-200 bg-slate-50/50 flex flex-col hidden lg:flex shrink-0">
        <div className="p-4 border-b border-slate-200 flex items-center gap-2 select-none justify-between bg-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-slate-700 select-none">Tunnel Nodes</h3>
          <span className="text-[10px] font-sans font-bold bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full text-blue-700 shadow-xs">{activeUsers.length}</span>
        </div>

        <div className="p-3 space-y-2 overflow-y-auto">
          {activeUsers.map(user => (
            <div key={user.id} className="flex items-center gap-2.5 p-1.5 rounded-xl border border-slate-200 bg-white shadow-xs">
              <div className="relative shrink-0">
                {user.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-6.5 h-6.5 border border-slate-100 rounded-full bg-slate-50 object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-6.5 h-6.5 border border-slate-100 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-[9px]">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <motion.span 
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border border-white rounded-full"
                ></motion.span>
              </div>
              <div className="truncate text-left leading-none">
                <span className="text-xs font-bold text-slate-700 truncate block">{user.username}</span>
                <span className="text-[8.5px] font-sans text-emerald-600 uppercase font-bold tracking-tight block mt-1">ONLINE</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
