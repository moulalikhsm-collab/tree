import { useState } from 'react';
import { Compass, Sparkles, Sprout, Leaf, Activity, ArrowRight, Loader2, Calendar, Droplets } from 'lucide-react';
import { PlantRecommendation } from '../types';

interface PlantRecommenderProps {
  currentLocation: string;
}

export default function PlantRecommender({ currentLocation }: PlantRecommenderProps) {
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
          pref
        })
      });
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      setRecommendations(data);
    } catch (err: any) {
      setError('Could not invoke AI analysis. Please verify your internet connection or try again.');
    } finally {
      setLoading(false);
    }
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
          <h2 className="text-lg font-bold text-slate-800">AI Plant Recommendation Engine</h2>
          <p className="text-xs text-slate-500">Discover what grows best in your exact context</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Climate Context</label>
          <select
            id="recommender-climate"
            value={climate}
            onChange={(e) => setClimate(e.target.value)}
            className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
          >
            <option value="Mild Tropical">Mild Tropical (Warm, Humid)</option>
            <option value="Hot Arid">Hot Arid (Dry, Sandy, Scant Water)</option>
            <option value="Cold Sub-temperate">Cold Sub-temperate (Hilly, Low Temp)</option>
            <option value="Sub-tropical Plains">Sub-tropical Plains (Variable Seasons)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Garden Space</label>
          <select
            id="recommender-space"
            value={space}
            onChange={(e) => setSpace(e.target.value)}
            className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
          >
            <option value="Balcony pot & containers">Balcony pot & containers</option>
            <option value="Medium Raised garden bed">Medium Raised garden bed</option>
            <option value="Backyard earthen ground">Backyard earthen ground</option>
            <option value="Open rooftop terrace">Open rooftop terrace</option>
            <option value="Indoor window sill alignment">Indoor window sill alignment</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Current Season</label>
          <select
            id="recommender-season"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
          >
            <option value="Summer (Dry Hot)">Summer (Dry Hot)</option>
            <option value="Monsoon (Rainy)">Monsoon (Rainy)</option>
            <option value="Winter (Mild Cold)">Winter (Cold Nights)</option>
            <option value="Spring (Mild Breeze)">Spring (Mild Breeze)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">My Priorities</label>
          <select
            id="recommender-pref"
            value={pref}
            onChange={(e) => setPref(e.target.value)}
            className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
          >
            <option value="Beginners & Low Maintenance">Beginners & Low Maintenance</option>
            <option value="High nutritional vegetables & fruits">High nutrition Veggies & Fruits</option>
            <option value="Healing, Ayurveda & medicinal herbs">Medicinal & Spiritual Herbs</option>
            <option value="Bright flowering & pollinator-friendly">Flowers & Beautiful Petals</option>
            <option value="Shade provider & slow wood trees">Trees & Air purifiers</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <button
          id="recommender-btn"
          onClick={handleRecommend}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-6 py-3 rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center gap-2 group shadow-sm hover:shadow"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Analyzing regional variables...
            </>
          ) : (
            <>
              Generate Recommendations <Sparkles className="w-3.5 h-3.5 text-amber-200 group-hover:scale-125 transition-transform" />
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
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Suitability</span>
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
                    <span className="text-[11px] text-slate-400 font-bold uppercase w-16 pt-0.5">Soil:</span>
                    <div>
                      <span className="text-xs font-semibold text-slate-700 block">{plant.soilType}</span>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{plant.soilPreparation}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-bold uppercase w-16">Fertilizers:</span>
                    <div className="flex flex-wrap gap-1">
                      {plant.fertilizers.map((f, fi) => (
                        <span key={fi} className="text-[10px] bg-slate-200/60 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-[11px] text-slate-400 font-bold uppercase w-16 pt-0.5">Watering:</span>
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
                  <Calendar className="w-3.5 h-3.5" /> Sowing Season
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
          <h4 className="text-sm font-bold text-slate-700">No Recommendations Yet</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
            Configure your climate context, priorities, and gardening space above to get tailor-made suggestions.
          </p>
        </div>
      )}
    </div>
  );
}
