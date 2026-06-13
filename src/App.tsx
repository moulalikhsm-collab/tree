import { useState, useEffect } from 'react';
import { 
  Sprout, 
  Compass, 
  TrendingUp, 
  Camera, 
  Droplets,
  BookOpen,
  User, 
  Leaf, 
  HelpCircle,
  AlertCircle,
  LogOut,
  MessageSquare
} from 'lucide-react';

import WeatherWidget from './components/WeatherWidget';
import DashboardOverview from './components/DashboardOverview';
import PlantRecommender from './components/PlantRecommender';
import GrowthPredictor from './components/GrowthPredictor';
import LeafScanner from './components/LeafScanner';
import SoilWaterAdvisor from './components/SoilWaterAdvisor';
import AuthPage from './components/AuthPage';
import GeminiChatbot from './components/GeminiChatbot';

type TabType = 'dashboard' | 'recommend' | 'growth' | 'vision' | 'soil' | 'chat';

interface UserInfo {
  uid: string;
  name: string;
  email: string;
  grade: string;
}

export type AppLanguage = 'English' | 'Telugu' | 'Hindi';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [currentLocation, setCurrentLocation] = useState('Pune, India');
  const [user, setUser] = useState<UserInfo | null>(null);
  const [language, setLanguage] = useState<AppLanguage>('English');

  useEffect(() => {
    const cached = localStorage.getItem('ecofriend_user');
    if (cached) {
      try {
        setUser(JSON.parse(cached));
      } catch (e) {
        localStorage.removeItem('ecofriend_user');
      }
    }
  }, []);

  const handleSowSeedNotification = (plantName: string) => {
    // Automatically swap tab to growth predictor so student can see predictions for what they sowed!
    setActiveTab('growth');
  };

  const handleLogout = () => {
    localStorage.removeItem('ecofriend_user');
    setUser(null);
  };

  if (!user) {
    return <AuthPage onLoginSuccess={(info) => setUser(info)} />;
  }

  // Multi-lingual translation mapping for main tab labels
  const getTabLabel = (tabId: TabType) => {
    if (language === 'Telugu') {
      switch (tabId) {
        case 'dashboard': return 'స్టూడెంట్ ట్రాకర్';
        case 'recommend': return 'AI మొక్క ఎంపిక';
        case 'growth': return 'ఎదుగుదల అంచనా';
        case 'vision': return 'ఆకు స్కాన్ AI';
        case 'soil': return 'మట్టి & నీరు';
        case 'chat': return 'ఈకోబాట్ సహాయకుడు';
      }
    } else if (language === 'Hindi') {
      switch (tabId) {
        case 'dashboard': return 'छात्र ट्रैकर';
        case 'recommend': return 'AI पौधा चयन';
        case 'growth': return 'विकास का पूर्वानुमान';
        case 'vision': return 'पत्ता स्कैन AI';
        case 'soil': return 'मिट्टी और सिंचाई';
        case 'chat': return 'ईकोबॉट AI';
      }
    }
    // Default English
    switch (tabId) {
      case 'dashboard': return 'Student Tracker';
      case 'recommend': return 'AI Recommender';
      case 'growth': return 'Growth Predictor';
      case 'vision': return 'Leaf Scan AI';
      case 'soil': return 'Soil & Water';
      case 'chat': return 'EcoBot Chat';
    }
  };

  return (
    <div id="ecofriend-root" className="min-h-screen bg-[#fafdfb] text-slate-800 font-sans">
      
      {/* Upper Brand Bar */}
      <header className="border-b border-emerald-100 bg-white/75 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center">
                <Leaf className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h1 className="text-sm font-extrabold tracking-tight text-emerald-950 font-display flex items-center gap-1">
                  EcoFriend <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">AI Assistant</span>
                </h1>
                <p className="text-[10px] text-slate-400 font-semibold tracking-wide">
                  {language === 'Telugu' ? 'తెలుగు ప్లాంటేషన్ క్లాస్‌రూమ్' : language === 'Hindi' ? 'हिंदी प्लांटेशन क्लासरूम' : 'AI Smart Plantation Companion'}
                </p>
              </div>
            </div>

            {/* Language Selector in Header */}
            <div className="flex items-center gap-1.5 bg-emerald-50 rounded-xl p-1 border border-emerald-100">
              {(['English', 'Telugu', 'Hindi'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold tracking-tight transition-all cursor-pointer ${
                    language === lang 
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-300' 
                      : 'text-slate-600 hover:bg-emerald-100'
                  }`}
                >
                  {lang === 'Telugu' ? 'తెలుగు' : lang === 'Hindi' ? 'हिंदी' : 'English'}
                </button>
              ))}
            </div>

            {/* Quick Actions / Bio Status */}
            <div className="flex items-center gap-4 text-xs">
              <div className="hidden sm:flex items-center gap-1.5 text-slate-500 font-medium">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>{language === 'Telugu' ? 'విద్యార్థి హబ్' : language === 'Hindi' ? 'विद्यार्थी हब' : 'Student Hub'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold bg-emerald-100/60 hover:bg-emerald-100 px-3 py-1.5 rounded-2xl border border-emerald-200/50 transition-colors">
                <User className="w-3.5 h-3.5 text-emerald-700" />
                <span className="truncate max-w-[120px]">{user.name}</span>
                <span className="text-[9px] text-emerald-600 font-medium">({user.grade})</span>
              </div>
              <button 
                id="signout-header-btn"
                onClick={handleLogout}
                title="Sign Out"
                className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-colors cursor-pointer border border-slate-100 hover:border-red-100"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
            
          </div>
        </div>
      </header>

      {/* Main Layout Stage */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Weather & Location Banner */}
        <WeatherWidget 
          location={currentLocation} 
          onLocationChange={(loc) => setCurrentLocation(loc)} 
        />

        {/* Tab Selector Segment */}
        <div className="bg-white/80 border border-slate-150 p-1.5 rounded-3xl flex items-center gap-1 overflow-x-auto scrollbar-none shadow-sm">
          {(
            [
              { id: 'dashboard', icon: Sprout },
              { id: 'recommend', icon: Compass },
              { id: 'growth', icon: TrendingUp },
              { id: 'vision', icon: Camera },
              { id: 'soil', icon: Droplets },
              { id: 'chat', icon: MessageSquare }
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`text-xs font-bold px-4 py-3 rounded-2xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  isSelected 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-[1.02]' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-450'}`} />
                {getTabLabel(tab.id)}
              </button>
            );
          })}
        </div>

        {/* Dynamic Workspace Container */}
        <div id="dynamic-workspace-canvas" className="transition-all duration-300">
          {activeTab === 'dashboard' && <DashboardOverview onSowTrigger={handleSowSeedNotification} language={language} user={user} />}
          {activeTab === 'recommend' && <PlantRecommender currentLocation={currentLocation} language={language} />}
          {activeTab === 'growth' && <GrowthPredictor language={language} />}
          {activeTab === 'vision' && <LeafScanner language={language} />}
          {activeTab === 'soil' && <SoilWaterAdvisor language={language} />}
          {activeTab === 'chat' && <GeminiChatbot language={language} />}
        </div>

      </main>

      {/* Humble, Clean Student Footer */}
      <footer className="border-t border-emerald-100/50 bg-white py-6 mt-16 text-center">
        <div className="max-w-7xl mx-auto px-4 text-xs text-slate-400 space-y-2">
          <p className="font-semibold text-slate-500">EcoFriend – AI Smart Plantation Assistant</p>
          <p className="max-w-md mx-auto leading-relaxed">
            {language === 'Telugu' 
              ? 'విద్యార్థులు మరియు పిల్లలు ఇంట్లోనే సులభంగా సహజ పద్దతిలో మొక్కలను పెంచడానికి గూగుల్ జెమిని తోడ్పాటుతో రూపొందించబడింది.' 
              : language === 'Hindi' 
                ? 'छात्रों और बच्चों को जैविक रूप से स्वस्थ पौधे और जड़ी-बूटियाँ उगाने में मदद करने के लिए गूगल जेमिनी के साथ संरचित।'
                : 'Helping young students and children grow healthier food and medicinal herbs organic-first. Built using Google Gemini Multimodal Diagnostic Models. No toxic chemicals, keep growing! 🌻'
            }
          </p>
        </div>
      </footer>

    </div>
  );
}
