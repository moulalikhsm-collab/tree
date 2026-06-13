import React, { useState, useEffect } from 'react';
import { Sprout, Award, HelpCircle, Heart, Plus, Calendar, AlertCircle, Check, Clock, Bell, Trash2, History, Sparkles } from 'lucide-react';
import { PlantTracker } from '../types';
import { AppLanguage } from '../App';
import { dbService, UserProfile } from '../lib/dbService';

interface DashboardOverviewProps {
  onSowTrigger: (plantName: string) => void;
  language: AppLanguage;
  user: UserProfile;
}

interface PlantReminder {
  id: string;
  plantId: string;
  plantName: string;
  type: 'watering' | 'fertilizing';
  intervalHours: number;
  lastTriggeredTime: string; // ISO string
  nextTriggerTime: string; // ISO string
  growthStageContext: string;
  amountOrDose: string;
  active: boolean;
}

interface CareLog {
  id: string;
  plantName: string;
  type: 'watering' | 'fertilizing';
  amountOrDose: string;
  timestamp: string;
  growthStage: string;
}

const schedulerTexts = {
  activeReminders: {
    English: 'Scheduled Smart Reminders',
    Telugu: 'షెడ్యూల్డ్ స్మార్ట్ అలారాలు & రిమైండర్లు',
    Hindi: 'निर्धारित स्मार्ट अलार्म और रिमाइंडर'
  },
  activeRemindersSub: {
    English: 'Watering & fertilizer timers mapped to growth phases',
    Telugu: 'మొక్కల దశలకు అనుగుణంగా నీరు మరియు ఎరువుల సమయ పట్టిక',
    Hindi: 'विकास चरणों के अनुसार सिंचाई और खाद का समय'
  },
  addCustomReminder: {
    English: 'Add Custom Reminder',
    Telugu: 'రిమైండర్ జోడించు',
    Hindi: 'नया रिमाइंडर जोड़ें'
  },
  typeWater: {
    English: 'Watering 💧',
    Telugu: 'నీరు పోయుట 💧',
    Hindi: 'सिंचाई करें 💧'
  },
  typeFertilizer: {
    English: 'Fertilizing 🍂',
    Telugu: 'ఎరువులు వేయుట 🍂',
    Hindi: 'खाद डालें 🍂'
  },
  potSelector: {
    English: 'Select Virtual Pot',
    Telugu: 'కుండీ ఎంచుకోండి',
    Hindi: 'गमला चुनें'
  },
  intervalLabel: {
    English: 'Repeat Every',
    Telugu: 'పునరావృతం చేయి',
    Hindi: 'पुनरावृत्ति अंतराल'
  },
  amountLabel: {
    English: 'Dosage / Amount',
    Telugu: 'పరిమాణం / మోతాదు',
    Hindi: 'मात्रा / खुराक'
  },
  stageRecommendation: {
    English: 'Growth Stage Recommendation',
    Telugu: 'దశల ఆధారిత సిఫార్సు',
    Hindi: 'विकास चरण आधारित सुझाव'
  },
  recommendedTitle: {
    English: 'Stage-Based Recommended Schedules',
    Telugu: 'వృద్ధి దశ ఆధారిత సిఫార్సులు',
    Hindi: 'विकास चरण आधारित वैज्ञानिक सिफ़ारिशें'
  },
  recommendedSub: {
    English: 'Automatically load organic watering and compost setups for your specific sprouts',
    Telugu: 'మొక్క యొక్క ప్రస్తుత దశకు తగిన నీటి మరియు ఎరువుల పట్టికను ఒకే క్లిక్‌తో సెట్ చేసుకోండి',
    Hindi: 'अपने पौधे के वर्तमान विकास चरण के लिए उपयुक्त खाद एवं पानी की अनुसूची को एक क्लिक में सक्रिय करें'
  },
  btnActivate: {
    English: 'Activate Schedule',
    Telugu: 'ఈ షెడ్యూల్ సక్రియం చేయి',
    Hindi: 'अनुसूची चालू करें'
  },
  notificationCenter: {
    English: 'EcoFriend Alert Center',
    Telugu: 'ఈకోఫ్రెండ్ అలర్ట్ సెంటర్',
    Hindi: 'ईकोफ्रेंड अलर्ट केंद्र'
  },
  notificationCenterSub: {
    English: 'Real-time actions triggered for active garden cups',
    Telugu: 'తీసుకోవలసిన తక్షణ చర్యలు',
    Hindi: 'कार्रवाई के लिए लम्बित तत्काल अलर्ट'
  },
  noNotifications: {
    English: 'All plant reminders are running on track! No pending care alerts.',
    Telugu: 'అన్ని మొక్కల అలారాలు సురక్షితంగా నడుస్తున్నాయి! తక్షణ పనులు ఏవీ లేవు.',
    Hindi: 'सभी पौधे सुरक्षित हैं! कोई भी तत्काल सिंचाई या खाद का कार्य लम्बित नहीं है।'
  },
  completeAction: {
    English: 'Done! Mark Completed & Reset',
    Telugu: 'పూర్తయింది! రీసెట్ చేయి',
    Hindi: 'पूर्ण! रीसेट करें'
  },
  simulateTime: {
    English: 'Simulate Time (+12 Hours)',
    Telugu: 'సమయాన్ని వేగవంతం చేయి (+12 గంటలు)',
    Hindi: 'समय को आगे बढ़ाएं (+12 घंटे)'
  },
  timeRemaining: {
    English: 'Due in',
    Telugu: 'సమయం ఉంది',
    Hindi: 'लम्बित समय'
  },
  dueNow: {
    English: 'DUE NOW 🚨',
    Telugu: 'ఇప్పుడే చేయాలి 🚨',
    Hindi: 'तत्काल आवश्यक 🚨'
  },
  frequencyHours: {
    English: 'Hours',
    Telugu: 'గంటలు',
    Hindi: 'घंटे'
  },
  historyLog: {
    English: 'Recent Completed Actions',
    Telugu: 'ఇటీవల పూర్తి చేసిన పనులు',
    Hindi: 'हाल ही में पूरे किए गए कार्य'
  },
  historyLogEmpty: {
    English: 'Your recent care log is empty. Perform due tasks to see history!',
    Telugu: 'సేవా చరిత్ర ఖాళీగా ఉంది. తదుపరి పనులను పూర్తి చేసి ఇక్కడ చూడండి!',
    Hindi: 'हाल की गतिविधियों का इतिहास खाली है। नियत कार्यों को पूरा करें!'
  },
  successToast: {
    English: 'Reminder successfully added!',
    Telugu: 'రిమైండర్ విజయవంతంగా జోడించబడింది!',
    Hindi: 'रिमाइंडर सफलतापूर्वक जोड़ दिया गया है!'
  },
  taskToast: {
    English: 'Plant care completed! Health score boosted (+5%) 🌟',
    Telugu: 'మొక్క సంరక్షణ విజయవంతంగా పూర్తయింది! ఆరోగ్యం పెరిగింది (+5%) 🌟',
    Hindi: 'पौधे की देखभाल पूरी हुई! स्वास्थ्य सूचकांक बढ़ा (+5%) 🌟'
  }
};

