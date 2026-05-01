import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, PhoneCall, Minimize2 } from 'lucide-react';
import { sendChatMessage } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm Mack, the NEW YORK CITY Emergency Plumber RECEPTIONIST. How may I help you today? Are you experiencing a plumbing emergency? Tell me what's happening."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const historyForApi = messages.filter(m => m.id !== '1').map(m => ({
      role: m.role,
      content: m.content
    }));

    const responseText = await sendChatMessage(historyForApi, userMsg.content);
    
    const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: responseText || "I'm sorry, I couldn't process that. Please call (332) 900-3335." };
    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 bg-brand-blue text-white p-4 rounded-full shadow-2xl hover:bg-brand-blue-light transition-colors group flex items-center gap-3"
          >
            <MessageSquare size={28} />
            <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-medium">
              Mack
            </span>
            <div className="absolute top-0 right-0 -mt-1 -mr-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
            <div className="absolute top-0 right-0 -mt-1 -mr-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] sm:w-[400px] h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-brand-blue text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">Mack</h3>
                  <p className="text-xs text-blue-200">Usually responds instantly</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors"
                title="Minimize chat"
                aria-label="Minimize chat"
              >
                 <Minimize2 size={20} />
              </button>
            </div>

            {/* Emergency Banner */}
            <a href="tel:+13329003335" className="bg-brand-red text-white py-2 px-4 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-brand-red-hover transition-colors">
              <PhoneCall size={14} className="animate-wiggle" />
              URGENT? CALL (332) 900-3335 NOW
            </a>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                      <Bot size={16} className="text-slate-600" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-brand-blue text-white rounded-tr-sm' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'
                  }`}>
                    {msg.content}
                  </div>
                  
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0">
                      <User size={16} className="text-brand-blue" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                    <Bot size={16} className="text-slate-600" />
                  </div>
                  <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5 min-w-[60px]">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Describe your plumbing issue..."
                  className="flex-1 bg-slate-100 border-none rounded-full px-4 py-3 text-sm focus:ring-2 focus:ring-brand-blue/50 outline-none"
                  disabled={isLoading}
                />
                <button 
                  type="submit" 
                  disabled={!input.trim() || isLoading}
                  className="w-11 h-11 flex items-center justify-center bg-brand-blue text-white rounded-full hover:bg-brand-blue-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  aria-label="Send message"
                >
                  <Send size={18} className="ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
