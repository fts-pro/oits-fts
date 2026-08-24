import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Sparkles, Mic, MicOff, RefreshCcw, Info } from 'lucide-react';
import { COMPANY_NAME } from '../constants';

interface Message {
  role: 'user' | 'bot' | 'error';
  text: string;
}

const CHAT_STORAGE_KEY = 'oits_chat_history';
const TUTORIAL_STORAGE_KEY = 'oits_ai_tutorial_seen';

export const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize messages and tutorial state
  useEffect(() => {
    const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([
        { role: 'bot', text: `Hello! I'm the ${COMPANY_NAME} AI assistant. How can I help you brainstorm your project today?` }
      ]);
    }

    const tutorialSeen = localStorage.getItem(TUTORIAL_STORAGE_KEY);
    if (!tutorialSeen) {
      setShowTutorial(true);
    }
  }, []);

  // Persist messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() || isTyping) return;

    const userMsg = textToSend.trim();
    if (!overrideText) setInput('');
    
    // Remove last error if retrying
    setMessages(prev => {
      const filtered = prev.filter(m => m.role !== 'error');
      return [...filtered, { role: 'user', text: userMsg }];
    });
    
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMsg }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const botText = data.text || "I'm sorry, I'm having trouble thinking right now. Please try again or use the contact form below!";
      setMessages(prev => [...prev, { role: 'bot', text: botText }]);
    } catch (error: any) {
      console.error('AI Assistant error:', error);
      const errorMessage = "Connection failed. Please check your network and try again.";
      setMessages(prev => [...prev, { role: 'error', text: errorMessage }]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const closeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
  };

  const retryLastMessage = () => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      handleSend(lastUserMsg.text);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-slate-900 dark:bg-blue-600 p-4 text-white flex items-center justify-between shadow-lg relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 dark:bg-slate-950/50 rounded-lg flex items-center justify-center border border-white/10">
                <Sparkles size={16} />
              </div>
              <div>
                <p className="text-sm font-bold">Project Assistant</p>
                <p className="text-[10px] text-blue-200 uppercase tracking-widest font-black">Powered by Gemini</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors" aria-label="Close Assistant">
              <X size={20} />
            </button>
          </div>

          {/* Tutorial Overlay */}
          {showTutorial && (
            <div className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-sm p-8 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                <Info size={32} className="text-white" />
              </div>
              <h4 className="text-xl font-black text-white mb-2">Welcome!</h4>
              <p className="text-blue-100 text-sm mb-8 leading-relaxed">
                I can help you define project scopes, choose tech stacks, or estimate timelines. 
                <br/><br/>
                Try typing or using the <strong>microphone</strong> to speak your ideas!
              </p>
              <button 
                onClick={closeTutorial}
                className="bg-white text-slate-900 px-8 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-transform"
              >
                GOT IT!
              </button>
            </div>
          )}

          {/* Messages */}
          <div ref={scrollRef} className="h-96 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/50 scroll-smooth">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                    msg.role === 'user' 
                      ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 border-blue-200 dark:border-blue-800' 
                      : msg.role === 'error' 
                        ? 'bg-red-100 text-red-600 border-red-200'
                        : 'bg-slate-800 dark:bg-slate-700 text-white border-slate-700 dark:border-slate-600 shadow-md'
                  }`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm shadow-sm border transition-colors ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white border-blue-500 rounded-tr-none' 
                      : msg.role === 'error'
                        ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/50 rounded-tl-none font-bold'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-50 border-slate-200 dark:border-slate-700 rounded-tl-none font-medium'
                  }`}>
                    {msg.text}
                    {msg.role === 'error' && (
                      <button 
                        onClick={retryLastMessage}
                        className="mt-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                      >
                        <RefreshCcw size={12} /> RETRY
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                 <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none shadow-md border border-slate-100 dark:border-slate-700">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                 </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 relative">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1 group">
                <input 
                  type="text" 
                  placeholder={isListening ? "Listening..." : "Describe your idea..."} 
                  className={`w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-all border border-transparent ${isListening ? 'ring-2 ring-red-500/50' : 'focus:border-blue-500/20'}`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isTyping}
                />
                <button 
                  type="button"
                  onClick={toggleListening}
                  disabled={isTyping}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${isListening ? 'text-red-600 bg-red-100 dark:bg-red-900/30' : 'text-slate-400 hover:text-blue-600 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                  aria-label={isListening ? "Stop listening" : "Start voice dictation"}
                >
                  {isListening ? <MicOff size={18} className="animate-pulse" /> : <Mic size={18} />}
                </button>
              </div>
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="p-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl hover:scale-105 active:scale-95 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 transition-all shadow-md"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-slate-900 dark:bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative border-4 border-white dark:border-slate-950"
          aria-label="Open AI Assistant"
        >
          <div className="absolute -top-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-slate-950 animate-pulse"></div>
          <MessageSquare size={28} className="group-hover:animate-subtle-bounce" />
          
          <span className="absolute right-full mr-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl border border-slate-100 dark:border-slate-700 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none translate-x-4 group-hover:translate-x-0">
            Assistant Active
          </span>
        </button>
      )}
    </div>
  );
};