const careTipsTexts = {
  English: {
    sectionTitle: "Botanical Checkups & Plant Care Tips",
    sectionSub: "How to tell if your pot specimens are flourishing or need immediate attention",
    healthyTitle: "Signs of Healthy Plants (Vibrant & Flourishing)",
    distressTitle: "Symptoms of Plant Distress (Needs Immediate Attention)",
    healthyList: [
      {
        title: "Vibrant Foliage",
        desc: "Bright, deep green or species-specific rich leaf colors without limpness."
      },
      {
        title: "Strong Stems",
        desc: "Stiff, upright growth layers with robust stem structural integrity."
      },
      {
        title: "Active Buds",
        desc: "Periodic appearance of fresh shoots, new glossy leaf buds, or blossoms."
      },
      {
        title: "Healthy Roots",
        desc: "White or light-tan firm roots with an earthy fresh smell."
      }
    ],
    distressList: [
      {
        title: "Yellowing Leaves",
        desc: "Often signals overwatering, poor drainage, or nutrient deficiencies."
      },
      {
        title: "Brown Tips/Margins",
        desc: "Indicates underwatering, dry room air, or chemical-burn toxicity."
      },
      {
        title: "Limp, Drooping Canopy",
        desc: "Caused by severe dehydration or early onset root rot disease."
      },
      {
        title: "Webbing or Spots",
        desc: "Signs of active Spider Mites, insect infestations, or scale pests."
      }
    ]
  },
  Telugu: {
    sectionTitle: "మొక్కల సంరక్షణ చిట్కాలు & ఆరోగ్య పరీక్ష",
    sectionSub: "మీ కుండీల్లోని మొక్కలు ఆరోగ్యంగా ఉన్నాయో లేదా ప్రత్యేక శ్రద్ధ అవసరమో ఎలా గుర్తించాలి",
    healthyTitle: "ఆరోగ్యకరమైన మొక్కల లక్షణాలు (నిత్యనూతనం & సక్రియం)",
    distressTitle: "మొక్కల నిస్సత్తువ లక్షణాలు (తక్షణ శ్రద్ధ అవసరం)",
    healthyList: [
      {
        title: "ప్రకాశవంతమైన ఆకులు",
        desc: "మొక్కకు సరిపోయే ముదురు ఆకుపచ్చ రంగు మరియు దృఢత్వం."
      },
      {
        title: "బలమైన కొమ్మలు",
        desc: "నిటారుగా నిలబడే దృఢమైన వ్యవస్థ మరియు స్థిరమైన కొమ్మలు."
      },
      {
        title: "కొత్త కొత్త రెమ్మలు",
        desc: "నిరంతరం వచ్చే పచ్చని మొలకలు, వేగవంతమైన మొగ్గలు."
      },
      {
        title: "దృఢమైన వేర్లు",
        desc: "తెలుపు లేదా మట్టి రంగులో ఉండే ఆరోగ్యకరమైన మరియు గట్టి వేర్లు."
      }
    ],
    distressList: [
      {
        title: "పసుపు రంగు ఆకులు",
        desc: "ఎక్కువ నీరు పోయడం, సరిపోని పోషకాలు లేదా పేలవమైన డ్రైనేజ్ కారణం కావచ్చు."
      },
      {
        title: "ఎండిపోయిన అంచులు",
        desc: "అపసవ్యమైన సూర్యరశ్మి, తక్కువ తేమ లేదా లవణాల అధిక క్రియ."
      },
      {
        title: "వంగిపోయిన కొమ్మలు",
        desc: "తీవ్రమైన ఎండ దెబ్బ లేదా వేర్ల కుళ్ళు సమస్య వల్ల సంభవించవచ్చు."
      },
      {
        title: "బూజు లేదా మచ్చలు",
        desc: "పురుగులు లేదా కీటకాల దాడి మరియు బూజు తెగుళ్లకు సంకేతం."
      }
    ]
  },
  Hindi: {
    sectionTitle: "पौधों की देखभाल के नुस्खे और स्वास्थ्य परीक्षण",
    sectionSub: "जानें कि आपके गमलों के पौधे फल-फूल रहे हैं या उन्हें तुरंत विशेष देखभाल की आवश्यकता है",
    healthyTitle: "स्वस्थ पौधों के लक्षण (ऊर्जावान और जीवंत)",
    distressTitle: "पौधों के संकट के लक्षण (तुरंत ध्यान देने की आवश्यकता)",
    healthyList: [
      {
        title: "चमकदार पत्तियां",
        desc: "चमकदार, गहरा हरा या प्रजाति-विशिष्ट समृद्ध पत्ती का रंग जो दृढ़ हो।"
      },
      {
        title: "मजबूत तने",
        desc: "सीधे खड़े रहने वाले तने और उत्कृष्ट संरचनात्मक मजबूती।"
      },
      {
        title: "सक्रिय अंकुरण",
        desc: "नए पत्तों की कोपलें, कलियों और फूलों का नियमित रूप से आना।"
      },
      {
        title: "स्वस्थ जड़ें",
        desc: "सफेद या हल्की भूरी, गंधमुक्त और मजबूत जड़ें।"
      }
    ],
    distressList: [
      {
        title: "पत्तियों का पीला पड़ना",
        desc: "यह अक्सर अत्यधिक पानी, खराब जल निकासी या पोषक तत्वों की कमी का संकेत है।"
      },
      {
        title: "सूखे या भूरे किनारे",
        desc: "कम पानी देना, हवा में रूखापन या रासायनिक खाद की अधिकता।"
      },
      {
        title: "मुरझाई हुई कोमल शाखाएं",
        desc: "गंभीर निर्जलीकरण या जड़ों के सड़ने (रूट रॉट) के शुरुआती लक्षण।"
      },
      {
        title: "मकड़ी के जाले या धब्बे",
        desc: "सक्रिय मकड़ी के कीटों (माइट्स), एफिड्स या फंगल संक्रमण का संकेत।"
      }
    ]
  }
};

