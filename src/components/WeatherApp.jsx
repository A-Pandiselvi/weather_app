import React, { useState, useEffect, useCallback } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Gauge, Sunrise, Sunset, Search, MapPin, CloudSnow, CloudLightning, AlertTriangle, Calendar, Clock } from 'lucide-react';

export default function WeatherApp() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentCities, setRecentCities] = useState([]);

  // --- Core Logic: Fetches Current + 5-Day Forecast ---
  const fetchAllWeather = async (params) => {
    setLoading(true);
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    try {
      const currentRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?${params}&units=metric&appid=${API_KEY}`);
      const currentData = await currentRes.json();
      
      if (currentData.cod === "404") {
        alert("City not found!");
        setLoading(false);
        return;
      }

      const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?${params}&units=metric&appid=${API_KEY}`);
      const forecastData = await forecastRes.json();

      setWeather({
        city: currentData.name,
        country: currentData.sys.country,
        temp: Math.round(currentData.main.temp),
        feelsLike: Math.round(currentData.main.feels_like),
        condition: currentData.weather[0].main,
        description: currentData.weather[0].description,
        humidity: currentData.main.humidity,
        windSpeed: currentData.wind.speed,
        visibility: currentData.visibility / 1000,
        pressure: currentData.main.pressure,
        sunrise: new Date(currentData.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sunset: new Date(currentData.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });

      setHourly(forecastData.list.slice(0, 8));
      const dailyData = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));
      setForecast(dailyData);

    } catch (error) {
      alert("Something went wrong!");
    }
    setLoading(false);
  };

  const handleLocationWeather = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchAllWeather(`lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`),
      () => setLoading(false)
    );
  }, []);

useEffect(() => {
  handleLocationWeather();

  // ✅ Load Recent Cities from LocalStorage
  const saved = JSON.parse(localStorage.getItem("recentCities")) || [];
  setRecentCities(saved);
}, [handleLocationWeather]);


  const handleSearch = (e) => {
    e.preventDefault();
    if (!city) return;
   fetchAllWeather(`q=${city}`);

// ✅ Add City to Recent History
const updated = [city, ...recentCities.filter((c) => c !== city)].slice(0, 5);

setRecentCities(updated);
localStorage.setItem("recentCities", JSON.stringify(updated));

  };

  // ✅ When user clicks recent city
const handleRecentClick = (name) => {
  setCity(name);
  fetchAllWeather(`q=${name}`);
};


  const getWeatherIcon = (condition, size = "w-16 h-16") => {
    const iconClass = `${size} text-white/90`;
    switch (condition) {
      case "Clouds": return <Cloud className={iconClass} />;
      case "Rain": return <CloudRain className={iconClass} />;
      case "Clear": return <Sun className={iconClass} />;
      case "Snow": return <CloudSnow className={iconClass} />;
      case "Thunderstorm": return <CloudLightning className={iconClass} />;
      default: return <Cloud className={iconClass} />;
    }
  };

  // Logic for Auto Background Video/Color
  const getBackgroundStyles = () => {
    if (!weather) return { gradient: "from-violet-500 via-purple-400 to-indigo-500", video: "" };
    switch (weather.condition) {
      case "Clear": return { gradient: "from-orange-400 via-amber-400 to-pink-500", video: "https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-2408-large.mp4" };
      case "Clouds": return { gradient: "from-slate-500 via-gray-500 to-zinc-600", video: "https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-clouds-in-the-sky-42457-large.mp4" };
      case "Rain": 
      case "Drizzle": return { gradient: "from-blue-600 via-indigo-600 to-cyan-700", video: "https://assets.mixkit.co/videos/preview/mixkit-rain-drops-on-a-window-1543-large.mp4" };
      case "Snow": return { gradient: "from-blue-100 via-slate-200 to-blue-300", video: "https://assets.mixkit.co/videos/preview/mixkit-snowy-mountain-landscape-1210-large.mp4" };
      case "Thunderstorm": return { gradient: "from-gray-800 to-blue-900", video: "https://assets.mixkit.co/videos/preview/mixkit-lightning-strikes-in-the-night-sky-4043-large.mp4" };
      default: return { gradient: "from-violet-500 via-purple-400 to-indigo-500", video: "" };
    }
  };

  const bg = getBackgroundStyles();

  return (
    <div className={`relative min-h-screen bg-gradient-to-br ${bg.gradient} p-4 sm:p-6 md:p-12 font-['Quicksand',sans-serif] transition-all duration-1000 overflow-hidden`}>
      
      {/* Background Video Layer */}
      {weather && (
        <video 
          key={bg.video} 
          autoPlay loop muted 
          className="absolute top-0 left-0 w-full h-full object-cover opacity-30 mix-blend-overlay pointer-events-none"
        >
          <source src={bg.video} type="video/mp4" />
        </video>
      )}

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header */}
        <header className="text-center mb-10 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-2 drop-shadow-md tracking-tight">
            Weather<span className="text-yellow-200">Flow</span>
          </h1>
        </header>

        {/* Search */}
       <section className="mb-10 animate-slideUp">
  <form onSubmit={handleSearch} className="max-w-2xl mx-auto space-y-4">

    {/* Search Input */}
    <div className="relative group">
      <input
        type="text"
        placeholder="Search for a city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="w-full px-6 py-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-white/60 text-lg focus:outline-none focus:ring-4 focus:ring-white/20 shadow-xl"
      />

      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 p-3 rounded-full hover:bg-white/50 transition-colors"
      >
        <Search className="text-white" />
      </button>
    </div>

    {/* ✅ Recent Search History */}
    {recentCities.length > 0 && (
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-4 shadow-lg">
        <div className='mb-3 flex '>
        <h4 className="text-white font-bold text-sm flex   gap-2">
         <Search className="text-white" size={15} /> Recent Searches
        </h4>
<button
  onClick={() => {
    setRecentCities([]);
    localStorage.removeItem("recentCities");
  }}
  className="text-xs text-red-500 font-bold cursor-pointer ml-auto"
>
  Clear
</button>
</div>

        <div className="flex flex-wrap gap-3">
          {recentCities.map((c, idx) => (
            <button
              key={idx}
              onClick={() => handleRecentClick(c)}
              type="button"
              className="px-4 py-2 rounded-full bg-white/20 text-white text-sm hover:bg-white/40 transition-all shadow-md"
            >
              {c}
            </button>
          ))}
        </div>
        
      </div>
    )}

  </form>
  
