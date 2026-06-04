import { useState } from 'react';
import { Activity, Sparkles, RefreshCw, Loader2, Sprout, TrendingUp, HelpCircle, Calendar } from 'lucide-react';
import { GrowthPrediction } from '../types';

interface GrowthPredictorProps {}

export default function GrowthPredictor({}: GrowthPredictorProps) {
  const [plantName, setPlantName] = useState('Tecoma/Tulsi');
  const [soilQuality, setSoilQuality] = useState('High organic compost & red sandy loam');
  const [waterSupply, setWaterSupply] = useState('800ml daily drip moistening');
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
        body: JSON.stringify({ plantName, soilQuality, waterSupply, climate })
      });
      if (!res.ok) throw new Error('Prediction API failed');
      const data = await res.json();
      setPrediction(data);
    } catch (err: any) {
      setError('Could not run growth analysis models. Please check your data or try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to generate coordinates for a robust custom SVG line chart
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

  return (
    <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-sm">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">AI Growth Status Predictor</h2>
          <p className="text-xs text-slate-500">Project cultivation roadmaps & yields using climate and soil variables</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Plant Seed Type</label>
            <input
              id="growth-plant-name"
              type="text"
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              placeholder="e.g. Red Cherry Tomato or medicinal Tulsi"
              className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 flex justify-between">
              <span>Soil Texture & Preparation</span>
              <span className="text-[10px] text-emerald-600 font-normal">organic, nitrogen, ph levels</span>
            </label>
            <input
              id="growth-soil-quality"
              type="text"
              value={soilQuality}
              onChange={(e) => setSoilQuality(e.target.value)}
              placeholder="e.g. Garden soil mixed with coco-peat, cow manure, pH 6.5"
              className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Daily Moisture Setup</label>
            <input
              id="growth-water-supply"
              type="text"
              value={waterSupply}
              onChange={(e) => setWaterSupply(e.target.value)}
              placeholder="e.g. Drip irrigation, 250ml morning, 250ml evening"
              className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Thermal / Micro-Climate Context</label>
            <input
              id="growth-climate"
              type="text"
              value={climate}
              onChange={(e) => setClimate(e.target.value)}
              placeholder="e.g. Partial shade, humid balcony, average temperature of 28°C"
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
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-6 py-3 rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center gap-2 group shadow-sm hover:shadow"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Forecasting biometrics...
            </>
          ) : (
            <>
              Predict Growth Roadmap <Sparkles className="w-3.5 h-3.5 text-amber-200 group-hover:rotate-12 transition-transform" />
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs flex items-center gap-2 mb-6 animate-fade-in">
          <Activity className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {prediction ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
          {/* Timeline Stages left */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Sprout className="w-4 h-4 text-emerald-500 animate-pulse" /> Growth Stage Timelines
              </h3>
              
              <div className="relative border-l border-emerald-100 pl-4 ml-2.5 space-y-5 py-2">
                {prediction.stages.map((stg, i) => (
                  <div key={i} className="relative group">
                    {/* Bullet marker */}
                    <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 border border-white group-hover:scale-125 transition-transform shadow-sm" />
                    
                    <div className="bg-slate-50/70 hover:bg-emerald-50/40 p-3.5 rounded-xl border border-slate-100/50 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-emerald-800">{stg.stage}</span>
                        <span className="text-[10px] bg-slate-200/50 px-2 py-0.5 rounded text-slate-600 font-semibold">{stg.durationDays} Days</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{stg.description}</p>
                      
                      {/* Progressive Indicator */}
                      <div className="w-full bg-slate-250 rounded-full h-1 mt-2.5 overflow-hidden">
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

            <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-800">Expected Yield</span>
                <span className="text-xs font-extrabold text-emerald-600">{prediction.expectedYield}</span>
              </div>
              <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-emerald-100/40">
                <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-800">Est. Harvest Window</span>
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> {prediction.estimatedHarvestDate}
                </span>
              </div>
            </div>
          </div>

          {/* Graphical analysis right */}
          <div className="lg:col-span-7 space-y-5">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-500" /> Continuous biometric curves & trends
            </h3>

            {/* Custom interactive Chart */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                <span className="text-xs font-bold text-slate-700 block">Height (cm) over 60 Days</span>
                <div className="flex gap-4">
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" /> Height (cm)
                  </span>
                  <span className="text-[10px] font-bold text-blue-600 flex items-center gap-1">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500" /> Health Rating (% / 10)
                  </span>
                </div>
              </div>

              {/* Chart Stage Canvas */}
              <div className="relative w-full h-64 bg-white rounded-xl border border-slate-150 p-2">
                <svg className="w-full h-full" viewBox="0 0 500 240">
                  {/* Grid Lines */}
                  <line x1="30" y1="30" x2="470" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="30" y1="80" x2="470" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="30" y1="130" x2="470" y2="130" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="30" y1="180" x2="470" y2="180" stroke="#f1f5f9" strokeWidth="1" />
                  
                  {/* Bottom boundary line */}
                  <line x1="30" y1="210" x2="470" y2="210" stroke="#cbd5e1" strokeWidth="1" />
                  {/* Left scale line */}
                  <line x1="30" y1="30" x2="30" y2="210" stroke="#cbd5e1" strokeWidth="1" />
                  
                  {/* Curves */}
                  {prediction.growthChartData && prediction.growthChartData.length > 0 && (
                    <>
                      {/* Height Curve */}
                      <path
                        d={getSvgCoordinates(prediction.growthChartData, 'heightCm', 500, 240)}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      
                      {/* Health Rate Curve */}
                      <path
                        d={getSvgCoordinates(prediction.growthChartData, 'healthScore', 500, 240)}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2.5"
                        strokeDasharray="4 3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Display Data Nodes */}
                      {prediction.growthChartData.map((pt, idx) => {
                        const padding = 30;
                        const chartW = 500 - padding * 2;
                        const chartH = 240 - padding * 2;
                        const maxDay = Math.max(...prediction.growthChartData.map(d => d.day));
                        const maxH = Math.max(...prediction.growthChartData.map(d => d.heightCm));
                        const maxVal = Math.max(...prediction.growthChartData.map(d => d.healthScore));
                        const x = padding + (pt.day / maxDay) * chartW;
                        const hY = 240 - padding - (pt.heightCm / (maxH || 1)) * chartH;
                        
                        return (
                          <g key={idx}>
                            <circle cx={x} cy={hY} r="4" className="fill-emerald-600 hover:r-6 cursor-help transition-all" />
                            {idx % 2 === 0 && (
                              <text x={x} y={hY - 8} textAnchor="middle" className="text-[9px] font-bold fill-emerald-800">
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

              <div className="flex gap-1 items-start mt-3.5 p-2 bg-emerald-50/30 rounded-lg">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-emerald-700 leading-normal">
                  <strong>Analysis Interpretation:</strong> Height curve (solid green) shows estimated plant length. Health score (dotted blue) measures vitality based on chemical compost values. Optimize daily sunshine ratios to steepen growth rates.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-slate-100">
          <Sprout className="w-10 h-10 text-emerald-400 mx-auto opacity-70 mb-3" />
          <h4 className="text-sm font-bold text-slate-700">Ready for Agricultural Analysis</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
            Configure your soil values, plant seeds, and water setups. EcoFriend AI will generate simulated development roadmaps.
          </p>
        </div>
      )}
    </div>
  );
}
