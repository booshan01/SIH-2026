import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Send,
  X,
  Maximize2,
  Minimize2,
  Bot,
  User,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Camera,
  Users,
  Search,
  ExternalLink,
  Loader2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Sun,
  Moon,
  Zap,
  ArrowRight,
  Compass,
  AlertTriangle,
  Package,
  Wrench,
  HelpCircle,
  Sliders,
  Trophy
} from 'lucide-react';
import { askGeminiAssistant, ChatMessage, AssistantAction } from '../../services/geminiService';
import { PinpointTarget } from '../../types';

interface GeminiAIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeminiAIAssistantModal: React.FC<GeminiAIAssistantModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    cameras,
    students,
    inventory,
    alerts,
    currentUser,
    setActivePage,
    triggerPinpoint,
    theme,
    toggleTheme,
    loadDemoData
  } = useApp();

  const [activeTab, setActiveTab] = useState<'chat' | 'zero_knowledge' | 'controller'>('chat');
  const [simpleMode, setSimpleMode] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'gemini',
      text: `### 🤖 Welcome to Your Personal Gemini AI Assistant!\n\nI am designed to make managing this training centre **effortless and friendly**, even if you have **zero technical background**.\n\n**Here is what I'm keeping an eye on right now:**\n- 📹 **3 Calibrated CCTV Streams** running smoothly (Workshop, Equipment Rack, Entrance Gate)\n- 🎯 **Tool Tracker**: Precision Soldering Station #2 on Workbench #4 (in use by David Miller)\n- 👥 **Attendance**: 7 trainees present and safe, 2 on approved leave, 1 flagged\n\nHow can I help you today? You can speak, type, or pick one of the **1-Click Actions** below!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actions: [
        {
          id: 'welcome-soldering',
          type: 'pinpoint',
          label: '🎯 Find Soldering Station on Live CCTV',
          iconName: 'pin',
          pinpoint: {
            name: 'Soldering Station',
            category: 'tool',
            x: 79.4,
            y: 91.0,
            camId: 'cam-1',
            note: 'Workbench #4'
          }
        },
        {
          id: 'welcome-attendance',
          type: 'navigate',
          label: '👥 Check Absent Trainees',
          target: 'attendance',
          iconName: 'users'
        }
      ],
      suggestedFollowUps: [
        'Where is the Soldering Station?',
        'Who is absent today?',
        'Is everything safe right now?'
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isLoading, activeTab]);

  // Speech Recognition setup (Voice-to-Text)
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInput(transcript);
            handleSend(transcript);
          }
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
          setVoiceNotice('Microphone not detected or permission denied.');
          setTimeout(() => setVoiceNotice(null), 3500);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (e) {
        console.warn('SpeechRecognition not available:', e);
      }
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      setVoiceNotice('Voice recognition is not supported in this browser window.');
      setTimeout(() => setVoiceNotice(null), 3500);
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setVoiceNotice('Listening... Speak your question now.');
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  // Text-to-Speech Readout
  const speakText = (text: string, msgId: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean text of markdown characters
    const clean = text
      .replace(/###/g, '')
      .replace(/\*\*/g, '')
      .replace(/[-*#]/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(null);
    utterance.onerror = () => setIsSpeaking(null);

    setIsSpeaking(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    // Direct app command execution if detected
    const lower = text.toLowerCase();
    if (lower.includes('dark mode') || lower.includes('light mode') || lower.includes('toggle theme')) {
      toggleTheme();
    } else if (lower.includes('live camera') || lower.includes('open cctv') || lower.includes('stream')) {
      setActivePage('monitoring');
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const systemContext = `
Role: ${currentUser.role}
Active User: ${currentUser.name} (${currentUser.email})
Cameras (${cameras.length}): ${cameras.map(c => `${c.name} [${c.status}]`).join(', ')}
Students (${students.length}): 7 present (Alex Chen, Sarah Jenkins, David Miller, Michael Chang, Jessica Taylor, Lisa Wong, James Wilson), 2 absent (Emily Watson, Robert Fox), 1 missing (Amanda Ross)
Inventory: Precision Soldering Station #2 (checked out on Workbench #4 to David Miller), Barcode Tablet Scanner #04 (slot 4), Oscilloscopes (in rack)
Open Alerts: ${alerts.filter(a => a.reviewStatus !== 'closed').length} active alerts
Theme: ${theme}
`;

    try {
      const response = await askGeminiAssistant(
        text,
        [...messages, userMsg],
        systemContext,
        { simpleMode }
      );

      const geminiMsg: ChatMessage = {
        id: `gemini-${Date.now()}`,
        sender: 'gemini',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: response.actions,
        suggestedFollowUps: response.suggestedFollowUps,
        isSimpleMode: simpleMode
      };
      setMessages(prev => [...prev, geminiMsg]);
    } catch (e: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'gemini',
        text: `Error processing request: ${e.message || 'Service unavailable'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteAction = (action: AssistantAction) => {
    if (action.type === 'pinpoint' && action.pinpoint) {
      triggerPinpoint(action.pinpoint);
      onClose();
    } else if (action.type === 'navigate' && action.target) {
      setActivePage(action.target);
      onClose();
    } else if (action.type === 'toggle_theme') {
      toggleTheme();
    }
  };

  const clearChat = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(null);
    setMessages([
      {
        id: 'reset',
        sender: 'gemini',
        text: simpleMode
          ? 'Session refreshed! What would you like help with next?'
          : 'Guardian session reset. Ready for telemetry queries.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: [
          'Where is the Soldering Station?',
          'Who is absent today?',
          'Is everything safe right now?'
        ]
      }
    ]);
  };

  // Zero-Knowledge 1-Click Cards
  const zeroKnowledgePresets = [
    {
      title: '🟢 30-Second Centre Status',
      subtitle: 'Explains if everything is safe and in order right now',
      badge: 'Zero Knowledge',
      prompt: 'Explain today\'s centre status in simple words so anyone can understand'
    },
    {
      title: '🎯 Where is the Soldering Station?',
      subtitle: 'Locates Soldering Station #2 and shows it on camera',
      badge: 'Live Radar',
      prompt: 'Where is the Soldering Station right now?'
    },
    {
      title: '👥 Who is Absent Today?',
      subtitle: 'Shows students who haven\'t checked in and why',
      badge: 'Attendance',
      prompt: 'Who is absent or missing today and why?'
    },
    {
      title: '🛡️ Is this Centre MSDE Compliant?',
      subtitle: 'Audits fire extinguishers, lighting, cameras, and tools',
      badge: 'Official Safety',
      prompt: 'Is this centre compliant with MSDE safety and infrastructure rules?'
    },
    {
      title: '🚨 Explain Open Alerts in Plain Words',
      subtitle: 'Tells you what needs attention without technical jargon',
      badge: 'Alerts',
      prompt: 'Explain all open alerts and tell me what I should do right now'
    },
    {
      title: '🔍 Scan Missing Hardware Tools',
      subtitle: 'Checks tool racks for missing drills, multimeters, or scanners',
      badge: 'Inventory',
      prompt: 'Check all equipment racks for missing or checked-out tools'
    }
  ];

  // Direct App Controller actions
  const appControllers = [
    {
      label: '🏆 Jury Showcase & AI Simulator Arena',
      description: 'God-Mode anomaly simulator, PA voice intercom & time-machine',
      icon: Trophy,
      action: () => {
        setActivePage('jury-showcase');
        onClose();
      }
    },
    {
      label: 'Open Live CCTV Cameras',
      description: 'Switch to live 4K calibrated video streams',
      icon: Camera,
      action: () => {
        setActivePage('monitoring');
        onClose();
      }
    },
    {
      label: 'View Trainee Roster',
      description: 'Check attendance & biometric compliance',
      icon: Users,
      action: () => {
        setActivePage('attendance');
        onClose();
      }
    },
    {
      label: 'Switch Theme (Dark / Light)',
      description: `Current mode: ${theme === 'dark' ? 'Dark' : 'Light'} Mode`,
      icon: theme === 'dark' ? Sun : Moon,
      action: () => toggleTheme()
    },
    {
      label: 'Review Open Alerts & Incidents',
      description: `${alerts.filter(a => a.reviewStatus !== 'closed').length} active incidents pending review`,
      icon: AlertTriangle,
      action: () => {
        setActivePage('alerts');
        onClose();
      }
    },
    {
      label: 'Tool & Equipment Inventory',
      description: 'Audit checked-out soldering stations & racks',
      icon: Package,
      action: () => {
        setActivePage('inventory');
        onClose();
      }
    },
    {
      label: 'Reload 6 Demo Scenarios',
      description: 'Restore clean Tamil Nadu test centres & telemetry',
      icon: RotateCcw,
      action: () => {
        loadDemoData();
        handleSend('I just reloaded the 6 demo scenarios. What is the updated status?');
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in transition-all">
      <div
        className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
          isExpanded ? 'max-w-4xl h-[92vh]' : 'max-w-2xl h-[88vh] sm:h-[680px]'
        }`}
      >
        {/* Elite Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-blue-900/40 select-none">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white tracking-tight flex items-center gap-1.5">
                  Google Gemini AI Copilot
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-blue-500/20 text-cyan-300 border border-blue-400/30">
                    gemini-3.8-flash
                  </span>
                </h3>
              </div>
              <div className="text-[11px] text-slate-300 font-sans flex items-center gap-2">
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  Live Guardian Active
                </span>
                <span className="text-slate-400">·</span>
                <span>Zero-Knowledge Friendly</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            {/* Simple English / Zero Knowledge Toggle */}
            <button
              onClick={() => setSimpleMode(!simpleMode)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border flex items-center gap-1 ${
                simpleMode
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-xs'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title="Toggle Simple English Mode"
            >
              <span>{simpleMode ? '👶 Simple Words' : '⚡ Tech Mode'}</span>
            </button>

            <button
              onClick={clearChat}
              className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-xs"
              title="Reset Conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors hidden sm:block"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Close Copilot"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mode Navigation Tabs */}
        <div className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 px-3 py-1.5 flex items-center justify-between gap-1 text-xs transition-colors">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'chat'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-400 shadow-xs border border-slate-200/80 dark:border-slate-700 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Smart Chat & Voice</span>
            </button>

            <button
              onClick={() => setActiveTab('zero_knowledge')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'zero_knowledge'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-400 shadow-xs border border-slate-200/80 dark:border-slate-700 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>1-Click Diagnostics</span>
            </button>

            <button
              onClick={() => setActiveTab('controller')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'controller'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-400 shadow-xs border border-slate-200/80 dark:border-slate-700 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-indigo-500" />
              <span>App Controller</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 hidden md:flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            3 Cameras · 10 Students · 0 Breaches
          </div>
        </div>

        {/* Voice Notification Banner if active */}
        {voiceNotice && (
          <div className="bg-blue-600 text-white text-xs px-4 py-1.5 flex items-center justify-between animate-in slide-in-from-top-2">
            <span className="flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 animate-pulse" />
              {voiceNotice}
            </span>
            <button onClick={() => setVoiceNotice(null)} className="opacity-70 hover:opacity-100">
              ✕
            </button>
          </div>
        )}

        {/* TAB 1: SMART CHAT & VOICE */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50 dark:bg-slate-950/50">
            {/* Quick Suggestion Strip */}
            <div className="bg-white dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                Easy Questions:
              </span>
              {[
                { label: '🎯 Where is Soldering Station?', prompt: 'Where is the Soldering Station right now?' },
                { label: '👥 Who is absent today?', prompt: 'Who is absent or missing today from the class?' },
                { label: '🟢 Plain English Centre Status', prompt: 'Explain today\'s centre status in simple words' },
                { label: '🛡️ Check Safety & Fire Rules', prompt: 'Is this centre compliant with MSDE safety and fire rules?' }
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q.prompt)}
                  className="shrink-0 px-2.5 py-1 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-cyan-300 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium transition-colors"
                >
                  {q.label}
                </button>
              ))}
            </div>

            {/* Chat Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m) => {
                const isUser = m.sender === 'user';
                return (
                  <div
                    key={m.id}
                    className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-xs transition-all ${
                        isUser
                          ? 'bg-blue-600 text-white rounded-br-xs'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-xs'
                      }`}
                    >
                      {/* Message Content */}
                      <div className="prose prose-xs max-w-none text-current">
                        {m.text.split('\n\n').map((paragraph, pIdx) => {
                          if (paragraph.startsWith('### ')) {
                            return (
                              <h4 key={pIdx} className="font-bold text-sm mb-1.5 text-current">
                                {paragraph.replace('### ', '')}
                              </h4>
                            );
                          }
                          if (paragraph.startsWith('- ')) {
                            return (
                              <ul key={pIdx} className="list-disc pl-4 space-y-1 my-1">
                                {paragraph.split('\n').map((li, liIdx) => (
                                  <li key={liIdx}>{li.replace(/^- /, '')}</li>
                                ))}
                              </ul>
                            );
                          }
                          return (
                            <p key={pIdx} className="my-1 whitespace-pre-wrap">
                              {paragraph}
                            </p>
                          );
                        })}
                      </div>

                      {/* Interactive Action Cards */}
                      {m.actions && m.actions.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
                          {m.actions.map((act) => (
                            <button
                              key={act.id}
                              onClick={() => handleExecuteAction(act)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800/60 transition-all flex items-center gap-1.5 shadow-2xs group cursor-pointer"
                            >
                              <span>{act.label}</span>
                              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Follow-up suggestions */}
                      {m.suggestedFollowUps && m.suggestedFollowUps.length > 0 && !isUser && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap gap-1.5">
                          <span className="text-[10px] text-slate-400 font-semibold w-full">
                            Suggested follow-ups:
                          </span>
                          {m.suggestedFollowUps.map((promptText, fIdx) => (
                            <button
                              key={fIdx}
                              onClick={() => handleSend(promptText)}
                              className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                            >
                              👉 {promptText}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Message Footer: Timestamp, Copy, Speak */}
                      <div
                        className={`text-[9px] mt-2 flex items-center justify-between gap-2 ${
                          isUser ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        <span>{m.timestamp}</span>

                        {!isUser && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => speakText(m.text, m.id)}
                              className="hover:text-blue-600 dark:hover:text-cyan-400 p-0.5 rounded transition-colors"
                              title={isSpeaking === m.id ? 'Stop reading' : 'Read aloud with voice'}
                            >
                              {isSpeaking === m.id ? (
                                <VolumeX className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                              ) : (
                                <Volume2 className="w-3.5 h-3.5" />
                              )}
                            </button>

                            <button
                              onClick={() => copyToClipboard(m.text, m.id)}
                              className="hover:text-blue-600 dark:hover:text-cyan-400 p-0.5 rounded transition-colors"
                              title="Copy message"
                            >
                              {copiedId === m.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {isUser && (
                      <div className="w-8 h-8 rounded-lg bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                    <span>Gemini AI is scanning camera streams & student rosters...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                {/* Voice Input Button */}
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isListening
                      ? 'bg-red-500 text-white border-red-600 animate-pulse'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                  title={isListening ? 'Stop listening' : 'Speak using microphone'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    simpleMode
                      ? "Ask me anything in plain words (e.g. 'Where is the soldering machine?')..."
                      : "Query telemetry (e.g. 'Pinpoint Alex Chen', 'Is Workbench 4 calibrated?')..."
                  }
                  className="flex-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                  disabled={isLoading}
                />

                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ask AI</span>
                </button>
              </form>

              <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400 dark:text-slate-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Government of India · MSDE Guardian Telemetry
                </span>
                <span className="hidden sm:inline">
                  Tip: Click the mic to speak or select any 1-Click action above
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ZERO-KNOWLEDGE 1-CLICK DIAGNOSTICS */}
        {activeTab === 'zero_knowledge' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-950/50 space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800/50 p-4 rounded-xl">
              <h4 className="font-bold text-sm text-blue-900 dark:text-blue-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                Zero-Knowledge AI Action Presets
              </h4>
              <p className="text-xs text-blue-800 dark:text-blue-300 mt-1 leading-relaxed">
                You don't need any surveillance or database knowledge. Click any card below and the Gemini AI Copilot will perform the complete investigation for you and display interactive action buttons.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {zeroKnowledgePresets.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setActiveTab('chat');
                    handleSend(preset.prompt);
                  }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-cyan-500 p-4 rounded-xl shadow-xs transition-all hover:shadow-md cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded uppercase tracking-wider">
                        {preset.badge}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100 mt-2.5">
                      {preset.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {preset.subtitle}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-blue-600 dark:text-cyan-400 flex items-center gap-1">
                    <span>Run Check Now</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DIRECT APP CONTROLLER */}
        {activeTab === 'controller' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-950/50 space-y-4">
            <div className="bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-4 rounded-xl">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-600" />
                Direct Application Controllers
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Jump directly to essential system modules or execute instant operational tasks without navigating complex menus.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {appControllers.map((ctrl, idx) => {
                const Icon = ctrl.icon;
                return (
                  <button
                    key={idx}
                    onClick={ctrl.action}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400 p-4 rounded-xl text-left shadow-xs transition-all hover:shadow-md group flex items-start gap-3.5 cursor-pointer"
                  >
                    <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center justify-between">
                        <span>{ctrl.label}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed truncate">
                        {ctrl.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
