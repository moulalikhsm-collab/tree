import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Sparkles, Trash2, ArrowRight, User, HelpCircle, MessageSquare } from 'lucide-react';
import { ChatMessage } from '../types';
import { AppLanguage } from '../App';

interface GeminiChatbotProps {
  language: AppLanguage;
}

const chatbotTexts = {
  English: {
    title: "EcoBot AI Companion",
    subtitle: "Ask me anything about organic gardening, herbal plants, compost, or soil care!",
    inputPlaceholder: "Ask EcoBot a botanical question...",
    suggestTitle: "Explore Starter Topics:",
    clearButton: "Clear Conversation",
    statusOnline: "Active Botanical AI",
    typeIndicator: "EcoBot is spelling out a response...",
    thinkingToggle: "Enable Deep Thinking Mode",
    thinkingDesc: "Uses gemini-3.1-pro-preview for complex reasoning",
    welcomeMessage: "Hello! I am your EcoBot companion. I can help you design organic compost recipes, identify watering targets for plants like Tulsi or peppermint, and diagnose common planter problems. What would you like to grow today?",
    suggestions: [
      "How do I water my Tulsi plant safely?",
      "What are the best medicinal herbs for home gardening?",
      "How can I make natural organic compost tea?",
      "Why are my tomato leaves turning yellow?"
    ]
  },
  Telugu: {
    title: "ఈకోబాట్ AI సహాయకుడు",
    subtitle: "సేంద్రీయ వ్యవసాయం, ఔషధ మొక్కలు లేదా కుండీల పెంపకం గురించి ఏదైనా అడగండి!",
    inputPlaceholder: "మొక్కల పెంపకం గురించి ప్రశ్న అడగండి...",
    suggestTitle: "ఈ క్రింది వాటితో ప్రారంభించండి:",
    clearButton: "సంభాషణను తొలగించు",
    statusOnline: "బోటానికల్ AI అందుబాటులో ఉంది",
    typeIndicator: "ఈకోబాట్ విశ్లేషిస్తోంది...",
    thinkingToggle: "లోతైన ఆలోచన ప్రక్రియను ప్రారంభించు",
    thinkingDesc: "క్లిష్టమైన విశ్లేషణకు జెమిని 3.1 ప్రో వాడండి",
    welcomeMessage: "నమస్కారం! నేను మీ తోటపని AI సహాయకుడిని. ఇంట్లో కుండీలలో తులసి లేదా పుదీనా పెంచడం ఎలా, సహజమైన సేంద్రీయ ఎరువులను ఎలా తయారుచేసుకోవాలో నేను మీకు నేర్పిస్తాను Ask me anything!",
    suggestions: [
      "తులసి మొక్కకు నీరు ఎలా పోయాలి?",
      "ఇంట్లో పెంచగలిగే సులువైన ఔషధ మొక్కలు ఏమిటి?",
      "సేంద్రీయ ఎరువుల నీరు (Compost Tea) ఎలా తయారు చేయాలి?",
      "టొమాటో ఆకులు పసుపు రంగులోకి మారడానికి కారణం ఏమిటి?"
    ]
  },
  Hindi: {
    title: "ईकोबॉट AI सहायक",
    subtitle: "जैविक बागवानी, औषधीय पौधों, या गमलों के बारे में कुछ भी पूछें!",
    inputPlaceholder: "ईकोबॉट से बागवानी का प्रश्न पूछें...",
    suggestTitle: "इन विषयों से शुरू करें:",
    clearButton: "वार्तालाप साफ़ करें",
    statusOnline: "सक्रिय वानस्पतिक AI",
    typeIndicator: "ईकोबॉट उत्तर टाइप कर रहा है...",
    thinkingToggle: "गहन विचार मोड सक्षम करें",
    thinkingDesc: "जटिल सवालों के लिए जेमिनी 3.1 प्रो का उपयोग करें",
    welcomeMessage: "नमस्ते! मैं आपका बागवानी AI मित्र हूँ। मैं आपको घर पर जैविक खाद बनाने, पुदीना या तुलसी की सुरक्षित सिंचाई और पौधों की बीमारियों को ठीक करने में मदद कर सकता हूँ। पूछिए!",
    suggestions: [
      "तुलसी के पौधे में पानी कब और कैसे डालें?",
      "घर पर उगाने के लिए सबसे अच्छे औषधीय पौधे कौन से हैं?",
      "जैविक खाद की चाय (Compost Tea) कैसे बनाएं?",
      "टमाटर के पत्ते पीले क्यों हो रहे हैं?"
    ]
  }
};

