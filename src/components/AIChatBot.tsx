import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Sparkles, Send, Loader2, Volume2, Globe, Bot } from 'lucide-react';
import { ChatMessage } from '../types';

interface AIChatBotProps {}

export default function AIChatBot({}: AIChatBotProps) {
  const [language, setLanguage] = useState<'English' | 'Telugu' | 'Hindi'>('English');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: "Hello! I am EcoFriend's AI Plant Companion. You can ask me any botany questions or gardening help! Click Telugu or Hindi to chat in your mother tongue! 🌱",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const rawText = textToSend || inputText;
    if (!rawText.trim() || loading) return;

    if (!textToSend) setInputText('');

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: rawText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ sender: m.sender, text: m.text })),
          language
        })
      });

      if (!res.ok) throw new Error('AI Server is currently taking a nap');
      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: "Apologies! My neural connection got disconnected. Please run the query again. 🔧",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Quick prompt suggestions according to language
  const getSuggestions = () => {
    switch (language) {
      case 'Telugu':
        return [
          "నా మొక్కకు ఎంత నీరు కావాలి?",
          "నా టమాటో మొక్క ఆకులు ఎండిపోతున్నాయి ఎందుకు?",
          "సులభంగా పెరిగే కూరగాయలు ఏమిటి?"
        ];
      case 'Hindi':
        return [
          "मेरे पौधे में कौन सी बीमारी है?",
          "घर में तुलसी का पौधा कैसे उगाएं?",
          "गमले की मिट्टी कैसे तैयार करें?"
        ];
      default:
        return [
          "Which plants are best for a small balcony?",
          "How do I prevent root rot in potted plants?",
          "What is the best natural fertilizer recipe?"
        ];
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden flex flex-col h-[520px]">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white flex items-center justify-between flex-wrap gap-3 shadow-[0_2px_10px_-4px_rgba(5,150,105,0.3)]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white/10 rounded-xl">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold tracking-wide uppercase flex items-center gap-1">
              EcoFriend AI Companion <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
            </h3>
            <p className="text-[10px] text-emerald-100 font-medium">Supporting multilingual student interaction</p>
          </div>
        </div>

        {/* Language selector toggle */}
        <div className="flex items-center gap-1.5 bg-black/10 rounded-xl p-1 border border-white/10">
          <Globe className="w-3.5 h-3.5 text-emerald-200" />
          {(['English', 'Telugu', 'Hindi'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-all duration-150 cursor-pointer ${
                language === lang 
                  ? 'bg-white text-emerald-800 shadow-sm' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {lang === 'Telugu' ? 'తెలుగు' : lang === 'Hindi' ? 'हिंदी' : 'English'}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.sender === 'assistant' && (
              <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg h-8 w-8 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Bot className="w-4.5 h-4.5" />
              </div>
            )}
            
            <div className="max-w-[80%] flex flex-col">
              <div className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm font-sans whitespace-pre-line ${
                m.sender === 'user' 
                  ? 'bg-emerald-600 text-white rounded-br-none' 
                  : 'bg-white text-slate-800 rounded-bl-none border border-emerald-50'
              }`}>
                {m.text}
              </div>
              <span className={`text-[9px] text-slate-400 mt-1 font-semibold ${m.sender === 'user' ? 'text-right' : 'text-left'}`}>
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2.5 justify-start">
            <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg h-8 w-8 flex items-center justify-center flex-shrink-0 animate-bounce">
              <Bot className="w-4.5 h-4.5" />
            </div>
            <div className="bg-white border border-emerald-50 rounded-2xl p-3 shadow-sm flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider animate-pulse">Bot is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick click tags */}
      <div className="px-4 py-2 border-t border-slate-100 bg-white flex gap-1.5 overflow-x-auto flex-nowrap scrollbar-none items-center">
        <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 whitespace-nowrap">Tap Query:</span>
        {getSuggestions().map((sug, i) => (
          <button
            key={i}
            onClick={() => handleSend(sug)}
            className="text-[10px] bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-150 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Input Deck */}
      <div className="p-3 border-t border-slate-100 bg-white flex gap-2">
        <input
          id="chatbot-text-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Type message in ${language}...`}
          className="flex-1 text-xs text-slate-700 bg-slate-50 border border-slate-150 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
        />
        <button
          id="chatbot-send-btn"
          onClick={() => handleSend()}
          disabled={loading || !inputText.trim()}
          className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl transition-all duration-150 hover:scale-[1.05] disabled:opacity-40 flex items-center justify-center cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
