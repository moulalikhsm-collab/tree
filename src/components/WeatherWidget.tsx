import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Droplets, Thermometer, MapPin, Loader2, AlertTriangle, Locate } from 'lucide-react';
import { WeatherInfo } from '../types';

interface WeatherWidgetProps {
  location: string;
  onLocationChange: (loc: string) => void;
  onWeatherLoaded?: (info: WeatherInfo) => void;
}

export default function WeatherWidget({ location, onLocationChange, onWeatherLoaded }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState(location);
  const [error, setError] = useState('');

  const fetchWeather = async (targetLoc: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: targetLoc })
      });
      if (!res.ok) throw new Error('Failed to load weather');
      const data: WeatherInfo = await res.json();
      setWeather(data);
      setInputText(data.location);
      if (onWeatherLoaded) {
        onWeatherLoaded(data);
      }
    } catch (err: any) {
      setError('Could not connect to regional weather station.');
    } finally {
      setLoading(false);
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch('/api/weather', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ latitude, longitude })
          });
          if (!res.ok) throw new Error('Failed to retrieve localized weather report');
          const data: WeatherInfo = await res.json();
          setWeather(data);
          setInputText(data.location);
          onLocationChange(data.location);
          if (onWeatherLoaded) {
            onWeatherLoaded(data);
          }
        } catch (err: any) {
          setError('Could not fetch climate data for detected coordinates.');
        } finally {
          setLoading(false);
        }
      },
      (geoErr) => {
        let msg = 'Could not access your physical GPS coordinates.';
        if (geoErr.code === 1) {
          msg = 'Location lookup permission denied. Please allow location access in your browser.';
        } else if (geoErr.code === 2) {
          msg = 'Physical position is currently unavailable.';
        } else if (geoErr.code === 3) {
          msg = 'Coordinates request timed out.';
        }
        setError(msg);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    fetchWeather(location);
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onLocationChange(inputText.trim());
    }
  };

  const getWeatherIcon = (condition: string) => {
    const cond = condition.toLowerCase();
    if (cond.includes('sun') || cond.includes('clear')) return <Sun className="w-8 h-8 text-amber-500 animate-spin-slow" />;
    if (cond.includes('rain') || cond.includes('shower')) return <CloudRain className="w-8 h-8 text-sky-500 animate-bounce" />;
    return <Cloud className="w-8 h-8 text-emerald-400" />;
  };

  return (
    <div id="weather-widget-container" className="bg-white/80 backdrop-blur rounded-2xl p-5 border border-emerald-100 shadow-sm">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
        <div>
          <h3 className="text-sm font-semibold text-emerald-800 tracking-wider uppercase flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-emerald-500" /> Climate Station
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Real-time agricultural environment advisor</p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto items-center">
          <div className="relative flex-1 sm:w-56">
            <MapPin className="absolute left-2.5 top-2.5 w-4 h-4 text-emerald-600 pointer-events-none" />
            <input
              id="weather-location-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. Pune, India"
              className="w-full text-xs bg-emerald-50/50 border border-emerald-100 rounded-lg pl-8 pr-8 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              id="weather-detect-gps-btn"
              type="button"
              onClick={handleDetectLocation}
              disabled={loading}
              title="Detect my current location"
              className="absolute right-2.5 top-2.5 text-emerald-600 hover:text-emerald-800 disabled:opacity-50 transition-colors"
            >
              <Locate className="w-4 h-4" />
            </button>
          </div>
          <button
            id="weather-update-btn"
            type="submit"
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-3 py-2 text-xs font-medium cursor-pointer transition-all duration-200 flex items-center justify-center min-w-[60px]"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Set'}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {weather && !loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-1">
          <div className="bg-emerald-50/40 border border-emerald-50 rounded-xl p-3 flex items-center gap-3">
            <div className="p-2 bg-emerald-100/50 rounded-lg">
              {getWeatherIcon(weather.condition)}
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Condition</p>
              <p className="text-sm font-semibold text-emerald-950 mt-0.5">{weather.condition}</p>
            </div>
          </div>

          <div className="bg-emerald-50/40 border border-emerald-50 rounded-xl p-3 flex items-center gap-3">
            <div className="p-2 bg-amber-100/50 rounded-lg">
              <Thermometer className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Temperature</p>
              <p className="text-sm font-semibold text-emerald-950 mt-0.5">{weather.temp}°C</p>
            </div>
          </div>

          <div className="bg-emerald-50/40 border border-emerald-50 rounded-xl p-3 flex items-center gap-3">
            <div className="p-2 bg-sky-100/50 rounded-lg">
              <Droplets className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Humidity</p>
              <p className="text-sm font-semibold text-emerald-950 mt-0.5">{weather.humidity}%</p>
            </div>
          </div>

          <div className="bg-emerald-50/40 border border-emerald-50 rounded-xl p-3 flex flex-col justify-center">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Soil Advice</p>
            <p className="text-xs font-medium text-emerald-800 mt-1">
              {weather.humidity > 80 
                ? "🌧️ High moisture: Skip evening watering setup" 
                : weather.temp > 30 
                ? "☀️ Heat spike: Double up plant shading"
                : "🌱 Optimal: Great day for organic repotting"
              }
            </p>
          </div>
        </div>
      )}

      {weather && !loading && (
        <div className="mt-4 pt-3 border-t border-emerald-100/60">
          <p className="text-[10px] uppercase font-bold text-emerald-700 tracking-widest flex items-center gap-1 mb-2">
            Weekly Spreading Index Forecast
          </p>
          <div className="grid grid-cols-3 gap-2">
            {weather.forecast.map((f, i) => (
              <div key={i} className="bg-slate-50/50 rounded-lg p-2 text-center border border-slate-100/50">
                <span className="text-[10px] text-slate-500 block font-medium">{f.day}</span>
                <span className="text-xs font-bold text-slate-700 block mt-1">{f.temp}°C</span>
                <span className="text-[10px] text-emerald-600 font-medium block mt-0.5 truncate">{f.condition}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