</section>


        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-white">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
            <p className="font-medium tracking-wide">Syncing skies...</p>
          </div>
        ) : weather && (
          <div className="animate-fadeIn space-y-6">
            
            {/* NEW: Weather Alerts Section */}
            {(weather.condition === "Rain" || weather.condition === "Snow" || weather.condition === "Thunderstorm" || weather.windSpeed > 25) && (
              <div className="bg-red-500/30 backdrop-blur-md border border-red-400/50 rounded-3xl p-4 flex items-center gap-4 text-white animate-pulse">
                <div className="bg-red-500 p-2 rounded-full">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Weather Advisory</h4>
                  <p className="text-sm text-red-100">Caution: {weather.condition} conditions detected. Expect {weather.description} and adjust travel plans.</p>
                </div>
              </div>
            )}

            {/* Current Weather Card */}
            <div className="bg-white/20 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-white/30 shadow-2xl">
              <div className="flex items-center gap-2 mb-8 justify-center md:justify-start">
                <MapPin className="text-white/70" />
                <h2 className="text-3xl md:text-5xl font-bold text-white">{weather.city}, {weather.country}</h2>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="flex flex-col items-center md:items-start">
                  <div className="flex items-center gap-6">
                    <div className="animate-float">{getWeatherIcon(weather.condition, "w-24 h-24 md:w-32 md:h-32")}</div>
                    <div>
                      <span className="text-7xl md:text-9xl font-extrabold text-white drop-shadow-xl">{weather.temp}°</span>
                      <p className="text-xl text-white/80">Feels like {weather.feelsLike}°</p>
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-4xl text-white font-semibold mt-4 capitalize">{weather.description}</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                  <WeatherDetail icon={<Droplets />} label="Humidity" value={`${weather.humidity}%`} />
                  <WeatherDetail icon={<Wind />} label="Wind" value={`${weather.windSpeed} km/h`} />
                  <WeatherDetail icon={<Eye />} label="Visibility" value={`${weather.visibility} km`} />
                  <WeatherDetail icon={<Gauge />} label="Pressure" value={`${weather.pressure} mb`} />
                </div>
              </div>
            </div>

            {/* Hourly Forecast */}
            <div className="bg-white/10 backdrop-blur-lg rounded-[2rem] p-6 border border-white/20">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2 px-2"><Clock size={18}/> Hourly Forecast</h3>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {hourly.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center min-w-[100px] bg-white/10 p-4 rounded-3xl border border-white/5 hover:bg-white/20 transition-colors">
                    <span className="text-white/60 text-xs">{new Date(item.dt * 1000).getHours()}:00</span>
                    <div className="my-2">{getWeatherIcon(item.weather[0].main, "w-8 h-8")}</div>
                    <span className="text-white font-bold text-lg">{Math.round(item.main.temp)}°</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Forecast & Sun Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-[2rem] p-8 border border-white/20">
                <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2"><Calendar size={20}/> Next 5 Days</h3>
                <div className="space-y-6">
                  {forecast.map((day, idx) => (
                    <div key={idx} className="flex items-center justify-between text-white border-b border-white/10 pb-4 last:border-0 last:pb-0">
                      <span className="w-24 font-medium text-lg">
                        {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <div className="flex items-center gap-4 w-32">
                        {getWeatherIcon(day.weather[0].main, "w-6 h-6")}
                        <span className="capitalize text-white/70 text-sm">{day.weather[0].main}</span>
                      </div>
                      <span className="text-2xl font-bold">{Math.round(day.main.temp)}°</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                 <SunCard icon={<Sunrise />} label="Sunrise" time={weather.sunrise} color="bg-orange-400/20" />
                 <SunCard icon={<Sunset />} label="Sunset" time={weather.sunset} color="bg-indigo-400/20" />
                 <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                    <p className="text-white/40 text-xs uppercase font-bold mb-2">Pro Tip</p>
                    <p className="text-white/80 text-sm italic">"Keep an eye on the wind speed for outdoor activities today!"</p>
                 </div>
              </div>
            </div>

          </div>
        )}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.8s ease-out 0.2s both; }
        .animate-float { animation: float 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

function WeatherDetail({ icon, label, value }) {
  return (
    <div className="bg-white/10 rounded-2xl p-4 border border-white/10 text-center hover:bg-white/20 transition-all duration-300">
      <div className="text-white/60 flex justify-center mb-1">{icon}</div>
      <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{label}</p>
      <p className="text-lg font-bold text-white">{value}</p>
    </div>
  );
}

function SunCard({ icon, label, time, color }) {
  return (
    <div className={`${color} backdrop-blur-lg rounded-[2rem] p-6 border border-white/10 flex items-center gap-4 transform hover:scale-105 transition-transform cursor-default`}>
      <div className="p-3 bg-white/10 rounded-xl text-white">{icon}</div>
      <div>
        <p className="text-white/60 text-xs font-bold uppercase">{label}</p>
        <p className="text-xl font-bold text-white">{time}</p>
      </div>
    </div>
  );
}