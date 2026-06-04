import React, { useState } from 'react';
import { Sprout, Award, HelpCircle, Heart, Plus, Calendar, AlertCircle, Check } from 'lucide-react';
import { PlantTracker } from '../types';

interface DashboardOverviewProps {
  onSowTrigger: (plantName: string) => void;
}

export default function DashboardOverview({ onSowTrigger }: DashboardOverviewProps) {
  // Collection of virtual student pots
  const [pots, setPots] = useState<PlantTracker[]>([
    { id: '1', name: 'Holy Tulsi Mix', type: 'Medicinal Herb', datePlanted: '2026-05-15', stage: 'Vegetative growth', wateringReminder: 'Daily morning moisten', healthScore: 92 },
    { id: '2', name: 'Cherry Tomato Pot', type: 'Vegetable', datePlanted: '2026-05-28', stage: 'Sprouting seedlings', wateringReminder: '250ml water scheduled', healthScore: 88 },
    { id: '3', name: 'English Peppermint', type: 'Medicinal Herb', datePlanted: '2026-06-01', stage: 'Sowing seed stage', wateringReminder: 'Keep soil moist', healthScore: 95 }
  ]);
  const [showSowForm, setShowSowForm] = useState(false);
  const [newPlantName, setNewPlantName] = useState('');
  const [newPlantType, setNewPlantType] = useState('Vegetable');

  // Interactive daily student checklist
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Inspect underside of leaves for Spider Mite webs', done: true },
    { id: 2, text: 'Check if top 1-inch of container soil is fully dry before watering', done: false },
    { id: 3, text: 'Spray organic home rice-water or compost tea dilution', done: false },
    { id: 4, text: 'Reposition young seedlings to receive 4-6 hours of partial warm sun', done: true }
  ]);

  const handleSow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlantName.trim()) return;

    const newPot: PlantTracker = {
      id: String(Date.now()),
      name: newPlantName,
      type: newPlantType,
      datePlanted: new Date().toISOString().split('T')[0],
      stage: 'Sowing seed stage',
      wateringReminder: 'Moisten soil daily',
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

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-100/90 via-emerald-100/50 to-white border border-emerald-200 rounded-3xl p-6 relative overflow-hidden">
        <div className="max-w-xl relative z-10 space-y-3.5">
          <span className="text-[10px] font-bold uppercase bg-emerald-600 text-white px-2.5 py-1 rounded-full tracking-wider">
            Green Student Badge Activated
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold text-emerald-950 font-sans tracking-tight">
            Nurture your plant companion with AI, the organic way!
          </h2>
          <p className="text-xs text-emerald-900 leading-relaxed max-w-md">
            Welcome to EcoFriend. Sow virtual seeds below to monitor development timelines, run Leaf Diagnostics via computer vision, or chat with bot advisors in English, తెలుగు or हिंदी!
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
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Active Specimen</span>
          <span className="text-xl font-extrabold text-emerald-800 block mt-1">{pots.length}</span>
          <span className="text-[9px] text-slate-450 font-medium block mt-0.5">Sown Containers</span>
        </div>
        <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Health Average</span>
          <span className="text-xl font-extrabold text-emerald-600 block mt-1">
            {(pots.reduce((sum, p) => sum + p.healthScore, 0) / pots.length).toFixed(0)}%
          </span>
          <span className="text-[9px] text-slate-450 font-medium block mt-0.5">Lush Vitality Score</span>
        </div>
        <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Achievements Met</span>
          <span className="text-xl font-extrabold text-amber-500 block mt-1">
            {tasks.filter(t => t.done).length} / {tasks.length}
          </span>
          <span className="text-[9px] text-slate-450 font-medium block mt-0.5">Daily Chores</span>
        </div>
        <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Reminders Active</span>
          <span className="text-xl font-extrabold text-teal-600 block mt-1">3</span>
          <span className="text-[9px] text-slate-450 font-medium block mt-0.5">Pending alarms</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        
        {/* Pots Tracker left */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                <Sprout className="w-4.5 h-4.5 text-emerald-600" /> My Virtual Pots & Tracker
              </h3>
              <p className="text-xs text-slate-500">Live developmental indices of your potted seeds</p>
            </div>
            
            <button
              id="dashboard-sow-btn"
              onClick={() => setShowSowForm(!showSowForm)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-3 py-2 rounded-xl transition-all duration-150 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Sow Seed
            </button>
          </div>

          {showSowForm && (
            <form onSubmit={handleSow} className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 space-y-3.5 animate-fade-in shadow-inner">
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">Sow new virtual soil container</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Specimen Title</label>
                  <input
                    id="sow-plant-name-input"
                    type="text"
                    required
                    placeholder="e.g. Cherry Tomato Pods"
                    value={newPlantName}
                    onChange={(e) => setNewPlantName(e.target.value)}
                    className="w-full text-xs text-slate-700 bg-white border border-slate-150 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Vessel Plant Category</label>
                  <select
                    id="sow-plant-type-select"
                    value={newPlantType}
                    onChange={(e) => setNewPlantType(e.target.value)}
                    className="w-full text-xs text-slate-700 bg-white border border-slate-150 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Vegetable">Vegetable</option>
                    <option value="Fruit">Fruit</option>
                    <option value="Medicinal Herb">Medicinal / Spiritual Herb</option>
                    <option value="Foliage & Flower">Beautiful Floral</option>
                    <option value="Shade tree">Shade Tree</option>
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
                  Cancel
                </button>
                <button
                  id="sow-submit-btn"
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2 rounded-lg font-semibold transition-transform hover:scale-[1.02] cursor-pointer"
                >
                  Sow Seed Now
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
                      {p.type}
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
                        <Calendar className="w-3.5 h-3.5" /> Growth Term
                      </span>
                      <span className="font-bold text-slate-700">{getDaysPlanted(p.datePlanted)} Days Sown</span>
                    </div>

                    <div className="flex justify-between items-center text-slate-600">
                      <span className="flex items-center gap-1 font-medium text-slate-400">
                        💧 Schedule
                      </span>
                      <span className="font-semibold text-emerald-800 truncate max-w-[120px]">{p.wateringReminder}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-100/50 flex justify-end">
                  <span className="text-[9px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded uppercase">
                    Live tracking
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
              <Award className="w-4.5 h-4.5 text-amber-500" /> Gardening Achievements
            </h3>
            <p className="text-xs text-slate-500">Student daily objectives & active tasks checklist</p>
          </div>

          <div className="bg-white border border-slate-150 rounded-2xl p-5 space-y-3 shadow-sm">
            {tasks.map((tk) => (
              <div 
                key={tk.id} 
                onClick={() => toggleTask(tk.id)}
                className={`p-3 border rounded-xl flex items-start gap-3 cursor-pointer transition-colors duration-150 ${
                  tk.done 
                    ? 'bg-slate-50 text-slate-400 border-slate-100 line-through' 
                    : 'bg-emerald-50/20 text-slate-700 border-emerald-55 hover:bg-emerald-50/40 text-[12px] font-medium'
                }`}
              >
                <div className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 ${
                  tk.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white'
                }`}>
                  {tk.done && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-xs select-none leading-relaxed leading-snug">{tk.text}</span>
              </div>
            ))}

            <div className="pt-2">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex gap-2.5 items-start">
                <AlertCircle className="w-4.5 h-4.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-700 tracking-wide block">Classroom Garden Hint</span>
                  <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                    Completing daily achievements accelerates virtual health stats. Try checking soil pH and moisture before triggering watering alerts to earn maximum water-saver points!
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
