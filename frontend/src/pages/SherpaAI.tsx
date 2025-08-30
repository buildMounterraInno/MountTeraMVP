import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SherpaApiService } from '../services/sherpa-api';
import type { TrekResponse } from '../services/sherpa-api';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
}

const formatTrekkingResponse = (text: string) => {
  if (!text) return text;
  
  // Split into lines and process each one
  const lines = text.split('\n');
  const formattedLines = lines.map((line, index) => {
    const trimmedLine = line.trim();
    
    // Skip empty lines but add some spacing
    if (!trimmedLine) return <div key={index} className="h-2" />;
    
    // Major section headers (all caps or ending with colon)
    if (trimmedLine.endsWith(':') || (trimmedLine === trimmedLine.toUpperCase() && trimmedLine.length > 5 && /^[A-Z\s]+$/.test(trimmedLine))) {
      return (
        <div key={index} className="text-white font-semibold mt-4 mb-2 text-sm border-b border-white/20 pb-1">
          {trimmedLine}
        </div>
      );
    }
    
    // Trek names and locations (containing specific keywords)
    if (trimmedLine.toLowerCase().includes('trek') || trimmedLine.toLowerCase().includes('himalaya') || 
        trimmedLine.toLowerCase().includes('valley') || trimmedLine.toLowerCase().includes('peak') ||
        trimmedLine.toLowerCase().includes('pass') || trimmedLine.toLowerCase().includes('lake')) {
      return (
        <div key={index} className="text-gray-200 text-sm mb-2 flex items-center gap-2">
          <span>🏔️</span>
          <span>{trimmedLine}</span>
        </div>
      );
    }
    
    // Budget/Cost information
    if (trimmedLine.includes('$') || trimmedLine.includes('₹') || 
        /cost|budget|price|fee|charge/i.test(trimmedLine)) {
      return (
        <div key={index} className="text-gray-200 text-sm mb-1 flex items-center gap-2">
          <span>💰</span>
          <span>{trimmedLine}</span>
        </div>
      );
    }
    
    // Duration/Time information 
    if (/days?|weeks?|months?|duration|time/i.test(trimmedLine)) {
      return (
        <div key={index} className="text-gray-200 text-sm mb-1 flex items-center gap-2">
          <span>⏰</span>
          <span>{trimmedLine}</span>
        </div>
      );
    }
    
    // Difficulty/Level indicators
    if (/difficulty|level|moderate|easy|hard|beginner|advanced|intermediate/i.test(trimmedLine)) {
      return (
        <div key={index} className="text-gray-200 text-sm mb-1 flex items-center gap-2">
          <span>📊</span>
          <span>{trimmedLine}</span>
        </div>
      );
    }
    
    // Safety warnings
    if (/safety|danger|warning|risk|caution|altitude|weather/i.test(trimmedLine)) {
      return (
        <div key={index} className="text-yellow-300 text-sm mb-1 flex items-center gap-2">
          <span>⚠️</span>
          <span>{trimmedLine}</span>
        </div>
      );
    }
    
    // Best time/Season information
    if (/season|best time|weather|temperature|monsoon|winter|summer/i.test(trimmedLine)) {
      return (
        <div key={index} className="text-gray-300 text-sm mb-1 flex items-center gap-2">
          <span>🌤️</span>
          <span>{trimmedLine}</span>
        </div>
      );
    }
    
    // Gear/Equipment
    if (/gear|equipment|boots|jacket|backpack|tent|sleeping|rope|helmet/i.test(trimmedLine)) {
      return (
        <div key={index} className="text-gray-300 text-sm mb-1 flex items-center gap-2">
          <span>🎒</span>
          <span>{trimmedLine}</span>
        </div>
      );
    }
    
    // Permits and documentation
    if (/permit|visa|document|registration|booking|reservation/i.test(trimmedLine)) {
      return (
        <div key={index} className="text-gray-300 text-sm mb-1 flex items-center gap-2">
          <span>📄</span>
          <span>{trimmedLine}</span>
        </div>
      );
    }
    
    // List items (indented with bullet)
    if (/^[-•*]\s/.test(trimmedLine) || /^\d+\.\s/.test(trimmedLine)) {
      return (
        <div key={index} className="text-gray-300 text-sm mb-1 ml-4 flex items-start gap-2">
          <span className="text-gray-500 mt-1">•</span>
          <span>{trimmedLine.replace(/^[-•*]\s/, '').replace(/^\d+\.\s/, '')}</span>
        </div>
      );
    }
    
    // Regular text with better spacing
    return (
      <div key={index} className="text-gray-300 text-sm mb-2 leading-relaxed">
        {trimmedLine}
      </div>
    );
  });
  
  return <div className="space-y-1">{formattedLines}</div>;
};

