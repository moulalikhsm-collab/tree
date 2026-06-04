import { useState } from 'react';
import { Compass, Sparkles, Sprout, Leaf, Activity, Loader2, Calendar, Droplets } from 'lucide-react';
import { PlantRecommendation } from '../types';
import { AppLanguage } from '../App';

interface PlantRecommenderProps {
  currentLocation: string;
  language: AppLanguage;
}

export default function PlantRecommender({ currentLocation, language }: PlantRecommenderProps) {
  const [climate, setClimate] = useState('Mild Tropical');
  const [space, setSpace] = useState('Balcony pot & containers');
  const [season, setSeason] = useState('Monsoon (Rainy)');
  const [pref, setPref] = useState('Beginners & Low Maintenance');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<PlantRecommendation[]>([]);
  const [error, setError] = useState('');

  const handleRecommend = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: currentLocation,
          climate,
          space,
          season,
          pref,
          language // Pass the current active language to Gemini / fallback handlers
        })
      });
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      setRecommendations(data);
    } catch (err: any) {
      setError(
        language === 'Telugu' 
          ? 'AI విశ్లేషణను పొందలేకపోయాము. దయచేసి ఇంటర్నెట్ సరిచూసుకొని మళ్ళీ ప్రయత్నించండి.' 
          : language === 'Hindi'
            ? 'AI विश्लेषण शुरू नहीं किया जा सका। कृपया इंटरनेट कनेक्शन की जांच करें।'
            : 'Could not invoke AI analysis. Please verify your internet connection or try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedLabel = (key: string) => {
    const translations: Record<string, Record<AppLanguage, string>> = {
      title: {
        English: 'AI Plant Recommendation Engine',
        Telugu: 'AI మొక్కల సిఫార్సు ఇంజిన్',
        Hindi: 'AI पौधा सिफारिश इंजन'
      },
      subtitle: {
        English: 'Discover what grows best in your exact context',
        Telugu: 'మీ స్థానిక వాతావరణం, స్థలానికి తగిన ఉత్తమమైన మొక్కలను కనుగొనండి',
        Hindi: 'जानें कि आपके परिवेश और स्थान के लिए कौन से पौधे सबसे उत्तम हैं'
      },
      climateLabel: {
        English: 'Climate Context',
        Telugu: 'వాతావరణ సందర్భం',
        Hindi: 'जलवायु संदर्भ'
      },
      gardenSpace: {
        English: 'Garden Space',
        Telugu: 'తోట స్థలం',
        Hindi: 'बगीचे की जगह'
      },
      season: {
        English: 'Current Season',
        Telugu: 'ప్రస్తుత కాలం',
        Hindi: 'वर्तमान मौसम'
      },
      priority: {
        English: 'My Priorities',
        Telugu: 'నా ప్రాధాన్యతలు',
        Hindi: 'मेरी प्राथमिकताएं'
      },
      submitBtn: {
        English: 'Generate Recommendations',
        Telugu: 'సిఫార్సులు పొందండి',
        Hindi: 'सिफारिशें प्राप्त करें'
      },
      loadingText: {
        English: 'Analyzing regional variables...',
        Telugu: 'ప్రాంతీయ వాతావరణాన్ని విశ్లేషిస్తోంది...',
        Hindi: 'क्षेत्रीय चरों का विश्लेषण किया जा रहा है...'
      },
      suitability: {
        English: 'Suitability',
        Telugu: 'అనుకూలత',
        Hindi: 'उपयुक्तता'
      },
      soil: {
        English: 'Soil',
        Telugu: 'మట్టి సంవిధానం',
        Hindi: 'मिट्टी का प्रकार'
      },
      fertilizers: {
        English: 'Fertilizers',
        Telugu: 'సేంద్రీయ ఎరువులు',
        Hindi: 'जैविक खाद'
      },
      watering: {
        English: 'Watering',
        Telugu: 'నీటి తడులు',
        Hindi: 'सिंचाई गाइड'
      },
      sowingSeason: {
        English: 'Sowing Season',
        Telugu: 'విత్తే కాలం',
        Hindi: 'बुवाई का मौसम'
      }
    };
    return translations[key]?.[language] || translations[key]?.['English'] || key;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vegetable': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'fruit': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'flower': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'medicinal': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-sm">
          <Compass className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">{getLocalizedLabel('title')}</h2>
          <p className="text-xs text-slate-500">{getLocalizedLabel('subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Climate */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
            {getLocalizedLabel('climateLabel')}
          </label>
          <select
            id="recommender-climate"
            value={climate}
            onChange={(e) => setClimate(e.target.value)}
            className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
          >
            <option value="Mild Tropical">
              {language === 'Telugu' ? 'ఉష్ణమండల వాతావరణం (వేడి, తేమ)' : language === 'Hindi' ? 'उष्णकटिबंधीय (गर्म और आर्द्र)' : 'Mild Tropical (Warm, Humid)'}
            </option>
            <option value="Hot Arid">
              {language === 'Telugu' ? 'ఎడారి వాతావరణం (పొడి, తక్కువ నీరు)' : language === 'Hindi' ? 'गर्म शुष्क (सूखा और रेतीला)' : 'Hot Arid (Dry, Sandy, Scant Water)'}
            </option>
            <option value="Cold Sub-temperate">
              {language === 'Telugu' ? 'శీతల హిల్లీ వాతావరణం (చల్లని)' : language === 'Hindi' ? 'ठंडा पहाड़ी (न्यूनतम तापमान)' : 'Cold Sub-temperate (Hilly, Low Temp)'}
            </option>
            <option value="Sub-tropical Plains">
              {language === 'Telugu' ? 'సమశీతోష్ణ మైదానాలు' : language === 'Hindi' ? 'उपोष्णकटिबंधीय मैदानी क्षेत्र' : 'Sub-tropical Plains (Variable Seasons)'}
            </option>
          </select>
        </div>

        {/* Space */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
            {getLocalizedLabel('gardenSpace')}
          </label>
          <select
            id="recommender-space"
            value={space}
            onChange={(e) => setSpace(e.target.value)}
            className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
          >
            <option value="Balcony pot & containers">
              {language === 'Telugu' ? 'బాల్కనీ కుండీలు & కంటైనర్లు' : language === 'Hindi' ? 'बालकनी गमले और कंटेनर' : 'Balcony pot & containers'}
            </option>
            <option value="Medium Raised garden bed">
              {language === 'Telugu' ? 'మధ్యస్థ పెంచిన బెడ్ తోట' : language === 'Hindi' ? 'उभरा हुआ क्यारी बेड' : 'Medium Raised garden bed'}
            </option>
            <option value="Backyard earthen ground">
              {language === 'Telugu' ? 'వెనుక పెరడు నేల' : language === 'Hindi' ? 'घर का पिछला आंगन' : 'Backyard earthen ground'}
            </option>
            <option value="Open rooftop terrace">
              {language === 'Telugu' ? 'ఇంటి పైకప్పు (మిద్దె తోట)' : language === 'Hindi' ? 'खुली छत (टेरेस गार्डन)' : 'Open rooftop terrace'}
            </option>
            <option value="Indoor window sill alignment">
              {language === 'Telugu' ? 'ఇండోర్ కిటికీ అంచు పై' : language === 'Hindi' ? 'घर के अंदर खिड़की का किनारा' : 'Indoor window sill alignment'}
            </option>
          </select>
        </div>

        {/* Season */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
            {getLocalizedLabel('season')}
          </label>
          <select
            id="recommender-season"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
          >
            <option value="Summer (Dry Hot)">
              {language === 'Telugu' ? 'ఎండాకాలం (వేడి, పొడి)' : language === 'Hindi' ? 'गर्मी (शुष्क और गर्म)' : 'Summer (Dry Hot)'}
            </option>
            <option value="Monsoon (Rainy)">
              {language === 'Telugu' ? 'వర్షాకాలం (వానలు)' : language === 'Hindi' ? 'मानसून (वर्षा ऋतु)' : 'Monsoon (Rainy)'}
            </option>
            <option value="Winter (Mild Cold)">
              {language === 'Telugu' ? 'చలికాలం (చల్లని రాత్రులు)' : language === 'Hindi' ? 'सर्दी (ठंडी रातें)' : 'Winter (Cold Nights)'}
            </option>
            <option value="Spring (Mild Breeze)">
              {language === 'Telugu' ? 'వసంత కాలం' : language === 'Hindi' ? 'वसंत ऋतु (सुहावनी हवा)' : 'Spring (Mild Breeze)'}
            </option>
          </select>
        </div>

        {/* Priorities */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
            {getLocalizedLabel('priority')}
          </label>
          <select
            id="recommender-pref"
            value={pref}
            onChange={(e) => setPref(e.target.value)}
            className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
          >
            <option value="Beginners & Low Maintenance">
              {language === 'Telugu' ? 'ప్రారంభకులకు (సులభమైన సంరక్షణ)' : language === 'Hindi' ? 'शुरुआती और कम रखरखाव' : 'Beginners & Low Maintenance'}
            </option>
            <option value="High nutritional vegetables & fruits">
              {language === 'Telugu' ? 'పోషక విలువల కూరగాయలు & పండ్లు' : language === 'Hindi' ? 'उच्च पोषण वाली सब्जियां और फल' : 'High nutrition Veggies & Fruits'}
            </option>
            <option value="Healing, Ayurveda & medicinal herbs">
              {language === 'Telugu' ? 'ఆయుర్వేద & ఔషధ రకాల మొక్కలు' : language === 'Hindi' ? 'आयुर्वेदिक एवं औषधीय जड़ी-बूटियां' : 'Medicinal & Spiritual Herbs'}
            </option>
            <option value="Bright flowering & pollinator-friendly">
              {language === 'Telugu' ? 'రంగురంగుల పూల మొక్కలు' : language === 'Hindi' ? 'सुंदर फूलों वाले पौधे' : 'Flowers & Beautiful Petals'}
            </option>
            <option value="Shade provider & slow wood trees">
              {language === 'Telugu' ? 'నీడ మరియు పచ్చని గాలినిచ్చేవి' : language === 'Hindi' ? 'छायादार और वायु शोधक पेड़' : 'Trees & Air purifiers'}
            </option>
          </select>
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <button
          id="recommender-btn"
          onClick={handleRecommend}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center gap-2 group shadow-sm hover:shadow"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> {getLocalizedLabel('loadingText')}
            </>
          ) : (
            <>
              {getLocalizedLabel('submitBtn')} <Sparkles className="w-3.5 h-3.5 text-amber-200 group-hover:scale-125 transition-transform" />
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs flex items-center gap-2 mb-6">
          <Activity className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          {recommendations.map((plant, index) => (
            <div key={index} className="bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-white rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between group shadow-sm">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-full ${getTypeColor(plant.type)}`}>
                    {plant.type}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{getLocalizedLabel('suitability')}</span>
                    <span className="text-xs font-extrabold text-emerald-600 block">
                      {plant.suitabilityScore}%
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-1.5 group-hover:text-emerald-700 transition-colors">
                  <Sprout className="w-4.5 h-4.5 text-emerald-500" /> {plant.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 line-clamp-3 leading-relaxed">
                  {plant.suitabilityReason}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-200/60 space-y-2.5">
                  <div className="flex items-start gap-2">
                    <span className="text-[11px] text-slate-400 font-bold uppercase w-16 pt-0.5">{getLocalizedLabel('soil')}:</span>
                    <div>
                      <span className="text-xs font-semibold text-slate-700 block">{plant.soilType}</span>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{plant.soilPreparation}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-bold uppercase w-16">{getLocalizedLabel('fertilizers')}:</span>
                    <div className="flex flex-wrap gap-1">
                      {plant.fertilizers.map((f, fi) => (
                        <span key={fi} className="text-[10px] bg-slate-200/60 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-[11px] text-slate-400 font-bold uppercase w-16 pt-0.5">{getLocalizedLabel('watering')}:</span>
                    <div>
                      <span className="text-xs font-bold text-sky-600 flex items-center gap-0.5">
                        <Droplets className="w-3.5 h-3.5 text-sky-500" />
                        {plant.wateringDailyMl} ml / day ({plant.wateringWeeklyLiters} L / week)
                      </span>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{plant.wateringInstructions}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-[11px] text-slate-400 font-bold uppercase w-16 pt-0.5">Climate:</span>
                    <div className="bg-emerald-50/50 p-1.5 rounded-lg border border-emerald-100/40 w-full">
                      <span className="text-[10px] text-emerald-800 font-bold block">{plant.climateSuitability.tempRange} | {plant.climateSuitability.humidityRange}</span>
                      {plant.climateSuitability.warning && (
                        <span className="text-[9px] text-amber-600 font-medium block mt-0.5">⚠️ {plant.climateSuitability.warning}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100/60 flex items-center justify-between text-[10px]">
                <span className="text-slate-400 font-bold uppercase flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {getLocalizedLabel('sowingSeason')}
                </span>
                <span className="font-semibold text-slate-700 bg-white border border-slate-100 px-2 py-0.5 rounded-full">
                  {plant.sowingSeason}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-slate-100">
          <Leaf className="w-10 h-10 text-emerald-400 mx-auto opacity-70 mb-3" />
          <h4 className="text-sm font-bold text-slate-700">
            {language === 'Telugu' ? 'సిఫార్సులు ఇంకా రాలేదు' : language === 'Hindi' ? 'अभी तक कोई सिफारिश नहीं है' : 'No Recommendations Yet'}
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
            {language === 'Telugu' 
              ? 'మీ ఇంట్లోని ప్రాధాన్యతలు, వాతావరణం పైన ఎంచుకొని సరియైన సేంద్రీయ సిఫార్సులను పొందండి.' 
              : language === 'Hindi' 
                ? 'अनुकूलित सुझाव प्राप्त करने के लिए ऊपर अपने पर्यावरण चर, प्राथमिकताओं और स्थान का चयन करें।' 
                : 'Configure your climate context, priorities, and gardening space above to get tailor-made suggestions.'}
          </p>
        </div>
      )}
    </div>
  );
}
