import React, { useState } from 'react';
import { Droplet, Sprout, Calendar, Plus, Check, Bell } from 'lucide-react';
import { AppLanguage } from '../App';

interface SoilWaterAdvisorProps {
  language: AppLanguage;
}

export default function SoilWaterAdvisor({ language }: SoilWaterAdvisorProps) {
  // Localized state for care reminders (pre-filled with values matching chosen language)
  const [reminders, setReminders] = useState([
    { 
      id: 1, 
      plant: 'Tulsi', 
      activity: 'Spray Neem Oil on bottom leaves to deter insects', 
      day: 'Saturday morning', 
      active: true 
    },
    { 
      id: 2, 
      plant: 'Cherry Tomato Pot', 
      activity: 'Add 250ml water + wood ash calcium dose', 
      day: 'Daily 8:00 AM', 
      active: true 
    },
    { 
      id: 3, 
      plant: 'English Peppermint', 
      activity: 'Wipe dust off broad leaves with damp sponge', 
      day: 'Every Wednesday', 
      active: false 
    },
  ]);

  const [newPlant, setNewPlant] = useState('');
  const [newActivity, setNewActivity] = useState('');
  const [newDay, setNewDay] = useState('Daily Morning');

  const addReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlant || !newActivity) return;
    setReminders([
      ...reminders,
      {
        id: reminders.length + 1,
        plant: newPlant,
        activity: newActivity,
        day: newDay,
        active: true
      }
    ]);
    setNewPlant('');
    setNewActivity('');
  };

  const toggleReminder = (id: number) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const getLabel = (key: string) => {
    const texts: Record<string, Record<AppLanguage, string>> = {
      soilTitle: {
        English: 'Soil Preparation & Composition',
        Telugu: 'మట్టి తయారీ విధానం & నిష్పత్తి',
        Hindi: 'मिट्टी की तैयारी और संरचना'
      },
      soilSub: {
        English: 'Perfect organic recipe ratio for students & beginners',
        Telugu: 'మొక్కలు ఆరోగ్యంగా పెరగడానికి సులభమైన సేంద్రీయ మట్టి నిష్పత్తి',
        Hindi: 'छात्रों और शुरुआती लोगों के लिए सही जैविक नुस्खा अनुपात'
      },
      ratioTitle: {
        English: 'Recommended Soil Ratio Mixer',
        Telugu: 'ఆదర్శవంతమైన సేంద్రీయ మట్టి మిశ్రమం',
        Hindi: 'अनुशंसित मिट्टी अनुपात मिक्सर'
      },
      redLoam: {
        English: 'Red Garden Soil / Loam',
        Telugu: 'ఎర్ర మట్టి / తోట మట్టి',
        Hindi: 'लाल बगीचे की मिट्टी / दोमट'
      },
      redLoamSub: {
        English: '40% - Base sturdy substrate',
        Telugu: '40% - ప్రాథమిక పునాది మట్టి',
        Hindi: '40% - ठोस मुख्य आधार मिट्टी'
      },
      compost: {
        English: 'Organic Vermicompost / Manure',
        Telugu: 'సేంద్రీయ వర్మికంపోస్ట్ / పశువుల ఎరువు',
        Hindi: 'जैविक केंचुआ खाद (वर्मीकंपोस्ट) / गोबर खाद'
      },
      compostSub: {
        English: '30% - Essential slow-release nutrients',
        Telugu: '30% - సంపూర్ణ సేంద్రీయ పోషకాల నిధి',
        Hindi: '30% - आवश्यक धीमे-रिलीज होने वाले पोषक तत्व'
      },
      coco: {
        English: 'Coco-Peat / Sphagnum Moss',
        Telugu: 'కొబ్బరి పిట్టు (కోకో పీట్)',
        Hindi: 'कोको-पीट / नारियल का बुरादा'
      },
      cocoSub: {
        English: '20% - Excellent moisture retention',
        Telugu: '20% - మట్టిలో తేమను నిలిపి ఉంచేందుకు',
        Hindi: '20% - उत्कृष्ट नमी धारण करने की क्षमता'
      },
      perlite: {
        English: 'Perlite / Small Vermiculite',
        Telugu: 'ఇసుక లేదా చిన్న గ్రావెల్ రాయి',
        Hindi: 'परलाइट / बारीक रेत'
      },
      perliteSub: {
        English: '10% - Essential for smooth soil drainage',
        Telugu: '10% - అదనపు నీరు సజావుగా బయటకు వెళ్ళడానికి',
        Hindi: '10% - अतिरिक्त जल निकासी और वायु संचार'
      },
      guidanceTitle: {
        English: 'Organic Fertilizers & pH Guideline',
        Telugu: 'సేంద్రీయ ఎరువుల వాడకం & pH నియమాలు',
        Hindi: 'जैविक उर्वरक और पीएच दिशा-निर्देश'
      },
      nitrogenText: {
        English: 'Nitrogen Boosters: Use fermented rice water, diluted wet tea leaves, or home vegetable compost tea once a fortnight.',
        Telugu: 'నత్రజని బూస్టర్స్: ప్రతి రెండు వారాలకు ఒకసారి అన్నం వండిన గంజి నీరు లేదా చల్లారిన తేయాకు పొడిని మట్టిలో కలపండి.',
        Hindi: 'नाइट्रोजन बूस्टर: हर पखवाड़े में एक बार फरमेंटेड चावल का पानी या बची हुई चाय की पत्तियों का उपयोग करें।'
      },
      phosphorusText: {
        English: 'Sturdiness and Roots: Incorporate a spoonful of powdered banana peel (potassium) or organic rock phosphate around root borders.',
        Telugu: 'బలమైన వేర్లు: అరటిపండు తొక్కల పొడి (పొటాషియం) లేదా సేంద్రీయ రాక్ ఫాస్ఫేట్‌ను వేర్ల చుట్టూ చల్లండి.',
        Hindi: 'जड़ मजबूती: जड़ क्षेत्र के चारों ओर सूखे केले के छिलके का पाउडर (पोटेशियम) या रॉक फॉस्फेट मिलाएं।'
      },
      phText: {
        English: 'pH Level Protection: Most medicinal herbs thrive best in mildly acidic soil (6.0 - 6.8 pH). Add a pinch of wood ash if soil gets too soggy.',
        Telugu: 'pH రక్షణ: చాలా రకాల ఆయుర్వేద మొక్కలు 6.0 - 6.8 pH లో బాగా పెరుగుతాయి. కాస్త కలప బూడిదను జల్లడం ద్వారా మట్టి ఆరోగ్యాన్ని పెంచవచ్చు.',
        Hindi: 'पीएच स्तर संरक्षण: अधिकांश औषधीय पौधे 6.0 से 6.8 पीएच की मिट्टी में पनपते हैं। मिट्टी अम्लीय हो तो थोड़ी लकड़ी की राख मिलाएं।'
      },
      calendarTitle: {
        English: 'Smart Care Calendar & Reminders',
        Telugu: 'స్మార్ట్ కేర్ క్యాలెండర్ & అలారాలు',
        Hindi: 'स्मार्ट देखभाल कैलेंडर और अनुस्मारक'
      },
      calendarSub: {
        English: 'Track daily watering routines, composting, and insect checks',
        Telugu: 'మొక్కలకు నీరు పట్టే సమయం మరియు సంరక్షణ పనుల ట్రాకర్',
        Hindi: 'सिंचाई, निराई-गुड़ाई और कीट नियंत्रण कार्यों पर नज़र रखें'
      },
      setReminder: {
        English: 'Set New Care Task',
        Telugu: 'కొత్త సంరక్షణా పనిని జోడించండి',
        Hindi: 'नया कार्य जोड़ें'
      },
      placeholderPlant: {
        English: 'Plant Name (e.g. Mint)',
        Telugu: 'మొక్క పేరు (ఉదా: పుదీనా)',
        Hindi: 'पौधे का नाम (जैसे: पुदीना)'
      },
      placeholderActivity: {
        English: 'Activity (e.g. Add 200ml water)',
        Telugu: 'చేయవలసిన పని (ఉదా: 200ml నీరు పోయాలి)',
        Hindi: 'कार्य (जैसे: 200ml पानी दें)'
      },
      morning: {
        English: 'Daily Morning',
        Telugu: 'ప్రతిరోజూ ఉదయం',
        Hindi: 'रोज सुबह'
      },
      every2days: {
        English: 'Every 2 Days',
        Telugu: 'రెండు రోజులకు ఒకసారి',
        Hindi: 'हर 2 दिन में'
      },
      weeklySat: {
        English: 'Weekly (Saturday)',
        Telugu: 'వారానికి ఒకసారి (శనివారం)',
        Hindi: 'साप्ताहिक (शनिवार)'
      },
      weeklyWed: {
        English: 'Every Wednesday',
        Telugu: 'ప్రతి బుధవారం ఊడ్చడం/తడపడం',
        Hindi: 'हर बुधवार'
      }
    };
    return texts[key]?.[language] || texts[key]?.['English'] || key;
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Soil Intelligence section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <Sprout className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">{getLabel('soilTitle')}</h3>
              <p className="text-[11px] text-slate-500">{getLabel('soilSub')}</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
            <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">{getLabel('ratioTitle')}</span>
            
            <div className="space-y-3 pt-2">
              {/* Red loam */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600">{getLabel('redLoam')}</span>
                  <span className="text-emerald-600">{getLabel('redLoamSub')}</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[40%]" />
                </div>
              </div>

              {/* Compost */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600">{getLabel('compost')}</span>
                  <span className="text-emerald-600">{getLabel('compostSub')}</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full w-[30%]" />
                </div>
              </div>

              {/* Coco peat */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600">{getLabel('coco')}</span>
                  <span className="text-sky-600">{getLabel('cocoSub')}</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-sky-400 h-full w-[20%]" />
                </div>
              </div>

              {/* Sand/Perlite */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600">{getLabel('perlite')}</span>
                  <span className="text-amber-600">{getLabel('perliteSub')}</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full w-[10%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-xl space-y-2.5">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest block">{getLabel('guidanceTitle')}</span>
            <div className="text-xs text-slate-600 leading-relaxed space-y-2 font-sans">
              <p>🌱 <strong>{getLabel('nitrogenText')}</strong></p>
              <p>🍌 <strong>{getLabel('phosphorusText')}</strong></p>
              <p>⚡ <strong>{getLabel('phText')}</strong></p>
            </div>
          </div>
        </div>

        {/* Reminders calendar right */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <Calendar className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">{getLabel('calendarTitle')}</h3>
              <p className="text-[11px] text-slate-500">{getLabel('calendarSub')}</p>
            </div>
          </div>

          <form onSubmit={addReminder} className="bg-slate-50 p-4 border border-slate-100 rounded-xl space-y-3 shadow-inner">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">{getLabel('setReminder')}</span>
            <div className="grid grid-cols-2 gap-3">
              <input
                id="reminder-plant-input"
                type="text"
                placeholder={getLabel('placeholderPlant')}
                value={newPlant}
                onChange={(e) => setNewPlant(e.target.value)}
                className="text-xs text-slate-700 bg-white border border-slate-150 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <select
                id="reminder-day-select"
                value={newDay}
                onChange={(e) => setNewDay(e.target.value)}
                className="text-xs text-slate-700 bg-white border border-slate-150 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Daily Morning">{getLabel('morning')}</option>
                <option value="Every 2 Days">{getLabel('every2days')}</option>
                <option value="Weekly (Saturday)">{getLabel('weeklySat')}</option>
                <option value="Weekly (Wednesday)">{getLabel('weeklyWed')}</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <input
                id="reminder-activity-input"
                type="text"
                placeholder={getLabel('placeholderActivity')}
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                className="flex-1 text-xs text-slate-700 bg-white border border-slate-150 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                id="reminder-add-btn"
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-lg transition-transform hover:scale-105 cursor-pointer flex items-center justify-center font-bold"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Active alerts deck */}
          <div className="space-y-2">
            {reminders.map((re) => (
              <div 
                key={re.id} 
                onClick={() => toggleReminder(re.id)}
                className={`p-3.5 border rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200 ${
                  re.active 
                    ? 'bg-emerald-50/50 border-emerald-150 text-emerald-950 font-medium scale-[1.002]' 
                    : 'bg-slate-50 border-slate-100 text-slate-450 line-through font-normal opacity-70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-full ${re.active ? 'bg-emerald-500 text-white shadow' : 'bg-slate-200 text-slate-400'}`}>
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="text-xs block font-bold">{re.plant}</span>
                    <span className="text-[10px] block opacity-85">{re.activity}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider bg-white px-2 py-1 rounded-full border border-slate-200/50">
                  <Bell className="w-2.5 h-2.5 text-amber-500" /> {re.day}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
