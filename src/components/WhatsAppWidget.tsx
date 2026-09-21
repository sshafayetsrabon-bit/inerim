import React, { useState } from 'react';
import { MessageCircle, X, Send, Clock, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface WhatsAppWidgetProps {
  onOpenCalculator: () => void;
}

export const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({ onOpenCalculator }) => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sentMessage, setSentMessage] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const encoded = encodeURIComponent(`Hello Inerim Studio, I am interested in interior design services: ${message}`);
    window.open(`https://wa.me/8801768080101?text=${encoded}`, '_blank');
    setSentMessage(true);
    setTimeout(() => {
      setSentMessage(false);
      setIsOpen(false);
      setMessage('');
    }, 2000);
  };

  const quickPrompts = [
    'I want to estimate my 3BHK interior cost.',
    'Can you deliver within 45 days?',
    'Book a free site measurement visit.'
  ];

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Popover chat bubble */}
      {isOpen && (
        <div 
          id="whatsapp-chat-box"
          className={`mb-3 w-76 sm:w-84 rounded-2xl shadow-2xl border overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200 transition-colors ${
            isDark ? 'bg-black text-white border-white/15' : 'bg-white text-black border-black/15'
          }`}
        >
          {/* Header */}
          <div className={`p-3.5 flex items-center justify-between border-b ${
            isDark ? 'bg-white/[0.04] border-white/10' : 'bg-black/[0.03] border-black/10'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-[#087973] text-white flex items-center justify-center font-bold">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#25D366] border-2 border-black rounded-full"></span>
              </div>
              <div>
                <div className="text-xs font-bold">Inerim Architect Desk</div>
                <div className="text-[10px] text-[#087973] flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3" />
                  Typically replies in 5 mins
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className={`p-1 rounded-full transition-colors cursor-pointer ${
                isDark ? 'text-white/60 hover:text-white hover:bg-white/10' : 'text-black/60 hover:text-black hover:bg-black/5'
              }`}
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className={`p-3.5 space-y-2.5 max-h-64 overflow-y-auto ${
            isDark ? 'bg-black' : 'bg-white'
          }`}>
            <div className={`p-2.5 rounded-xl border text-xs leading-relaxed space-y-1 ${
              isDark ? 'bg-white/[0.03] border-white/10 text-white/80' : 'bg-black/[0.02] border-black/10 text-black/80'
            }`}>
              <p className="font-semibold text-xs text-[#087973]">Hello & welcome to Inerim 👋</p>
              <p className="text-[11px]">
                Have a residential or corporate interior query? Drop us a line or use our instant cost calculator.
              </p>
            </div>

            <button
              onClick={() => {
                setIsOpen(false);
                onOpenCalculator();
              }}
              className="w-full py-1.5 px-2.5 rounded-lg bg-[#087973]/10 border border-[#087973]/30 hover:bg-[#087973]/20 text-[#087973] text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              Calculate My Interior Cost (Instant)
            </button>

            <div className="space-y-1 pt-1">
              <span className={`text-[9px] uppercase font-bold tracking-wider ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                Quick inquiries:
              </span>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => setMessage(prompt)}
                  className={`w-full text-left text-[11px] p-2 rounded-lg border transition-colors cursor-pointer ${
                    isDark
                      ? 'border-white/10 bg-white/[0.02] hover:border-[#087973] hover:text-[#087973] text-white/80'
                      : 'border-black/10 bg-black/[0.01] hover:border-[#087973] hover:text-[#087973] text-black/80'
                  }`}
                >
                  "{prompt}"
                </button>
              ))}
            </div>

            {sentMessage && (
              <div className="p-2 rounded-lg bg-[#087973]/15 text-[#087973] text-[11px] font-medium text-center">
                Opening WhatsApp chat...
              </div>
            )}
          </div>

          {/* Footer input */}
          <form onSubmit={handleSendMessage} className={`p-2.5 border-t flex items-center gap-2 ${
            isDark ? 'bg-white/[0.02] border-white/10' : 'bg-black/[0.01] border-black/10'
          }`}>
            <input
              type="text"
              placeholder="Ask about project, price..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`flex-1 px-3 py-1.5 text-xs rounded-lg border focus:outline-none transition-colors ${
                isDark
                  ? 'bg-black border-white/20 text-white placeholder-white/40 focus:border-[#087973]'
                  : 'bg-white border-black/20 text-black placeholder-black/40 focus:border-[#087973]'
              }`}
            />
            <button
              type="submit"
              className="p-2 rounded-lg bg-[#087973] hover:bg-[#06615c] text-white flex-shrink-0 transition-colors cursor-pointer"
              aria-label="Send via WhatsApp"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        id="floating-whatsapp-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative p-3 rounded-full bg-[#087973] hover:bg-[#06615c] text-white shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
        aria-label="Open WhatsApp Chat with Inerim"
      >
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#25D366] border border-black rounded-full"></span>
        <MessageCircle className="w-5 h-5" />
      </button>
    </div>
  );
};