const SherpaAI = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi, I'm your Sherpa AI. Think of me as your travel friend who always knows the best routes, hidden trails, experiences, and the cheapest way to get there. I'll help you find the perfect trek, book your train or flight, and discover moments you'll never forget. Where should we begin?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatTitle, setCurrentChatTitle] = useState('New Chat');
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check service availability on component mount
    checkServiceHealth();
  }, []);

  const checkServiceHealth = async () => {
    try {
      await SherpaApiService.isServiceAvailable();
    } catch (error) {
      console.error('Service health check failed:', error);
    }
  };

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    
    // Update chat title if it's the first message
    if (messages.length === 1 && currentChatTitle === 'New Chat') {
      const title = inputText.trim().slice(0, 30) + (inputText.trim().length > 30 ? '...' : '');
      setCurrentChatTitle(title);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: 'Thinking...',
      isUser: false,
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInputText('');
    setIsLoading(true);

    // Animate input field with CSS
    if (inputRef.current) {
      inputRef.current.style.transform = 'scale(0.98)';
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.style.transform = 'scale(1)';
        }
      }, 150);
    }

    try {
      const response: TrekResponse = await SherpaApiService.getTrekRecommendation(inputText.trim());
      
      const aiMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: response.response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => prev.slice(0, -1).concat([aiMessage]));
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or check if the Sherpa AI service is running.`,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => prev.slice(0, -1).concat([errorMessage]));
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };
  return (
    <div className="h-screen bg-[#0a0a0b] text-white flex overflow-hidden">
      {/* Left Sidebar - Chat History */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isLeftSidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-80 bg-[#1a1a1b] border-r border-white/10 flex flex-col absolute left-0 top-0 h-full z-20 md:relative md:z-auto"
      >
        <div className="p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white mb-4">Chat History</h2>
          <button className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            + New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            <div className="p-3 bg-[#2a2a2b] rounded-lg cursor-pointer hover:bg-[#3a3a3b] transition-colors">
              <div className="text-sm text-white font-medium truncate">{currentChatTitle}</div>
              <div className="text-xs text-gray-400 mt-1">Today</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="bg-[#1a1a1b] border-b border-white/10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
              className="md:hidden p-2 hover:bg-[#2a2a2b] rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-center flex-1 md:flex-none">{currentChatTitle}</h1>
          </div>
          <button
            onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
            className="p-2 hover:bg-[#2a2a2b] rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
              >
                <div className={`max-w-[80%] ${message.isUser ? 'order-2' : 'order-1'} group`}>
                  {!message.isUser && (
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-[#8b5cf6] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">S</span>
                      </div>
                      <span className="text-sm text-gray-300 font-medium">Sherpa AI</span>
                    </div>
                  )}
                  
                  <div className={`relative p-4 rounded-lg ${
                    message.isUser 
                      ? 'bg-[#2a2a2b] text-white ml-auto' 
                      : 'bg-[#1a1a1b] text-gray-100 border border-white/10'
                  } ${message.isLoading ? 'animate-pulse' : ''}`}>
                    {message.isUser ? (
                      <p className="text-sm leading-relaxed">
                        {message.text}
                      </p>
                    ) : (
                      <div className="text-sm leading-relaxed">
                        {formatTrekkingResponse(message.text)}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className={`text-xs ${
                        message.isUser ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      
                      {/* Message actions - show on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(message.text, message.id)}
                          className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                          title="Copy message"
                        >
                          {copiedMessageId === message.id ? (
                            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                        {!message.isUser && (
                          <button
                            className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                            title="Regenerate response"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-[#1a1a1b] border-t border-white/10 p-4">
          <form onSubmit={handleSubmit} className="flex items-end gap-3">
            <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Ask about trekking routes, gear, safety tips, or any adventure question..."
                disabled={isLoading}
                rows={1}
                className="w-full resize-none px-4 py-3 bg-[#2a2a2b] border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] disabled:opacity-50 text-sm transition-all duration-200"
                style={{ 
                  minHeight: '48px', 
                  maxHeight: '120px',
                  lineHeight: '1.5'
                }}
              />
            </div>
            
            <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white p-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[48px] h-[48px]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </motion.button>
          </form>
        </div>
      </div>

      {/* Right Sidebar - Settings/Options */}
      <motion.div
        initial={{ x: 300 }}
        animate={{ x: isRightSidebarOpen ? 0 : 300 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-80 bg-[#1a1a1b] border-l border-white/10 flex flex-col absolute right-0 top-0 h-full z-20 md:relative md:z-auto"
      >
        <div className="p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Settings</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 block mb-2">Model</label>
              <select className="w-full bg-[#2a2a2b] border border-white/20 rounded-lg px-3 py-2 text-white text-sm">
                <option>Sherpa AI v1</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-300 block mb-2">Temperature</label>
              <input type="range" min="0" max="1" step="0.1" className="w-full" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Overlay for mobile */}
      {(isLeftSidebarOpen || isRightSidebarOpen) && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => {
            setIsLeftSidebarOpen(false);
            setIsRightSidebarOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default SherpaAI;