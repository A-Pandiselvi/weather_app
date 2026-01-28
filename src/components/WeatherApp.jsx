import React, { useState } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Gauge, Sunrise, Sunset, Search, MapPin } from 'lucide-react';

export default function WeatherApp() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  // Demo data for showcase (replace with real API later)
  const demoWeather = {
    city: 'San Francisco',
    country: 'US',
    temp: 18,
    feelsLike: 16,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
    pressure: 1013,
    sunrise: '06:42',
    sunset: '18:15',
    icon: 'partly-cloudy'
  };

  const handleLocationWeather = () => {
  setLoading(true);

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords;

    try {
      const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
      );

      const data = await res.json();

      setWeather({
        city: data.name,
        country: data.sys.country,
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        condition: data.weather[0].main,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        visibility: data.visibility / 1000,
        pressure: data.main.pressure,
        sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
      });

    } catch (error) {
      alert("Location weather not working!");
    }

    setLoading(false);
  });
};

const handleSearch = async (e) => {
  e.preventDefault();
  if (!city) return;

  setLoading(true);

  try {
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );

    const data = await res.json();

    if (data.cod === 404) {
      alert("City not found!");
      setLoading(false);
      return;
    }

    setWeather({
      city: data.name,
      country: data.sys.country,
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      condition: data.weather[0].main,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      visibility: data.visibility / 1000,
      pressure: data.main.pressure,
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
    });

  } catch (error) {
    alert("Something went wrong!");
  }

  setLoading(false);
};

const getWeatherIcon = (condition) => {
  switch (condition) {
    case "Clouds":
      return <Cloud className="w-24 h-24 text-white/90" />;
    case "Rain":
      return <CloudRain className="w-24 h-24 text-white/90" />;
    case "Clear":
      return <Sun className="w-24 h-24 text-white/90" />;
    default:
      return <Cloud className="w-24 h-24 text-white/90" />;
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-400 via-purple-300 to-indigo-400 p-4 md:p-8 font-['Quicksand',sans-serif]">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-blue-300/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-3 drop-shadow-lg tracking-tight">
            Weather<span className="text-yellow-200">Flow</span>
          </h1>
          <p className="text-white/80 text-lg font-light">Your beautiful weather companion</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-12 animate-slideUp">
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search for a city..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-6 py-5 pr-14 rounded-3xl bg-white/25 backdrop-blur-xl border border-white/30 text-white placeholder-white/60 text-lg focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300 shadow-2xl"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/40 backdrop-blur-sm p-3 rounded-full transition-all duration-300 hover:scale-110"
            >
              <Search className="w-6 h-6 text-white" />
            </button>
            <button
  type="button"
  onClick={handleLocationWeather}
  className="mt-6 w-full bg-white/20 hover:bg-white/30 text-white py-4 rounded-3xl transition-all duration-300"
>
  📍 Use My Current Location
</button>

          </div>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        )}

        {/* Weather Display */}
        {weather && !loading && (
          <div className="animate-fadeIn space-y-6">
            {/* Main Weather Card */}
            <div className="bg-white/20 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
              <div className="flex items-center gap-3 mb-8">
                <MapPin className="w-6 h-6 text-white/80" />
                <h2 className="text-3xl font-bold text-white">
                  {weather.city}, <span className="text-white/70 font-normal">{weather.country}</span>
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Temperature & Icon */}
                <div className="text-center md:text-left space-y-6">
                  <div className="flex items-center justify-center md:justify-start gap-6">
                    <div className="animate-float">
                      {getWeatherIcon(weather.condition)}
                    </div>
                    <div>
                      <div className="text-8xl font-bold text-white drop-shadow-lg">
                        {weather.temp}°
                      </div>
                      <div className="text-2xl text-white/70 mt-2">
                        Feels like {weather.feelsLike}°
                      </div>
                    </div>
                  </div>
                  <div className="text-3xl text-white/90 font-medium">
                    {weather.condition}
                  </div>
                </div>

                {/* Weather Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <WeatherDetail
                    icon={<Droplets className="w-6 h-6" />}
                    label="Humidity"
                    value={`${weather.humidity}%`}
                  />
                  <WeatherDetail
                    icon={<Wind className="w-6 h-6" />}
                    label="Wind Speed"
                    value={`${weather.windSpeed} km/h`}
                  />
                  <WeatherDetail
                    icon={<Eye className="w-6 h-6" />}
                    label="Visibility"
                    value={`${weather.visibility} km`}
                  />
                  <WeatherDetail
                    icon={<Gauge className="w-6 h-6" />}
                    label="Pressure"
                    value={`${weather.pressure} mb`}
                  />
                </div>
              </div>
            </div>

            {/* Sun Times Card */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-orange-300/30 to-yellow-300/30 backdrop-blur-2xl rounded-3xl p-8 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
                <div className="flex items-center gap-4">
                  <div className="bg-white/25 p-4 rounded-2xl">
                    <Sunrise className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <div className="text-white/70 text-sm font-medium mb-1">Sunrise</div>
                    <div className="text-3xl font-bold text-white">{weather.sunrise}</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-400/30 to-purple-400/30 backdrop-blur-2xl rounded-3xl p-8 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
                <div className="flex items-center gap-4">
                  <div className="bg-white/25 p-4 rounded-2xl">
                    <Sunset className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <div className="text-white/70 text-sm font-medium mb-1">Sunset</div>
                    <div className="text-3xl font-bold text-white">{weather.sunset}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Initial State */}
        {!weather && !loading && (
          <div className="text-center py-20 animate-fadeIn">
            <Cloud className="w-32 h-32 text-white/40 mx-auto mb-6 animate-float" />
            <h3 className="text-3xl font-bold text-white mb-3">Search for a city</h3>
            <p className="text-white/70 text-lg">Enter a city name to see the weather</p>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.8s ease-out 0.2s both;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// Weather Detail Component
function WeatherDetail({ icon, label, value }) {
  return (
    <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
      <div className="flex items-center gap-3 mb-2 text-white/80">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
}