export default function GeminiChatbot({ language }: GeminiChatbotProps) {
  const currentText = chatbotTexts[language] || chatbotTexts.English;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedResponse, setStreamedResponse] = useState('');
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    const cached = localStorage.getItem(`ecofriend_chat_${language}`);
    if (cached) {
      try {
        setMessages(JSON.parse(cached));
      } catch (e) {
        initializeWelcome();
      }
    } else {
      initializeWelcome();
    }
  }, [language]);

  const initializeWelcome = () => {
    const welcome: ChatMessage = {
      id: 'welcome_' + Date.now(),
      sender: 'assistant',
      text: currentText.welcomeMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([welcome]);
  };

  // Cache messages to localStorage
  const saveMessages = (msgs: ChatMessage[]) => {
    localStorage.setItem(`ecofriend_chat_${language}`, JSON.stringify(msgs));
  };

  // Scroll bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, streamedResponse, isStreaming]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now() + '_user',
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    saveMessages(newMessages);
    setInputValue('');
    setIsStreaming(true);
    setStreamedResponse('');

    try {
      // Package messages for /api/chat matching server expectations
      const payloadMessages = newMessages.map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: payloadMessages,
          language: language,
          thinking: isThinking
        })
      });

      if (!response.body) {
        throw new Error("Empty streaming body in response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let activeText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (dataStr === '[DONE]') {
              break;
            }
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                activeText += parsed.text;
                setStreamedResponse(activeText);
              }
            } catch (err) {
              console.warn("Error parsing chunk payload", err);
            }
          }
        }
      }

      // Conclude Streaming by wrapping the response into message list
      const botMsg: ChatMessage = {
        id: 'msg_' + Date.now() + '_assistant',
        sender: 'assistant',
        text: activeText || "Apologies, I couldn't formulate a proper response right now. Please test again shortly!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const finalMessages = [...newMessages, botMsg];
      setMessages(finalMessages);
      saveMessages(finalMessages);

    } catch (error) {
      console.error("Foliar Chat API Error:", error);
      const errorMsg: ChatMessage = {
        id: 'msg_' + Date.now() + '_error',
        sender: 'assistant',
        text: language === 'Telugu' 
          ? "క్షమించండి, మీ అభ్యర్థనను ప్రాసెస్ చేయడంలో లోపం సంభవించింది. దయచేసి మళ్ళీ ప్రయత్నించండి." 
          : language === 'Hindi'
            ? "क्षमा करें, अनुरोध संसाधित करने में त्रुटि हुई है। कृपया पुनः प्रयास करें।"
            : "Oops, I encountered a communication error connecting to the gardening core. Please check your setup and try again!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const finalMessages = [...newMessages, errorMsg];
      setMessages(finalMessages);
      saveMessages(finalMessages);
    } finally {
      setIsStreaming(false);
      setStreamedResponse('');
    }
  };

  const handleClearChat = () => {
    localStorage.removeItem(`ecofriend_chat_${language}`);
    initializeWelcome();
  };

  return (
    <div id="gemini-chatbot-canvas" className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in">
      
      {/* Informative Side Card */}
      <div className="lg:col-span-1 space-y-4">
        
        <div className="bg-white border border-slate-150 p-5 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm">
            <Bot className="w-5 h-5 text-emerald-600 animate-bounce" />
            <span>{currentText.statusOnline}</span>
          </div>
          
          <p className="text-xs text-slate-500 leading-relaxed">
            {language === 'Telugu' 
              ? 'ఈకోబాట్ సహాయకుడు మీ మొక్కల విశ్లేషణను పెంచుతుంది. మీరు ఏ సమయంలోనైనా తెలుగులోనే ప్రశ్నలు అడిగి సేంద్రీయ పరిరక్షణ మార్గదర్శకాలను తెలుసుకోవచ్చు!' 
              : language === 'Hindi'
                ? 'ईकोबॉट सहायक पूरी तरह से पर्यावरण-अनुकूल और जैविक तकनीकों पर प्रशिक्षित है। रासायनिक कीटनाशकों के स्थान पर प्राकृतिक विकल्प सीखें!'
                : 'Your personal AI Gardening Mentor uses clean, Google Gemini 3.5 models to offer expert support in composting, custom fertilizer formulations, and plant watering regimens.'}
          </p>

          <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'Telugu' ? 'సేంద్రీయ పరిజ్ఞానం' : language === 'Hindi' ? 'जैविक ज्ञान' : 'Organic Knowledge'}</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              {language === 'Telugu' ? 'రసాయనాలు లేకుండా 100% సహజ పద్ధతులు మాత్రమే' : language === 'Hindi' ? 'बिना किसी रसायन के 100% प्राकृतिक कृषि विधियाँ' : '100% natural agriculture techniques with no toxic chemicals.'}
            </p>
          </div>

          {/* High Thinking Mode Toggle */}
          <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
                <Sparkles className={`w-3.5 h-3.5 ${isThinking ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`} />
                <span className={isThinking ? 'text-emerald-700' : ''}>{currentText.thinkingToggle}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isThinking} 
                  onChange={() => setIsThinking(!isThinking)} 
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
              {currentText.thinkingDesc}
            </p>
          </div>

          <button
            onClick={handleClearChat}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-2xl text-xs font-bold border border-slate-150 hover:border-red-100 transition-colors pointer-cursor cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{currentText.clearButton}</span>
          </button>
        </div>

        {/* Suggestion Quick Chips */}
        <div className="bg-emerald-50/50 border border-emerald-100/60 p-5 rounded-3xl space-y-3">
          <h3 className="text-xs font-extrabold text-emerald-950 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>{currentText.suggestTitle}</span>
          </h3>
          <div className="flex flex-col gap-2">
            {currentText.suggestions.map((s, idx) => (
              <button
                key={idx}
                disabled={isStreaming}
                onClick={() => handleSendMessage(s)}
                className="text-left text-[11px] font-semibold p-2.5 bg-white hover:bg-emerald-600 text-slate-700 hover:text-white rounded-xl border border-emerald-100 shadow-[0_1px_2px_rgba(16,185,129,0.05)] transition-all cursor-pointer group flex items-start gap-1 justify-between disabled:opacity-50 disabled:pointer-events-none"
              >
                <span className="leading-snug">{s}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white shrink-0 mt-0.5" />
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Main Chat Conversation */}
      <div className="lg:col-span-3 flex flex-col h-[520px] bg-white border border-slate-150 rounded-3xl overflow-hidden shadow-sm">
        
        {/* Chat Header */}
        <div className="bg-emerald-900 text-white p-4 flex items-center gap-3 border-b border-emerald-950">
          <div className="p-2 bg-emerald-800 text-emerald-200 rounded-xl">
            <MessageSquare className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xs font-extrabold tracking-tight font-display">{currentText.title}</h2>
            <p className="text-[10px] text-emerald-200/80 font-medium">{currentText.subtitle}</p>
          </div>
        </div>

        {/* Dynamic Bubble Scroller */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
          {messages.map((m) => {
            const isBot = m.sender === 'assistant';
            return (
              <div 
                key={m.id} 
                className={`flex gap-3 max-w-[85%] ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar Icon */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                  isBot 
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm' 
                    : 'bg-white text-emerald-700 border-slate-200 shadow-sm'
                }`}>
                  {isBot ? <Bot className="w-4.5 h-4.5" /> : <User className="w-4.5 h-4.5" />}
                </div>

                {/* Bubble Block */}
                <div>
                  <div className={`p-3.5 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] text-xs leading-relaxed space-y-2 ${
                    isBot 
                      ? 'bg-white text-slate-800 border border-slate-150 rounded-tl-none font-medium' 
                      : 'bg-emerald-600 text-white rounded-tr-none font-bold'
                  }`}>
                    <p className="whitespace-pre-line">{m.text}</p>
                  </div>
                  {/* Timestamp */}
                  <span className={`text-[9px] text-slate-400 mt-1 block px-1 font-semibold ${isBot ? 'text-left' : 'text-right'}`}>
                    {m.timestamp}
                  </span>
                </div>

              </div>
            );
          })}

          {/* Active Streaming Chunk Display */}
          {isStreaming && streamedResponse && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-emerald-600 text-white border border-emerald-700 shadow-sm">
                <Bot className="w-4.5 h-4.5 animate-spin" />
              </div>
              <div>
                <div className="p-3.5 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] text-xs leading-relaxed bg-white text-slate-800 border border-slate-150 rounded-tl-none font-medium">
                  <p className="whitespace-pre-line">{streamedResponse}</p>
                </div>
                <span className="text-[9px] text-slate-400 mt-1 block px-1 font-bold animate-pulse">
                  {currentText.typeIndicator}
                </span>
              </div>
            </div>
          )}

          {/* Fallback Thinking Indicator */}
          {isStreaming && !streamedResponse && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-emerald-600 text-white border border-emerald-700 shadow-sm">
                <Bot className="w-4.5 h-4.5 animate-bounce" />
              </div>
              <div className="p-3.5 bg-white border border-slate-150 text-slate-500 rounded-2xl rounded-tl-none text-xs flex items-center gap-2 shadow-sm font-semibold">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                </span>
                <span>{currentText.typeIndicator}</span>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Fixed Footer Input Bar */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className="p-3 border-t border-slate-150 bg-white flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isStreaming}
            placeholder={currentText.inputPlaceholder}
            className="flex-1 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none transition-all disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isStreaming}
            className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-md shadow-emerald-600/15 disabled:opacity-50 transition-all cursor-pointer disabled:pointer-events-none hover:scale-105"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </form>

      </div>

    </div>
  );
}
