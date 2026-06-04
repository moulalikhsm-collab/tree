import { useState, useEffect } from 'react';
import { 
  Sprout, 
  Compass, 
  TrendingUp, 
  Camera, 
  MessageSquare, 
  Droplets,
  BookOpen,
  User, 
  Leaf, 
  HelpCircle,
  AlertCircle,
  LogOut
} from 'lucide-react';

import WeatherWidget from './components/WeatherWidget';
import DashboardOverview from './components/DashboardOverview';
import PlantRecommender from './components/PlantRecommender';
import GrowthPredictor from './components/GrowthPredictor';
import LeafScanner from './components/LeafScanner';
import SoilWaterAdvisor from './components/SoilWaterAdvisor';
import AIChatBot from './components/AIChatBot';
import AuthPage from './components/AuthPage';

type TabType = 'dashboard' | 'recommend' | 'growth' | 'vision' | 'soil' | 'chat';

interface UserInfo {
  name: string;
  email: string;
  grade: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [currentLocation, setCurrentLocation] = useState('Pune, India');
  const [user, setUser] = useState<UserInfo | null>(null);

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
                <p className="text-[10px] text-slate-400 font-semibold tracking-wide">AI Smart Plantation Companion</p>
              </div>
            </div>

            {/* Quick Actions / Bio Status */}
            <div className="flex items-center gap-4 text-xs">
              <div className="hidden sm:flex items-center gap-1.5 text-slate-500 font-medium">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Student Hub</span>
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
              { id: 'dashboard', label: 'Student Tracker', icon: Sprout },
              { id: 'recommend', label: 'AI Recommender', icon: Compass },
              { id: 'growth', label: 'Growth Predictor', icon: TrendingUp },
              { id: 'vision', label: 'Leaf Scan AI', icon: Camera },
              { id: 'soil', label: 'Soil & Water', icon: Droplets },
              { id: 'chat', label: 'Ask Companion Bot', icon: MessageSquare }
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
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Workspace Container */}
        <div id="dynamic-workspace-canvas" className="transition-all duration-300">
          {activeTab === 'dashboard' && <DashboardOverview onSowTrigger={handleSowSeedNotification} />}
          {activeTab === 'recommend' && <PlantRecommender currentLocation={currentLocation} />}
          {activeTab === 'growth' && <GrowthPredictor />}
          {activeTab === 'vision' && <LeafScanner />}
          {activeTab === 'soil' && <SoilWaterAdvisor />}
          {activeTab === 'chat' && <AIChatBot />}
        </div>

      </main>

      {/* Humble, Clean Student Footer */}
      <footer className="border-t border-emerald-100/50 bg-white py-6 mt-16 text-center">
        <div className="max-w-7xl mx-auto px-4 text-xs text-slate-400 space-y-2">
          <p className="font-semibold text-slate-500">EcoFriend – AI Smart Plantation Assistant</p>
          <p className="max-w-md mx-auto leading-relaxed">
            Helping young students and children grow healthier food and medicinal herbs organic-first. Built using Google Gemini Multimodal Diagnostic Models. No toxic chemicals, keep growing! 🌻
          </p>
        </div>
      </footer>

    </div>
  );
}
