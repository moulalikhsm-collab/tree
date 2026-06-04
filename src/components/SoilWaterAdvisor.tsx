import React, { useState } from 'react';
import { Droplet, Sprout, Calendar, Plus, Check, Bell, Info } from 'lucide-react';

interface SoilWaterAdvisorProps {}

export default function SoilWaterAdvisor({}: SoilWaterAdvisorProps) {
  // Simple state to log custom care reminders
  const [reminders, setReminders] = useState([
    { id: 1, plant: 'Tulsi', activity: 'Spray Neem Oil on bottom leaves', day: 'Saturday morning', active: true },
    { id: 2, plant: 'Cherry Tomato Pot', activity: 'Water 400ml + Biochar dose', day: 'Daily 8:00 AM', active: true },
    { id: 3, plant: 'Monstera Air Purifier', activity: 'Wipe dust off foliage', day: 'Every Wednesday', active: false },
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
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Soil Preparation & Composition</h3>
              <p className="text-[11px] text-slate-500">Perfect organic recipe ratio for students & beginners</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
            <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">Recommended Soil Ratio Mixer</span>
            
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-600">Red Loam Garden Soil</span>
                <span className="text-emerald-600">40% / Base substrate</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[40%]" />
              </div>

              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-600">Organic Vermicompost / Cow Manure</span>
                <span className="text-emerald-600">30% / Slow-release nutrient</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[30%]" />
              </div>

              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-600">Coco-Peat or Sphagnum Moss</span>
                <span className="text-sky-600">20% / Moisture Retention</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-sky-400 h-full w-[20%]" />
              </div>

              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-600">Perlite / Small Vermiculite</span>
                <span className="text-amber-600">10% / Soil Drainage Aeration</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full w-[10%]" />
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50/40 border border-emerald-100 rounded-xl space-y-2">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest block">Organic Fertilizers Guidance & pH Rules</span>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              - <strong>Nitrogen Boosters:</strong> Add diluted tea liquor or organic blood meal once a month.<br />
              - <strong>Strong Roots (Phosphorus):</strong> Bone meal powder or organic rock phosphate works great.<br />
              - <strong>pH Regulation:</strong> Most garden herbs enjoy mildly acidic soil (6.0 - 6.8 pH). If too acidic, add a pinch of wood ash.
            </p>
          </div>
        </div>

        {/* Reminders calendar right */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <Calendar className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Smart Care Calendar & Reminders</h3>
              <p className="text-[11px] text-slate-500">Track task alarms and watering routines</p>
            </div>
          </div>

          <form onSubmit={addReminder} className="bg-slate-50 p-4 border border-slate-100 rounded-xl space-y-3">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">Set care reminder</span>
            <div className="grid grid-cols-2 gap-3">
              <input
                id="reminder-plant-input"
                type="text"
                placeholder="Plant e.g. Mint"
                value={newPlant}
                onChange={(e) => setNewPlant(e.target.value)}
                className="text-xs text-slate-700 bg-white border border-slate-150 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <select
                id="reminder-day-select"
                value={newDay}
                onChange={(e) => setNewDay(e.target.value)}
                className="text-xs text-slate-700 bg-white border border-slate-150 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Daily Morning">Daily Morning</option>
                <option value="Every 2 Days">Every 2 Days</option>
                <option value="Weekly (Saturday)">Weekly (Saturday)</option>
                <option value="Weekly (Wednesday)">Weekly (Wednesday)</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <input
                id="reminder-activity-input"
                type="text"
                placeholder="Activity e.g. Add compost mix"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                className="flex-1 text-xs text-slate-700 bg-white border border-slate-150 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                id="reminder-add-btn"
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg transition-transform hover:scale-105 cursor-pointer"
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
                className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200 ${
                  re.active 
                    ? 'bg-emerald-50/50 border-emerald-150 text-emerald-950 font-medium' 
                    : 'bg-slate-50 border-slate-100 text-slate-400 line-through font-normal'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-full ${re.active ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="text-xs block font-bold">{re.plant}</span>
                    <span className="text-[10px] block opacity-80">{re.activity}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider bg-white/70 px-2 py-0.5 rounded-full border border-slate-100">
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
