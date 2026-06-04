import React, { useState } from 'react';
import { Sprout, Award, HelpCircle, Heart, Plus, Calendar, AlertCircle, Check } from 'lucide-react';
import { PlantTracker } from '../types';
import { AppLanguage } from '../App';

interface DashboardOverviewProps {
  onSowTrigger: (plantName: string) => void;
  language: AppLanguage;
}

export default function DashboardOverview({ onSowTrigger, language }: DashboardOverviewProps) {
  // Collection of virtual student pots
  const [pots, setPots] = useState<PlantTracker[]>([
    { id: '1', name: 'Holy Tulsi Mix', type: 'Medicinal Herb', datePlanted: '2026-05-15', stage: 'Active Vegetative Canopy', wateringReminder: 'Daily morning moisten', healthScore: 92 },
    { id: '2', name: 'Cherry Tomato Pot', type: 'Vegetable', datePlanted: '2026-05-28', stage: 'Sprouting seedlings', wateringReminder: '250ml water scheduled', healthScore: 88 },
    { id: '3', name: 'English Peppermint', type: 'Medicinal Herb', datePlanted: '2026-06-01', stage: 'Sowing seed stage', wateringReminder: 'Keep soil moist', healthScore: 95 }
  ]);
  const [showSowForm, setShowSowForm] = useState(false);
  const [newPlantName, setNewPlantName] = useState('');
  const [newPlantType, setNewPlantType] = useState('Vegetable');

  // Interactive daily student checklist (gets translated or adapts based on language)
  const [tasks, setTasks] = useState([
    { id: 1, textEnglish: 'Inspect underside of leaves for Spider Mite webs', textTelugu: 'కీటకాలు లేవని నిర్ధారించడానికి ఆకుల వెనుక భాగాలను తనిఖీ చేయండి', textHindi: 'कीड़ों की जांच के लिए पत्तियों के पिछले भाग का निरीक्षण करें', done: true },
    { id: 2, textEnglish: 'Check if top 1-inch of container soil is fully dry before watering', textTelugu: 'నీరు పోసే ముందు మట్టి తేమగా ఉందో లేదో వేలితో పరీక్షించండి', textHindi: 'सिंचाई करने से पहले ऊपर की 1 इंच मिट्टी की सूखी परत को छूकर जांचें', done: false },
    { id: 3, textEnglish: 'Spray organic home rice-water or compost tea dilution', textTelugu: 'బియ్యం కడిగిన పులిసిన నీరు లేదా కంపోస్ట్ టీ ద్రావణాన్ని స్ప్రింకిల్ చేయండి', textHindi: 'चावल का पानी या कंपोस्ट टी तरल का छिड़काव करें', done: false },
    { id: 4, textEnglish: 'Reposition young seedlings to receive 4-6 hours of partial warm sun', textTelugu: 'చిన్న మొలకలను రోజూ పొద్దున్నే 4 గంటల పాటు ఎండ తగిలే ప్రదేశంలో ఉంచండి', textHindi: 'छोटे पौधों को धूप मिलने के लिए सुबह की आंशिक धूप वाले क्षेत्र में रखें', done: true }
  ]);

  const handleSow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlantName.trim()) return;

    const newPot: PlantTracker = {
      id: String(Date.now()),
      name: newPlantName,
      type: newPlantType,
      datePlanted: new Date().toISOString().split('T')[0],
      stage: language === 'Telugu' ? 'విత్తిన దశ' : language === 'Hindi' ? 'बुवाई का चरण' : 'Sowing seed stage',
      wateringReminder: language === 'Telugu' ? 'రోజూ తడి ఉంచాలి' : language === 'Hindi' ? 'रोजाना सिंचाई करें' : 'Moisten soil daily',
      healthScore: 100
    };

    setPots([newPot, ...pots]);
    onSowTrigger(newPlantName);
    setNewPlantName('');
    setShowSowForm(false);
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const getDaysPlanted = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const dashboardTexts = {
    badge: {
      English: 'Green Student Badge Activated',
      Telugu: 'గ్రీన్ స్టూడెంట్ బ్యాడ్జ్ సక్రియంగా ఉంది',
      Hindi: 'ग्रीन स्टूडेंट बैच सक्रिय है'
    },
    welcomeTitle: {
      English: 'Nurture your plant companion with AI, the organic way!',
      Telugu: 'మీ మొక్కల నేస్తాన్ని సేంద్రీయ పద్దతిలో AI సహాయంతో పెంచండి!',
      Hindi: 'कृत्रिम बुद्धिमत्ता (AI) की मदद से जैविक रूप से पौधे उगाएं!'
    },
    welcomeSub: {
      English: 'Welcome to EcoFriend. Sow virtual seeds below to monitor development timelines, run Leaf Diagnostics via computer vision, or chat with bot advisors in English, తెలుగు or हिंदी!',
      Telugu: 'సేంద్రీయ వ్యవసాయ బడి కి స్వాగతం! మట్టి ని వదులు చేయండి, మీ తోట గురించి జెమిని సహాయంతో ఏ ప్రశ్ననైనా ఇక్కడే అడిగి తెలుసుకోండి.',
      Hindi: 'ईकोफ्रेंड में आपका स्वागत है। विकास की समयसीमा की निगरानी के लिए नीचे आभासी बीज बोएं, पत्ता निदान चलाएं, या तीनों भाषाओं में चैट करें!'
    },
    statSpecimens: {
      English: 'Active Specimen',
      Telugu: 'నాటబడిన మొక్కలు',
      Hindi: 'सक्रिय नमूने'
    },
    statSpecimensSub: {
      English: 'Sown Containers',
      Telugu: 'కుండీల సంఖ్య',
      Hindi: 'गमले व कंटेनर समूह'
    },
    statHealth: {
      English: 'Vitality Average',
      Telugu: 'సగటు ఆరోగ్యం',
      Hindi: 'औसत स्वास्थ्य सूचकांक'
    },
    statHealthSub: {
      English: 'Lush Vitality Score',
      Telugu: 'పచ్చదనం రేటింగ్',
      Hindi: 'सुरक्षात्मक विकास'
    },
    statAch: {
      English: 'Daily Achievements',
      Telugu: 'దినసరి లక్ష్యాలు',
      Hindi: 'दैनिक उपलब्धियां'
    },
    statAchSub: {
      English: 'Chores Complete',
      Telugu: 'పూర్తయిన పనులు',
      Hindi: 'किए गए कार्य'
    },
    statAlarms: {
      English: 'Reminders Set',
      Telugu: 'యాక్టివ్ అలారాలు',
      Hindi: 'सक्रिय अलार्म'
    },
    statAlarmsSub: {
      English: 'Pending checks',
      Telugu: 'పెండింగ్ సంరక్షణలు',
      Hindi: 'कार्य समीक्षाएं'
    },
    trackerTitle: {
      English: 'My Virtual Pots & Classroom Tracker',
      Telugu: 'నా డిజిటల్ కుండీలు & క్లాస్‌రూమ్ తోట',
      Hindi: 'मेरे गमले और कक्षा बागवानी'
    },
    trackerSub: {
      English: 'Development indicators of your organic plantation containers',
      Telugu: 'మీరు నాటిన ప్రతి విత్తనం యొక్క వృద్ధి వివరాలు',
      Hindi: 'आपके पौधों के विकास मापदंडों का वास्तविक समय विवरण'
    },
    btnSow: {
      English: 'Sow Virtual Seed',
      Telugu: 'కొత్త విత్తనం నాటండి',
      Hindi: 'नया बीज बोएं'
    },
    formTitle: {
      English: 'Sow new virtual soil container',
      Telugu: 'కొత్త కుండీ లో విత్తనం నాటే ఫారం',
      Hindi: 'गमले में नया पौधा या बीज डालें'
    },
    formName: {
      English: 'Specimen Title',
      Telugu: 'మొక్క పేరు',
      Hindi: 'पौधे का नाम'
    },
    formCategory: {
      English: 'Category',
      Telugu: 'మొక్క రకం',
      Hindi: 'श्रेणी'
    },
    formCancel: {
      English: 'Cancel',
      Telugu: 'రద్దు చేయి',
      Hindi: 'रद्द करें'
    },
    formSowNow: {
      English: 'Sow Seed Now',
      Telugu: 'విత్తనాన్ని నాటండి',
      Hindi: 'अभी बीज बोएं'
    },
    achTitle: {
      English: 'Classroom Farming Objectives',
      Telugu: 'సేంద్రీయ తోట లక్ష్యాలు',
      Hindi: 'कक्षा बागवानी लक्ष्य'
    },
    achSub: {
      English: 'Student objectives & active tasks checklist',
      Telugu: 'రోజువారీ పనుల చెక్ లిస్ట్',
      Hindi: 'छात्रों के कार्यों की सूची'
    },
    daysPlanted: {
      English: 'Days Sown',
      Telugu: 'విత్తిన రోజులు',
      Hindi: 'बोए गए दिन'
    },
    schedule: {
      English: 'Water Schedule',
      Telugu: 'నీరు పట్టే క్రమం',
      Hindi: 'सिंचाई अनुसूची'
    },
    dailyCompostHintTitle: {
      English: 'Classroom Garden Hint',
      Telugu: 'సేంద్రీయ తోట చిట్కా',
      Hindi: 'कक्षा बागवानी संकेत'
    },
    dailyCompostHintText: {
      English: 'Completing daily achievements accelerates virtual health stats. Try checking soil pH and moisture before triggering watering alerts to earn maximum water-saver points!',
      Telugu: 'రోజువారీ వ్యవసాయ పనులను పూర్తి చేయడం ద్వారా మీ మొక్కల రేటింగ్ పెరుగుతుంది. నీటి తడులతో పాటు మట్టి తేమ ఉందో లేదో తరచూ గమనిస్తూ ఉండండి.',
      Hindi: 'दैनिक कार्यों को पूर्ण करने से पौधों के स्वास्थ्य सूचकांक में सुधार होता है। पानी का संरक्षण करने के लिए सही समय पर सिंचाई करें।'
    }
  };

  const getDText = (key: keyof typeof dashboardTexts) => {
    return dashboardTexts[key]?.[language] || dashboardTexts[key]?.[language] || dashboardTexts[key]?.['English'] || key;
  };

  const getLocalizedPlantType = (type: string) => {
    if (language === 'Telugu') {
      if (type.includes('Herb')) return 'ఔషధ మొక్క / Herb';
      if (type.includes('Vegetable')) return 'కూరగాయ జాతి';
      if (type.includes('Flower')) return 'పువ్వుల మొక్క';
      return 'ఇతర మొక్క';
    }
    if (language === 'Hindi') {
      if (type.includes('Herb')) return 'औषधीय जड़ी-बूटी';
      if (type.includes('Vegetable')) return 'सब्जी का पौधा';
      if (type.includes('Flower')) return 'सुंदर फूल';
      return 'सामान्य पौधा';
    }
    return type;
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-100/90 via-emerald-100/50 to-white border border-emerald-200 rounded-3xl p-6 relative overflow-hidden">
        <div className="max-w-xl relative z-10 space-y-3.5">
          <span className="text-[10px] font-extrabold uppercase bg-emerald-600 text-white px-2.5 py-1 rounded-md tracking-wider">
            {getDText('badge')}
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold text-emerald-950 font-sans tracking-tight">
            {getDText('welcomeTitle')}
          </h2>
          <p className="text-xs text-emerald-900 leading-relaxed max-w-md">
            {getDText('welcomeSub')}
          </p>
        </div>
        {/* Subtle background decoration */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <Sprout className="w-64 h-64 text-emerald-900 translate-x-12 translate-y-12" />
        </div>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{getDText('statSpecimens')}</span>
          <span className="text-xl font-extrabold text-emerald-800 block mt-1">{pots.length}</span>
          <span className="text-[9px] text-slate-450 font-medium block mt-0.5">{getDText('statSpecimensSub')}</span>
        </div>
        <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{getDText('statHealth')}</span>
          <span className="text-xl font-extrabold text-emerald-600 block mt-1">
            {pots.length > 0 ? (pots.reduce((sum, p) => sum + p.healthScore, 0) / pots.length).toFixed(0) : 100}%
          </span>
          <span className="text-[9px] text-slate-450 font-medium block mt-0.5">{getDText('statHealthSub')}</span>
        </div>
        <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{getDText('statAch')}</span>
          <span className="text-xl font-extrabold text-amber-500 block mt-1">
            {tasks.filter(t => t.done).length} / {tasks.length}
          </span>
          <span className="text-[9px] text-slate-450 font-medium block mt-0.5">{getDText('statAchSub')}</span>
        </div>
        <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{getDText('statAlarms')}</span>
          <span className="text-xl font-extrabold text-teal-600 block mt-1">3</span>
          <span className="text-[9px] text-slate-450 font-medium block mt-0.5">{getDText('statAlarmsSub')}</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        
        {/* Pots Tracker left */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                <Sprout className="w-4.5 h-4.5 text-emerald-600" /> {getDText('trackerTitle')}
              </h3>
              <p className="text-xs text-slate-500">{getDText('trackerSub')}</p>
            </div>
            
            <button
              id="dashboard-sow-btn"
              onClick={() => setShowSowForm(!showSowForm)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all duration-150 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> {getDText('btnSow')}
            </button>
          </div>

          {showSowForm && (
            <form onSubmit={handleSow} className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 space-y-3.5 animate-fade-in shadow-inner">
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">{getDText('formTitle')}</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">{getDText('formName')}</label>
                  <input
                    id="sow-plant-name-input"
                    type="text"
                    required
                    placeholder="e.g. English Peppermint"
                    value={newPlantName}
                    onChange={(e) => setNewPlantName(e.target.value)}
                    className="w-full text-xs text-slate-700 bg-white border border-slate-150 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">{getDText('formCategory')}</label>
                  <select
                    id="sow-plant-type-select"
                    value={newPlantType}
                    onChange={(e) => setNewPlantType(e.target.value)}
                    className="w-full text-xs text-slate-700 bg-white border border-slate-150 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Vegetable">{language === 'Telugu' ? 'కూరగాయలు' : language === 'Hindi' ? 'सब्जी पौधा' : 'Vegetable'}</option>
                    <option value="Fruit">{language === 'Telugu' ? 'ఫల జాతి / పండ్లు' : language === 'Hindi' ? 'फल वृक्ष' : 'Fruit'}</option>
                    <option value="Medicinal Herb">{language === 'Telugu' ? 'ఔషధ మొక్క / తులసి' : language === 'Hindi' ? 'औषधीय जड़ी-बूटी' : 'Medicinal Herb'}</option>
                    <option value="Foliage & Flower">{language === 'Telugu' ? 'పూలమొక్క' : language === 'Hindi' ? 'पुष्प प्रजाति' : 'Floral & Flower'}</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2.5">
                <button
                  id="sow-cancel-btn"
                  type="button"
                  onClick={() => setShowSowForm(false)}
                  className="text-slate-500 hover:bg-slate-100 text-xs px-3 py-2 rounded-lg font-medium cursor-pointer"
                >
                  {getDText('formCancel')}
                </button>
                <button
                  id="sow-submit-btn"
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2 rounded-lg font-bold transition-transform hover:scale-[1.02] cursor-pointer"
                >
                  {getDText('formSowNow')}
                </button>
              </div>
            </form>
          )}

          {/* Sown list */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {pots.map((p) => (
              <div key={p.id} className="bg-white border border-slate-150 rounded-2xl p-4 hover:border-emerald-250 transition-all duration-200 flex flex-col justify-between group shadow-sm">
                <div>
                  <div className="flex items-center justify-between gap-1.5 mb-2.5">
                    <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-150/40 font-bold px-2 py-0.5 rounded-full uppercase">
                      {getLocalizedPlantType(p.type)}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-0.5">
                      <Heart className="w-3 h-3 text-emerald-500 fill-emerald-500" /> {p.healthScore}%
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-slate-800 tracking-tight group-hover:text-emerald-700 transition-colors">
                    {p.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 italic mt-0.5">{p.stage}</p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-[11px]">
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="flex items-center gap-1 font-medium text-slate-400">
                        <Calendar className="w-3.5 h-3.5" /> {language === 'Telugu' ? 'విత్తబడ్డ సమయం' : language === 'Hindi' ? 'उगाने की अवधि' : 'Growth Term'}
                      </span>
                      <span className="font-bold text-slate-700">{getDaysPlanted(p.datePlanted)} {getDText('daysPlanted')}</span>
                    </div>

                    <div className="flex justify-between items-center text-slate-600">
                      <span className="flex items-center gap-1 font-medium text-slate-400">
                        💧 {getDText('schedule')}
                      </span>
                      <span className="font-semibold text-emerald-800 truncate max-w-[120px]">{p.wateringReminder}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-100/50 flex justify-end">
                  <span className="text-[9px] bg-emerald-50 text-emerald-800 font-extrabold px-2 py-0.5 rounded uppercase">
                    {language === 'Telugu' ? 'లైవ్ నిఘా' : language === 'Hindi' ? 'लाइव ट्रैकिंग' : 'Live tracking'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chores right */}
        <div className="lg:col-span-3 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              <Award className="w-4.5 h-4.5 text-amber-500" /> {getDText('achTitle')}
            </h3>
            <p className="text-xs text-slate-500">{getDText('achSub')}</p>
          </div>

          <div className="bg-white border border-slate-150 rounded-2xl p-5 space-y-3 shadow-sm">
            {tasks.map((tk) => (
              <div 
                key={tk.id} 
                onClick={() => toggleTask(tk.id)}
                className={`p-3 border rounded-xl flex items-start gap-3 cursor-pointer transition-colors duration-150 ${
                  tk.done 
                    ? 'bg-slate-50 text-slate-400 border-slate-100 line-through font-normal' 
                    : 'bg-emerald-50/20 text-slate-705 border-emerald-100 hover:bg-emerald-50/40 text-[12px] font-bold text-emerald-950'
                }`}
              >
                <div className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 ${
                  tk.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white'
                }`}>
                  {tk.done && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-xs select-none leading-relaxed leading-snug">
                  {language === 'Telugu' ? tk.textTelugu : language === 'Hindi' ? tk.textHindi : tk.textEnglish}
                </span>
              </div>
            ))}

            <div className="pt-2">
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 flex gap-2.5 items-start">
                <AlertCircle className="w-4.5 h-4.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-700 tracking-wide block">{getDText('dailyCompostHintTitle')}</span>
                  <p className="text-[11px] text-slate-500 leading-normal mt-0.5 text-justify">
                    {getDText('dailyCompostHintText')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