export default function DashboardOverview({ onSowTrigger, language, user }: DashboardOverviewProps) {
  // Collection of virtual student pots
  const [pots, setPots] = useState<PlantTracker[]>([]);
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

  // Scheduled reminders & time travel simulation states
  const getRelativeDateISO = (offsetHours: number) => {
    return new Date(Date.now() + offsetHours * 60 * 60 * 1000).toISOString();
  };

  const [reminders, setReminders] = useState<PlantReminder[]>([
    {
      id: 'rem-1',
      plantId: '1',
      plantName: 'Holy Tulsi Mix',
      type: 'watering',
      intervalHours: 48,
      lastTriggeredTime: getRelativeDateISO(-12),
      nextTriggerTime: getRelativeDateISO(36),
      growthStageContext: 'Active Vegetative Canopy',
      amountOrDose: '500ml slow drip',
      active: true
    },
    {
      id: 'rem-2',
      plantId: '1',
      plantName: 'Holy Tulsi Mix',
      type: 'fertilizing',
      intervalHours: 168,
      lastTriggeredTime: getRelativeDateISO(-96),
      nextTriggerTime: getRelativeDateISO(72),
      growthStageContext: 'Active Vegetative Canopy',
      amountOrDose: '20g compost tea dilution',
      active: true
    },
    {
      id: 'rem-3',
      plantId: '2',
      plantName: 'Cherry Tomato Pot',
      type: 'watering',
      intervalHours: 24,
      lastTriggeredTime: getRelativeDateISO(-2),
      nextTriggerTime: getRelativeDateISO(22),
      growthStageContext: 'Sprouting seedlings',
      amountOrDose: '250ml slow spray mist',
      active: true
    },
    {
      id: 'rem-4',
      plantId: '3',
      plantName: 'English Peppermint',
      type: 'watering',
      intervalHours: 12,
      lastTriggeredTime: getRelativeDateISO(-11),
      nextTriggerTime: getRelativeDateISO(1), // due in 1 hour
      growthStageContext: 'Sowing seed stage',
      amountOrDose: '150ml light misty spray',
      active: true
    }
  ]);

  const [careLogs, setCareLogs] = useState<CareLog[]>([]);

  // DB Sync Effect for Sowed Seeds (Pots)
  useEffect(() => {
    if (!user || !user.uid) return;

    const unsubscribe = dbService.listenSeeds(user.uid, (seedsList) => {
      if (seedsList.length === 0) {
        // Pre-populate classical starter organic containers on registration
        const prePopulate = async () => {
          try {
            await dbService.createSeed(user.uid, 'Holy Tulsi Mix', 'Medicinal Herb', 'Daily morning moisten', 'Mild warm weather', 'growing');
            await dbService.createSeed(user.uid, 'Cherry Tomato Pot', 'Vegetable', '250ml water scheduled', 'Sunny', 'germinated');
            await dbService.createSeed(user.uid, 'English Peppermint', 'Medicinal Herb', 'Keep soil moist', 'Cool shade', 'germinated');
          } catch (e) {
            console.error("Failed to seed initial organic database pots:", e);
          }
        };
        prePopulate();
      } else {
        const mapped: PlantTracker[] = seedsList.map(s => {
          let stageLabel = 'Sowing seed stage';
          if (s.status === 'growing') stageLabel = 'Active Vegetative Canopy';
          else if (s.status === 'ready-to-harvest') stageLabel = 'Buds & Flowering stage';
          else if (s.status === 'harvested') stageLabel = 'Harvest Completed!';
          
          return {
            id: s.seedId,
            name: s.plantName,
            type: s.soilQuality || 'Vegetable',
            datePlanted: s.dateSowed.split('T')[0],
            stage: stageLabel,
            wateringReminder: s.waterSupply || 'Daily moistening scheduled',
            healthScore: s.status === 'growing' ? 92 : s.status === 'ready-to-harvest' ? 96 : s.status === 'harvested' ? 100 : 88
          };
        });
        setPots(mapped);
      }
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // DB Sync Effect for Care/Activity Logs
  useEffect(() => {
    if (!user || !user.uid) return;

    const unsubscribe = dbService.listenLogs(user.uid, (logsList) => {
      if (logsList.length === 0) return;
      const mappedLogs: CareLog[] = logsList.map(l => ({
        id: l.logId,
        plantName: l.title,
        type: l.description?.includes('Watering') || l.description?.includes('నీరు') ? 'watering' : 'fertilizing',
        amountOrDose: l.description || 'Routine care applied',
        timestamp: new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        growthStage: 'Active Garden care'
      }));
      setCareLogs(mappedLogs);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showAddReminderForm, setShowAddReminderForm] = useState(false);

  // Custom reminder form fields
  const [formPlantId, setFormPlantId] = useState('');
  const [formType, setFormType] = useState<'watering' | 'fertilizing'>('watering');
  const [formIntervalHours, setFormIntervalHours] = useState(24);
  const [formAmount, setFormAmount] = useState('250ml water');

  // Background ticker so that countdown timers refresh in real-time
  const [ticker, setTicker] = useState(0);
  useEffect(() => {
    const stream = setInterval(() => {
      setTicker(t => t + 1);
    }, 10000);
    return () => clearInterval(stream);
  }, []);

  // Autofill defaults when custom form type flips
  useEffect(() => {
    if (formType === 'watering') {
      setFormAmount('250ml mist watering');
    } else {
      setFormAmount('15g compost NPK dilution');
    }
  }, [formType]);

  // Default dropdown selection to first available pot
  useEffect(() => {
    if (pots.length > 0 && !formPlantId) {
      setFormPlantId(pots[0].id);
    }
  }, [pots, formPlantId]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  const shiftSimulationTime = (hours: number) => {
    const shiftMs = hours * 60 * 60 * 1000;
    setReminders(prev => prev.map(rem => ({
      ...rem,
      nextTriggerTime: new Date(new Date(rem.nextTriggerTime).getTime() - shiftMs).toISOString()
    })));
    triggerToast(
      language === 'Telugu' 
        ? `సమయం ${hours} గంటలు ముందుకు వెళ్ళింది! అలారాలు తనిఖీ చేయండి.` 
        : language === 'Hindi'
          ? `समय ${hours} घंटे आगे बढ़ गया है! अलार्म समय जांचें।`
          : `Simulated ${hours} hours into the future! Check due alarms.`
    );
  };

  const getDueReminders = () => {
    return reminders.filter(r => r.active && new Date(r.nextTriggerTime).getTime() <= Date.now());
  };

  const formatTimeLeft = (nextTriggerISO: string) => {
    const diffMs = new Date(nextTriggerISO).getTime() - Date.now();
    if (diffMs <= 0) {
      return null; // Due now!
    }
    const diffMin = Math.ceil(diffMs / (1000 * 60));
    if (diffMin < 60) {
      if (language === 'Telugu') return `${diffMin} నిమిషాల్లో`;
      if (language === 'Hindi') return `${diffMin} मिनट में`;
      return `${diffMin} mins`;
    }
    const diffHours = Math.floor(diffMin / 60);
    const remainingMins = diffMin % 60;
    if (diffHours < 24) {
      if (language === 'Telugu') return `${diffHours} గం, ${remainingMins} నిమి`;
      if (language === 'Hindi') return `${diffHours} घंटे, ${remainingMins} मिनट`;
      return `${diffHours}h ${remainingMins}m`;
    }
    const diffDays = Math.floor(diffHours / 24);
    const remainingHours = diffHours % 24;
    if (language === 'Telugu') return `${diffDays} రోజు, ${remainingHours} గం`;
    if (language === 'Hindi') return `${diffDays} दिन, ${remainingHours} घंटे`;
    return `${diffDays}d ${remainingHours}h`;
  };

  const getElapsedPercentage = (nextTriggerISO: string, intervalHours: number) => {
    const diffMs = new Date(nextTriggerISO).getTime() - Date.now();
    if (diffMs <= 0) return 100;
    const intervalMs = intervalHours * 60 * 60 * 1000;
    const elapsedMs = intervalMs - diffMs;
    const pct = Math.round((elapsedMs / intervalMs) * 100);
    return Math.max(0, Math.min(100, pct));
  };

  const handleCompleteReminder = (reminderId: string) => {
    const rem = reminders.find(r => r.id === reminderId);
    if (!rem) return;

    // Reschedule
    setReminders(prev => prev.map(r => {
      if (r.id === reminderId) {
        return {
          ...r,
          lastTriggeredTime: new Date().toISOString(),
          nextTriggerTime: getRelativeDateISO(r.intervalHours)
        };
      }
      return r;
    }));

    // Reward virtual plant's health score
    setPots(prevPots => prevPots.map(p => {
      if (p.id === rem.plantId) {
        return { ...p, healthScore: Math.min(100, p.healthScore + 5) };
      }
      return p;
    }));

    // Record Log entry in database ledger
    dbService.createLog(
      user.uid,
      rem.plantName,
      `[${rem.type === 'watering' ? 'Watering 💧' : 'Fertilizing 🍂'}] Applied ${rem.amountOrDose} at ${rem.growthStageContext}`
    ).catch(e => console.error("Logged care failed:", e));

    triggerToast(
      language === 'Telugu'
        ? schedulerTexts.taskToast.Telugu
        : language === 'Hindi'
          ? schedulerTexts.taskToast.Hindi
          : schedulerTexts.taskToast.English
    );
  };

  const handleDeleteReminder = (reminderId: string) => {
    setReminders(prev => prev.filter(r => r.id !== reminderId));
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    const targetPot = pots.find(p => p.id === formPlantId);
    if (!targetPot) return;

    const newReminder: PlantReminder = {
      id: String(Date.now()),
      plantId: formPlantId,
      plantName: targetPot.name,
      type: formType,
      intervalHours: Number(formIntervalHours),
      lastTriggeredTime: new Date().toISOString(),
      nextTriggerTime: getRelativeDateISO(Number(formIntervalHours)),
      growthStageContext: targetPot.stage,
      amountOrDose: formAmount,
      active: true
    };

    setReminders(prev => [...prev, newReminder]);
    setShowAddReminderForm(false);
    triggerToast(
      language === 'Telugu'
        ? schedulerTexts.successToast.Telugu
        : language === 'Hindi'
          ? schedulerTexts.successToast.Hindi
          : schedulerTexts.successToast.English
    );
  };

  const getStagePresets = (pot: PlantTracker) => {
    const isEnglish = language === 'English';
    const isTelugu = language === 'Telugu';
    const isHindi = language === 'Hindi';

    const stageLower = pot.stage.toLowerCase();
    const isSowing = stageLower.includes('sow') || stageLower.includes('విత్తిన') || stageLower.includes('बुवाई');
    const isSprout = stageLower.includes('sprout') || stageLower.includes('మొలక') || stageLower.includes('अंकुर');

    if (isSowing) {
      return [
        {
          type: 'watering' as const,
          intervalHours: 12,
          amountOrDose: isTelugu ? '150ml లైట్ స్ప్రే' : isHindi ? '150 मिली स्प्रे सिंचाई' : '150ml light mist spray',
          reason: isTelugu ? 'విత్తనాలు కదలకుండా తేమ ఇస్తుంది' : isHindi ? 'बीज विस्थापन रोकने के लिए हल्की नमी' : 'Misty spray prevents seed displacement'
        }
      ];
    } else if (isSprout) {
      return [
        {
          type: 'watering' as const,
          intervalHours: 24,
          amountOrDose: isTelugu ? '250ml తడి నీరు' : isHindi ? '250 मिली मध्यम सिंचाई' : '250ml slow soak',
          reason: isTelugu ? 'వేర్ల ఎదుగుదలకు తోడ్పడుతుంది' : isHindi ? 'जड़ों के प्रसार में सहायक' : 'Moist roots support early expansion'
        },
        {
          type: 'fertilizing' as const,
          intervalHours: 168,
          amountOrDose: isTelugu ? '5g కంపోస్ట్ టీ ద్రావణం' : isHindi ? '5 ग्राम जैविक खाद पानी' : '5g dynamic compost tea',
          reason: isTelugu ? 'లేత వేర్లకు సరిపోయే పోషకాలు' : isHindi ? 'कोमल तनों के विकास के लिए नाइट्रोजन' : 'Organic nitrogen for early sprouts'
        }
      ];
    } else {
      return [
        {
          type: 'watering' as const,
          intervalHours: 48,
          amountOrDose: isTelugu ? '500ml కుండీ లోపలి వరకు' : isHindi ? '500 मिली गहरी सिंचाई' : '500ml deep soil soak',
          reason: isTelugu ? 'లోతైన వేర్లకు నీరు చేరుతుంది' : isHindi ? 'जड़ों की गहराई तक सिंचाई आवश्यक है' : 'Capillary soil saturation'
        },
        {
          type: 'fertilizing' as const,
          intervalHours: 336,
          amountOrDose: isTelugu ? '25g సేంద్రీయ వర్మికంపోస్ట్' : isHindi ? '25 ग्राम केचुआ खाद एनपीके' : '25g vermicompost mix',
          reason: isTelugu ? 'మొక్కకు పటిష్టమైన కొమ్మలు ఇస్తుంది' : isHindi ? 'मजबूत शाखाओं और गहरे रंग के लिए उपयुक्त' : 'Balanced micro-nutrients for canopy support'
        }
      ];
    }
  };

  const handleApplyPreset = (pot: PlantTracker, preset: { type: 'watering' | 'fertilizing'; intervalHours: number; amountOrDose: string }) => {
    // Check if duplicate exists for this pot and action type
    const updatedReminders = reminders.filter(r => !(r.plantId === pot.id && r.type === preset.type));

    const newReminder: PlantReminder = {
      id: String(Date.now()),
      plantId: pot.id,
      plantName: pot.name,
      type: preset.type,
      intervalHours: preset.intervalHours,
      lastTriggeredTime: new Date().toISOString(),
      nextTriggerTime: getRelativeDateISO(preset.intervalHours),
      growthStageContext: pot.stage,
      amountOrDose: preset.amountOrDose,
      active: true
    };

    setReminders([...updatedReminders, newReminder]);
    triggerToast(
      language === 'Telugu'
        ? schedulerTexts.successToast.Telugu
        : language === 'Hindi'
          ? schedulerTexts.successToast.Hindi
          : schedulerTexts.successToast.English
    );
  };

  const handleSow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlantName.trim()) return;

    try {
      await dbService.createSeed(
        user.uid,
        newPlantName,
        newPlantType,
        language === 'Telugu' ? 'రోజూ తడి ఉంచాలి' : language === 'Hindi' ? 'रोजाना सिंचाई करें' : 'Moisten soil daily',
        'Balanced room sun',
        'germinated'
      );
      
      // Save activity log in database ledger
      await dbService.createLog(
        user.uid,
        newPlantName,
        `Sowed Organic Seed: ${newPlantName} (${newPlantType}) successfully planted into container database.`
      );

      onSowTrigger(newPlantName);
      setNewPlantName('');
      setShowSowForm(false);
    } catch (e) {
      console.error("Failed to sow seed to database:", e);
    }
  };

  const handleDeletePot = async (potId: string) => {
    try {
      const targetPot = pots.find(p => p.id === potId);
      if (!targetPot) return;
      await dbService.deleteSeed(potId, user.uid);
      await dbService.createLog(
        user.uid,
        targetPot.name,
        `Removed container: ${targetPot.name} deleted from active database tracking.`
      );
    } catch (e) {
      console.error("Failed to delete pot:", e);
    }
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
      English: 'Welcome to EcoFriend. Sow virtual seeds below to monitor development timelines, run Leaf Diagnostics via computer vision, or setup smart watering reminders to log organic compost actions.',
      Telugu: 'సేంద్రీయ వ్యవసాయ బడి కి స్వాగతం! మట్టి ని వదులు చేయండి, మీ తోట గురించి జెమిని సహాయంతో సిఫార్సులు పొందండి మరియు నీరు, ఎరువుల కోసం స్మార్ట్ అలారాలను సెట్ చేసుకోండి.',
      Hindi: 'ईकोफ्रेंड में आपका स्वागत है। विकास की समयसीमा की निगरानी के लिए नीचे आभासी बीज बोएं, पत्ता निदान चलाएं, या समय पर सिंचाई व जैविक खाद के लिए स्मार्ट अलार्म सेट करें!'
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
      Telugu: 'రోజువారీ వ్యవసాయ పనులను పూర్తి చేయడం ద్వారా మీ మొక్కల రేటింగ్ పెరుగుతుంది. నీటి అలారాలను పూర్తి చేయడం మొక్కల ఆరోగ్యాన్ని నిరంతరం కాపాడుతుంది.',
      Hindi: 'दैनिक कार्यों को पूर्ण करने से पौधों के स्वास्थ्य सूचकांक में सुधार होता है। सही समय पर सिंचाई और जैविक स्प्रे करने से अतिरिक्त अंक अर्जित करें।'
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

  const getSchedulerText = (key: keyof typeof schedulerTexts) => {
    return schedulerTexts[key]?.[language] || schedulerTexts[key]?.['English'] || key;
  };

  const activeDue = getDueReminders();
  const currentTips = careTipsTexts[language] || careTipsTexts.English;

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
          <span className="text-xl font-extrabold text-teal-600 block mt-1">
            {reminders.filter(r => r.active).length}
          </span>
          <span className="text-[9px] text-teal-700 font-bold block mt-0.5">
            {activeDue.length} {language === 'Telugu' ? 'ప్రస్తుత అలారాలు' : language === 'Hindi' ? 'सक्रिय चेतावनी' : 'due now'}
          </span>
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
            {pots.map((p) => {
              const activeSchedulesCount = reminders.filter(r => r.plantId === p.id && r.active).length;
              return (
                <div key={p.id} className="bg-white border border-slate-150 rounded-2xl p-4 hover:border-emerald-250 transition-all duration-200 flex flex-col justify-between group shadow-sm relative">
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

                      <div className="flex justify-between items-center text-slate-600 pt-0.5">
                        <span className="flex items-center gap-1 font-medium text-slate-400">
                          ⏰ {language === 'Telugu' ? 'రిమైండర్ క్రమం' : language === 'Hindi' ? 'सक्रिय रिमाइंडर्स' : 'Alarms Set'}
                        </span>
                        <span className="font-bold text-teal-700 text-xs bg-teal-50 px-1.5 py-0.5 rounded-md">
                          {activeSchedulesCount} active
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-100/50 flex justify-between items-center">
                    <button
                      onClick={() => handleDeletePot(p.id)}
                      className="text-[10px] text-slate-400 hover:text-red-500 font-semibold flex items-center gap-1 transition-colors hover:bg-red-55 px-1.5 py-0.5 rounded cursor-pointer"
                      title="Remove Pot"
                    >
                      <Trash2 className="w-3 h-3 text-slate-400 hover:text-red-500" /> {language === 'Telugu' ? 'తొలగించు' : language === 'Hindi' ? 'हटाएं' : 'Remove'}
                    </button>
                    <span className="text-[9px] bg-emerald-50 text-emerald-800 font-extrabold px-2 py-0.5 rounded uppercase">
                      {language === 'Telugu' ? 'నిరంతర నిఘా' : language === 'Hindi' ? 'लाइव मॉनिटर' : 'Live tracking'}
                    </span>
                  </div>
                </div>
              );
            })}
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

      {/* ⏰ Plant Scheduled Reminders Center */}
      <div id="plant-care-scheduler" className="bg-white border border-slate-150 rounded-3xl p-6 shadow-sm space-y-6">
        
        {/* Section Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-500 text-white rounded-2xl shadow-sm animate-pulse-slow">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-800 tracking-tight">
                {getSchedulerText('activeReminders')}
              </h2>
              <p className="text-xs text-slate-500">
                {getSchedulerText('activeRemindersSub')}
              </p>
            </div>
          </div>

          {/* Time Accelerator simulator */}
          <div className="flex items-center gap-2">
            <button
              id="scheduler-simulate-time-btn"
              onClick={() => shiftSimulationTime(12)}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-emerald-150/80 transition-all duration-150 flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {getSchedulerText('simulateTime')}
            </button>

            <button
              id="scheduler-toggle-form-btn"
              onClick={() => setShowAddReminderForm(!showAddReminderForm)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              {getSchedulerText('addCustomReminder')}
            </button>
          </div>
        </div>

        {/* Live Active Action Notification Hub */}
        {activeDue.length > 0 && (
          <div id="scheduler-alert-hub" className="bg-red-50 border border-red-200/60 rounded-2xl p-4 space-y-3 animate-pulse-slow">
            <h4 className="text-xs font-bold text-red-800 uppercase tracking-widest flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-red-600 animate-bounce" />
              {getSchedulerText('notificationCenter')} ({activeDue.length})
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeDue.map((due) => (
                <div key={due.id} className="bg-white border border-red-100 rounded-xl p-3 flex flex-col justify-between shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-bl">
                    {getSchedulerText('dueNow')}
                  </div>
                  
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-red-600 block">
                      {due.type === 'watering' ? '💧 Irrigation Alert' : '🍂 Nutrition Alert'}
                    </span>
                    <h5 className="text-xs font-black text-slate-800 mt-1">{due.plantName}</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {due.type === 'watering' ? 'Requires irrigation:' : 'Requires fertilizer:'}{' '}
                      <strong className="text-slate-800">{due.amountOrDose}</strong>
                    </p>
                    <span className="inline-block mt-2 text-[9px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded">
                      Phase: {due.growthStageContext}
                    </span>
                  </div>

                  <button
                    id={`complete-due-btn-${due.id}`}
                    onClick={() => handleCompleteReminder(due.id)}
                    className="w-full bg-red-600 hover:bg-emerald-600 text-white font-bold text-[10px] uppercase py-2 rounded-lg mt-3 transition-colors duration-150 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                    {getSchedulerText('completeAction')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom schedule creator form */}
        {showAddReminderForm && (
          <form onSubmit={handleAddReminder} className="bg-slate-50/70 border border-slate-150 p-5 rounded-2xl space-y-4 animate-fade-in">
            <span className="text-xs font-black text-slate-800 uppercase tracking-widest block">
              🔧 {getSchedulerText('addCustomReminder')}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">{getSchedulerText('potSelector')}</label>
                <select
                  id="reminder-plant-select"
                  value={formPlantId}
                  onChange={(e) => setFormPlantId(e.target.value)}
                  className="w-full text-xs text-slate-700 bg-white border border-slate-150 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  {pots.map(pot => (
                    <option key={pot.id} value={pot.id}>{pot.name} ({pot.stage})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Action Type</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormType('watering')}
                    className={`flex-1 font-bold text-xs py-2 rounded-lg border text-center transition-all ${
                      formType === 'watering'
                        ? 'bg-teal-50 border-teal-500 text-teal-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {getSchedulerText('typeWater')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormType('fertilizing')}
                    className={`flex-1 font-bold text-xs py-2 rounded-lg border text-center transition-all ${
                      formType === 'fertilizing'
                        ? 'bg-teal-50 border-teal-500 text-teal-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {getSchedulerText('typeFertilizer')}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">{getSchedulerText('intervalLabel')}</label>
                <select
                  id="reminder-interval-select"
                  value={formIntervalHours}
                  onChange={(e) => setFormIntervalHours(Number(e.target.value))}
                  className="w-full text-xs text-slate-700 bg-white border border-slate-150 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="6">6 {getSchedulerText('frequencyHours')}</option>
                  <option value="12">12 {getSchedulerText('frequencyHours')}</option>
                  <option value="24">24 {getSchedulerText('frequencyHours')} (1 Day)</option>
                  <option value="48">48 {getSchedulerText('frequencyHours')} (2 Days)</option>
                  <option value="72">72 {getSchedulerText('frequencyHours')} (3 Days)</option>
                  <option value="168">168 {getSchedulerText('frequencyHours')} (1 Week)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">{getSchedulerText('amountLabel')}</label>
                <input
                  id="reminder-amount-input"
                  type="text"
                  required
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  className="w-full text-xs text-slate-700 bg-white border border-slate-150 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowAddReminderForm(false)}
                className="text-slate-500 hover:bg-slate-100 text-xs px-3.5 py-2 rounded-lg font-bold cursor-pointer"
              >
                {getDText('formCancel')}
              </button>
              <button
                id="reminder-submit-btn"
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs px-5 py-2 rounded-lg font-bold transition-transform hover:scale-[1.02] cursor-pointer"
              >
                {getSchedulerText('addCustomReminder')}
              </button>
            </div>
          </form>
        )}

        {/* Reminders List & Smart Presets Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Active Schedules left (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <h4 className="text-xs font-extrabold text-slate-450 uppercase tracking-widest block">
              📅 {language === 'Telugu' ? 'ప్రస్తుత సక్రియ సమయాలు' : language === 'Hindi' ? 'सक्रिय अलार्म सूची' : 'Active Alarm Timers'} ({reminders.length})
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reminders.map((rem) => {
                const timeLeft = formatTimeLeft(rem.nextTriggerTime);
                const progressPct = getElapsedPercentage(rem.nextTriggerTime, rem.intervalHours);
                const isDue = timeLeft === null;

                return (
                  <div key={rem.id} className="bg-white border border-slate-150 rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:border-teal-200 transition-all group relative">
                    {/* Corner Delete Action */}
                    <button
                      onClick={() => handleDeleteReminder(rem.id)}
                      className="absolute top-3.5 right-3.5 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove Schedule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          rem.type === 'watering' 
                            ? 'bg-blue-50 text-blue-700 border border-blue-100/40' 
                            : 'bg-amber-50 text-amber-700 border border-amber-100/40'
                        }`}>
                          {rem.type === 'watering' ? '💧 Water' : '🍂 Feed'}
                        </span>
                        <span className="text-[9px] text-slate-400 font-semibold truncate max-w-[120px]">
                          Every {rem.intervalHours}h
                        </span>
                      </div>

                      <h5 className="text-xs font-extrabold text-slate-800">{rem.plantName}</h5>
                      <p className="text-[10px] text-slate-500 leading-normal font-mono text-slate-650 mt-1">
                        👉 {rem.amountOrDose}
                      </p>

                      {/* Visual timer countdown */}
                      <div className="mt-4 space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-slate-400">Time to action:</span>
                          <span className={isDue ? 'text-red-600 animate-pulse font-extrabold' : 'text-teal-600 font-extrabold'}>
                            {isDue ? getSchedulerText('dueNow') : timeLeft}
                          </span>
                        </div>

                        {/* Custom visual progress bar */}
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 rounded-full ${
                              isDue ? 'bg-red-500' : rem.type === 'watering' ? 'bg-blue-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2.5">
                      <span className="text-[9px] text-slate-400 truncate max-w-[110px]">
                        Stage: {rem.growthStageContext}
                      </span>
                      
                      <button
                        onClick={() => handleCompleteReminder(rem.id)}
                        className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                          isDue 
                            ? 'bg-red-600 text-white hover:bg-emerald-600 shadow-sm'
                            : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        {isDue ? getSchedulerText('completeAction') : 'Done'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Smart stage suggestions right (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-extrabold text-slate-450 uppercase tracking-widest block">
              💡 {getSchedulerText('recommendedTitle')}
            </h4>

            {/* Smart suggested cards parsed for each pot */}
            <div className="bg-gradient-to-br from-emerald-50/50 via-teal-50/20 to-white border border-teal-100 rounded-2xl p-4 space-y-4">
              <p className="text-[11px] text-slate-500 leading-normal">
                {getSchedulerText('recommendedSub')}
              </p>

              <div className="space-y-3">
                {pots.map((pot) => {
                  const presets = getStagePresets(pot);
                  return (
                    <div key={pot.id} className="border-t border-teal-100/60 pt-3 first:border-0 first:pt-0">
                      <span className="text-[10px] bg-teal-600 text-white font-extrabold px-1.5 py-0.5 rounded-md">
                        {pot.name}
                      </span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">Stage: {pot.stage}</span>
                      
                      <div className="space-y-2 mt-1.5">
                        {presets.map((pr, index) => {
                          const reminderExists = reminders.some(r => r.plantId === pot.id && r.type === pr.type && r.active);
                          return (
                            <div key={index} className="bg-white/80 border border-slate-100 p-2.5 rounded-xl flex items-start justify-between gap-1.5">
                              <div>
                                <div className="flex items-center gap-1">
                                  <span className="text-[9px] font-extrabold text-slate-700">
                                    {pr.type === 'watering' ? '💧 Irrigation' : '🍂 Compost Feed'}{' '}
                                    ({pr.intervalHours}h)
                                  </span>
                                  {reminderExists && (
                                    <span className="text-[8px] bg-emerald-100 text-emerald-800 font-extrabold px-1 rounded">
                                      Active
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-600 italic font-medium mt-0.5">Dose: {pr.amountOrDose}</p>
                                <p className="text-[9px] text-slate-400 mt-0.5 leading-tight">{pr.reason}</p>
                              </div>

                              <button
                                onClick={() => handleApplyPreset(pot, pr)}
                                className="bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-[9px] font-bold px-2 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap"
                              >
                                {reminderExists ? 'Reset Alert' : 'Load preset'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* Recent completed action history list */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-450 uppercase tracking-widest flex items-center gap-1 mb-3">
            <History className="w-4.5 h-4.5 text-slate-400" />
            {getSchedulerText('historyLog')}
          </h4>

          {careLogs.length > 0 ? (
            <div className="bg-slate-50/60 rounded-xl border border-slate-100 p-3.5 space-y-2 max-h-40 overflow-y-auto">
              {careLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between gap-3 text-xs border-b border-white/80 pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-500">✅</span>
                    <div>
                      <span className="font-extrabold text-slate-755">{log.plantName}</span>
                      <span className="text-[10px] text-slate-400 ml-2">
                        ({log.type === 'watering' ? 'Irrigation Complete' : 'Organic feed added'} - {log.amountOrDose})
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 font-bold block">{log.timestamp}</span>
                    <span className="text-[8px] bg-slate-200/50 px-1 py-0.5 rounded text-slate-500 font-semibold">{log.growthStage}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-450 italic">
              {getSchedulerText('historyLogEmpty')}
            </p>
          )}
        </div>

      </div>

      {/* 🌿 Plant Care Tips Section */}
      <div id="plant-care-tips-section" className="bg-white border border-slate-150 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500 text-white rounded-2xl shadow-sm">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-800 tracking-tight">
                {currentTips.sectionTitle}
              </h2>
              <p className="text-xs text-slate-500">
                {currentTips.sectionSub}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Healthy Column */}
          <div id="healthy-indicators-col" className="bg-emerald-50/10 border border-emerald-100/60 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-black text-emerald-800 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {currentTips.healthyTitle}
            </h3>

            <div className="space-y-3">
              {currentTips.healthyList.map((item, idx) => (
                <div key={idx} className="bg-white border border-emerald-50 rounded-xl p-3.5 shadow-xs hover:border-emerald-200 transition-colors">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 p-1 bg-emerald-50 text-emerald-600 rounded-lg flex-shrink-0">
                      <Heart className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Distress Column */}
          <div id="distress-indicators-col" className="bg-red-50/10 border border-red-100/60 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-black text-red-800 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              {currentTips.distressTitle}
            </h3>

            <div className="space-y-3">
              {currentTips.distressList.map((item, idx) => (
                <div key={idx} className="bg-white border border-red-50 rounded-xl p-3.5 shadow-xs hover:border-red-200 transition-colors">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 p-1 bg-red-50 text-red-650 rounded-lg flex-shrink-0">
                      <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slide-in student floating toast alerts */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-emerald-500 text-white text-xs font-bold px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-2 animate-slide-in z-50">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
          <span>{toastMsg}</span>
        </div>
      )}

    </div>
  );
}
