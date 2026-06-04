import { useState } from 'react';
import { Activity, Sparkles, Loader2, Sprout, TrendingUp, HelpCircle, Calendar } from 'lucide-react';
import { GrowthPrediction } from '../types';
import { AppLanguage } from '../App';

interface GrowthPredictorProps {
  language: AppLanguage;
}

export default function GrowthPredictor({ language }: GrowthPredictorProps) {
  const [plantName, setPlantName] = useState('Tecoma/Tulsi');
  const [soilQuality, setSoilQuality] = useState('High organic compost & red sandy loam');
  const [waterSupply, setWaterSupply] = useState('500ml daily drip moistening');
  const [climate, setClimate] = useState('Sunny, high humidity, 24-30°C');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<GrowthPrediction | null>(null);
  const [error, setError] = useState('');

  const handlePredict = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/predict-growth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plantName, soilQuality, waterSupply, climate, language })
      });
      if (!res.ok) throw new Error('Prediction API failed');
      const data = await res.json();
      setPrediction(data);
    } catch (err: any) {
      setError(
        language === 'Telugu' 
          ? 'ఎదుగుదల అంచనా వేయడం కుదరలేదు. దయచేసి ఇంటర్నెట్ కనెక్షన్‌ను సరిచూసుకోండి.' 
          : language === 'Hindi'
            ? 'विकास मॉडल पूर्वानुमान विफल रहा। कृपया नेटवर्क जांचें।'
            : 'Could not run growth analysis models. Please check your data or try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getSvgCoordinates = (data: { day: number; heightCm: number; healthScore: number }[], field: 'heightCm' | 'healthScore', width: number, height: number) => {
    if (data.length === 0) return '';
    const padding = 30;
    const chartW = width - padding * 2;
    const chartH = height - padding * 2;
    
    const maxDay = Math.max(...data.map(d => d.day));
    const maxValue = Math.max(...data.map(d => d[field]));
    
    return data.map((d, index) => {
      const x = padding + (d.day / maxDay) * chartW;
      const val = d[field];
      const y = height - padding - (val / (maxValue || 1)) * chartH;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const getLabel = (key: string) => {
    const translations: Record<string, Record<AppLanguage, string>> = {
      title: {
        English: 'AI Growth Status Predictor',
        Telugu: 'AI మొక్కల ఎదుగుదల అంచనాదారు',
        Hindi: 'AI पौधा विकास दर अनुमानक'
      },
      subtitle: {
        English: 'Project cultivation roadmaps & yields using climate and soil variables',
        Telugu: 'వాతావరణం మరియు మట్టి ఆధారంగా మొక్క ఎదుగుదల రేఖను అంచనా వేయండి',
        Hindi: 'जलवायु और मिट्टी के चरों का उपयोग करके फसल उत्पादन चक्र का पूर्वानुमान लगाएं'
      },
      formPlantSeed: {
        English: 'Plant Seed Type',
        Telugu: 'మొక్క లేదా విత్తనం జాతి',
        Hindi: 'पौधे या बीज का प्रकार'
      },
      formSoil: {
        English: 'Soil Texture & Preparation',
        Telugu: 'మట్టి సంవిధానం & తయారీ',
        Hindi: 'मिट्टी की बनावट और तैयारी'
      },
      formWater: {
        English: 'Daily Moisture Setup',
        Telugu: 'రోజువారీ నీటి క్రమబద్ధీకరణ',
        Hindi: 'दैनिक सिंचाई प्रणाली विवरण'
      },
      formClimate: {
        English: 'Thermal / Micro-Climate Context',
        Telugu: 'స్థానిక ఉష్ణోగ్రత / వాతావరణం',
        Hindi: 'तापीय / सूक्ष्म जलवायु परिवेश'
      },
      btnPredict: {
        English: 'Predict Growth Roadmap',
        Telugu: 'వృద్ధి ఫలితాలు లెక్కించు',
        Hindi: 'विकास चक्र की गणना करें'
      },
      loadingText: {
        English: 'Forecasting biometrics...',
        Telugu: 'బయోమెట్రిక్స్ విశ్లేషిస్తోంది...',
        Hindi: 'बायोमेट्रिक्स और मौसम का आकलन...'
      },
      yieldLabel: {
        English: 'Expected Yield',
        Telugu: 'ఆశించిన పంట దిగుబడి',
        Hindi: 'अनुमानित कुल उपज'
      },
      harvestLabel: {
        English: 'Est. Harvest Window',
        Telugu: 'కోతకు వచ్చే సమయం / విండో',
        Hindi: 'संभावित कटाई अवधि'
      },
      chartTitle: {
        English: 'Continuous biometric curves & trends',
        Telugu: 'నిరంతర వృద్ధి రేఖలు & ట్రెండ్స్',
        Hindi: 'निरंतर बायोमेट्रिक वक्र और प्रगति'
      },
      heightLabel: {
        English: 'Height (cm) over 60 Days',
        Telugu: '60 రోజుల మొక్క పొడవు (cm)',
        Hindi: '60 दिनों में अनुमानित ऊंचाई (सेमी)'
      },
      heightLegend: {
        English: 'Height (cm)',
        Telugu: 'పొడవు (సె.మీ)',
        Hindi: 'ऊंचाई (सेमी)'
      },
      healthLegend: {
        English: 'Health Rating (% / 10)',
        Telugu: 'ఆరోగ్య శాతం',
        Hindi: 'स्वास्थ्य रेटिंग'
      },
      guidanceInterpretation: {
        English: 'Analysis Interpretation: Height curve (solid green) shows estimated plant length. Health score (dotted blue) measures vitality based on compost values. Optimize sunshine to steepen growth rates.',
        Telugu: 'విశ్లేషణ వివరణ: ఆకుపచ్చ వక్రరేఖ మొక్క పొడవును సూచిస్తుంది. డాటెడ్ బ్లూ లైన్ మొక్క ఆరోగ్యాన్ని ప్రతిబింబిస్తుంది. గరిష్ట వృద్ధి కోసం స్థిరమైన ఎండ తగిలేలా చూసుకోండి.',
        Hindi: 'विश्लेषण व्याख्या: ठोस हरी रेखा पौधे की अनुमानित ऊंचाई दर्शाती है। डेश्ड नीली रेखा स्वास्थ्य सूचकांक दर्शाती है। धूप का स्तर प्रगति में सुधार के लिए आवश्यक है।'
      },
      readyTitle: {
        English: 'Ready for Agricultural Analysis',
        Telugu: 'వ్యవసాయ వృద్ధి విశ్లేషణకు సిద్ధంగా ఉంది',
        Hindi: 'कृषि विकास विश्लेषण के लिए तैयार'
      },
      readySub: {
        English: 'Configure soil, seed types, and moisture setups. Our AI models will instantly project estimated biomass development cycles.',
        Telugu: 'మొక్క పేరు, మట్టి నాణ్యత, పోసే నీటి వివరాలను ఎంటర్ చేసి జెమిని ఎదుగుదల రిపోర్ట్ సృష్టించండి.',
        Hindi: 'ऊपर मिट्टी, बीज और सिंचाई विवरण दर्ज करें। जेमिनी एआई मॉडल विकास समयसीमा प्रस्तुत करेगा।'
      },
      stagesTimeline: {
        English: 'Growth Stage Timelines',
        Telugu: 'ఎదుగుదల దశల కాలక్రమం',
        Hindi: 'विकास चरणों की समयरेखा'
      }
    };
    return translations[key]?.[language] || translations[key]?.['English'] || key;
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-sm">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">{getLabel('title')}</h2>
          <p className="text-xs text-slate-500">{getLabel('subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{getLabel('formPlantSeed')}</label>
            <input
              id="growth-plant-name"
              type="text"
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              placeholder="e.g. Tomato or Holy Tulsi"
              className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 flex justify-between">
              <span>{getLabel('formSoil')}</span>
            </label>
            <input
              id="growth-soil-quality"
              type="text"
              value={soilQuality}
              onChange={(e) => setSoilQuality(e.target.value)}
              placeholder="e.g. Sandy clay mixed with organic vermicompost, pH 6.8"
              className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{getLabel('formWater')}</label>
            <input
              id="growth-water-supply"
              type="text"
              value={waterSupply}
              onChange={(e) => setWaterSupply(e.target.value)}
              placeholder="e.g. 500ml slow drip daily at dawn"
              className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{getLabel('formClimate')}</label>
            <input
              id="growth-climate"
              type="text"
              value={climate}
              onChange={(e) => setClimate(e.target.value)}
              placeholder="e.g. High humidity plains, average of 25-29°C"
              className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <button
          id="growth-predict-btn"
          onClick={handlePredict}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center gap-2 group shadow-sm hover:shadow"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> {getLabel('loadingText')}
            </>
          ) : (
            <>
              {getLabel('btnPredict')}{' '}
              <Sparkles className="w-3.5 h-3.5 text-amber-200 group-hover:rotate-12 transition-transform" />
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

      {prediction ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
          {/* Timeline Stages */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Sprout className="w-4 h-4 text-emerald-500 animate-pulse" /> {getLabel('stagesTimeline')}
              </h3>
              
              <div className="relative border-l border-emerald-100 pl-4 ml-2.5 space-y-5 py-2">
                {prediction.stages.map((stg, i) => (
                  <div key={i} className="relative group">
                    <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 border border-white group-hover:scale-125 transition-transform shadow-sm" />
                    
                    <div className="bg-slate-50/70 hover:bg-emerald-50/40 p-3.5 rounded-xl border border-slate-100/50 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-emerald-800">{stg.stage}</span>
                        <span className="text-[10px] bg-slate-200/50 px-2 py-0.5 rounded text-slate-600 font-semibold">{stg.durationDays} Days</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{stg.description}</p>
                      
                      <div className="w-full bg-slate-200 h-1 mt-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${stg.progressPercentage}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 space-y-3 shadow-inner">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] uppercase tracking-widest font-bold text-emerald-800">{getLabel('yieldLabel')}</span>
                <span className="text-xs font-extrabold text-emerald-600">{prediction.expectedYield}</span>
              </div>
              <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-emerald-100/40">
                <span className="text-[11px] uppercase tracking-widest font-bold text-emerald-800">{getLabel('harvestLabel')}</span>
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> {prediction.estimatedHarvestDate}
                </span>
              </div>
            </div>
          </div>

          {/* Chart visualizers */}
          <div className="lg:col-span-7 space-y-5">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-500" /> {getLabel('chartTitle')}
            </h3>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                <span className="text-xs font-bold text-slate-700 block">{getLabel('heightLabel')}</span>
                <div className="flex gap-4 text-[10px] font-bold">
                  <span className="text-emerald-600 flex items-center gap-1">
                    <span className="inline-block w-2.5 h-2.5 bg-emerald-500 rounded-full" /> {getLabel('heightLegend')}
                  </span>
                  <span className="text-blue-600 flex items-center gap-1">
                    <span className="inline-block w-2.5 h-2.5 bg-blue-500 rounded-full" /> {getLabel('healthLegend')}
                  </span>
                </div>
              </div>

              <div className="relative w-full h-64 bg-white rounded-xl border border-slate-150 p-2">
                <svg className="w-full h-full" viewBox="0 0 500 240">
                  <line x1="30" y1="30" x2="470" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="30" y1="80" x2="470" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="30" y1="130" x2="470" y2="130" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="30" y1="180" x2="470" y2="180" stroke="#f1f5f9" strokeWidth="1" />
                  
                  <line x1="30" y1="210" x2="470" y2="210" stroke="#cbd5e1" strokeWidth="1" />
                  <line x1="30" y1="30" x2="30" y2="210" stroke="#cbd5e1" strokeWidth="1" />
                  
                  {prediction.growthChartData && prediction.growthChartData.length > 0 && (
                    <>
                      <path
                        d={getSvgCoordinates(prediction.growthChartData, 'heightCm', 500, 240)}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      
                      <path
                        d={getSvgCoordinates(prediction.growthChartData, 'healthScore', 500, 240)}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2.5"
                        strokeDasharray="4 3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {prediction.growthChartData.map((pt, idx) => {
                        const padding = 30;
                        const chartW = 500 - padding * 2;
                        const chartH = 240 - padding * 2;
                        const maxDay = Math.max(...prediction.growthChartData.map(d => d.day));
                        const maxH = Math.max(...prediction.growthChartData.map(d => d.heightCm));
                        const x = padding + (pt.day / maxDay) * chartW;
                        const hY = 240 - padding - (pt.heightCm / (maxH || 1)) * chartH;
                        
                        return (
                          <g key={idx}>
                            <circle cx={x} cy={hY} r="4" className="fill-emerald-600 cursor-crosshair hover:r-6 transition-all" />
                            {idx % 2 === 0 && (
                              <text x={x} y={hY - 8} textAnchor="middle" className="text-[9px] font-extrabold fill-emerald-800">
                                {pt.heightCm}cm
                              </text>
                            )}
                            <text x={x} y="222" textAnchor="middle" className="text-[9px] font-bold fill-slate-400">
                              Day {pt.day}
                            </text>
                          </g>
                        );
                      })}
                    </>
                  )}
                </svg>
              </div>

              <div className="flex gap-1.5 items-start mt-3.5 p-3.5 bg-emerald-50/40 rounded-xl border border-emerald-100/30">
                <HelpCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-emerald-800 leading-normal text-justify">
                  {getLabel('guidanceInterpretation')}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-slate-100">
          <Sprout className="w-10 h-10 text-emerald-400 mx-auto opacity-70 mb-3" />
          <h4 className="text-sm font-bold text-slate-700">{getLabel('readyTitle')}</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
            {getLabel('readySub')}
          </p>
        </div>
      )}
    </div>
  );
}
