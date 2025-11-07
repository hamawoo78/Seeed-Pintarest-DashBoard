import React, { useState, useEffect } from 'react';
import { Clock, Droplets, Thermometer, Music, Play, Pause, User } from 'lucide-react';

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [humidity, setHumidity] = useState(65);
  const [temperature, setTemperature] = useState(72);
  const [useCelsius, setUseCelsius] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [userName, setUserName] = useState('Guest');
  const [isEditingName, setIsEditingName] = useState(false);
  const [songs] = useState([
    { id: 1, title: "Summer Breeze", artist: "The Waves", duration: "3:45" },
    { id: 2, title: "Midnight Drive", artist: "Neon Lights", duration: "4:20" },
    { id: 3, title: "Coffee Shop Blues", artist: "Jazz Collective", duration: "5:12" },
    { id: 4, title: "Electric Dreams", artist: "Synth Masters", duration: "3:58" },
    { id: 5, title: "Rainy Day", artist: "Acoustic Soul", duration: "4:05" },
    { id: 6, title: "City Lights", artist: "Urban Echo", duration: "3:33" },
  ]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate external device data updates
  useEffect(() => {
    const dataUpdate = setInterval(() => {
      setHumidity(prev => Math.max(30, Math.min(90, prev + (Math.random() - 0.5) * 2)));
      setTemperature(prev => Math.max(60, Math.min(85, prev + (Math.random() - 0.5) * 1)));
    }, 5000);
    return () => clearInterval(dataUpdate);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric'
    });
  };

  const convertToCelsius = (fahrenheit) => {
    return ((fahrenheit - 32) * 5) / 9;
  };

  const getTemperatureDisplay = () => {
    if (useCelsius) {
      return `${convertToCelsius(temperature).toFixed(1)}°C`;
    }
    return `${temperature.toFixed(1)}°F`;
  };

  const togglePlayPause = (songId) => {
    if (currentlyPlaying === songId) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(songId);
    }
  };

  const getWeekDays = () => {
    const days = [];
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1));
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      days.push({
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.getDate(),
        isToday: date.toDateString() === today.toDateString()
      });
    }
    return days;
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const weekDays = getWeekDays();

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Profile Section */}
        <div className="p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white mr-4">
              <User className="w-8 h-8" />
            </div>
            <div>
              {isEditingName ? (
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  onKeyPress={(e) => e.key === 'Enter' && setIsEditingName(false)}
                  className="text-3xl font-bold text-gray-800 border-b-2 border-indigo-500 outline-none"
                  autoFocus
                />
              ) : (
                <h1
                  onClick={() => setIsEditingName(true)}
                  className="text-3xl font-bold text-gray-800 cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  {getGreeting()}, {userName}
                </h1>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4 ml-20">
            <div>
              <div className="text-4xl font-bold text-gray-800">
                {currentTime.toLocaleDateString('en-US', { month: 'long' })}
              </div>
              <div className="text-2xl text-gray-600 mt-1">
                {currentTime.getFullYear()}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-6 h-6 text-indigo-600 mr-2" />
              </div>
              <div className="text-5xl font-bold text-indigo-600 text-center">
                {formatTime(currentTime)}
              </div>
            </div>
          </div>
          
          {/* Weekly Calendar */}
          <div className="flex justify-between gap-2 mt-6">
            {weekDays.map((day, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col items-center p-3"
              >
                <div className={`text-sm font-semibold mb-2 ${
                  day.isToday ? 'text-orange-600' : 'text-gray-700'
                }`}>
                  {day.name}
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  day.isToday 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-transparent text-gray-700'
                }`}>
                  {day.date}
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* Weather Data */}
        <div className="flex gap-4 mb-6">
          {/* Temperature */}
          <div className="bg-white rounded-2xl shadow-lg p-4 flex-1">
            <div className="flex items-center justify-end mb-2">
              <button
                onClick={() => setUseCelsius(!useCelsius)}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200 transition-colors"
              >
                {useCelsius ? '°F' : '°C'}
              </button>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="text-4xl font-bold text-red-500">
                {getTemperatureDisplay()}
              </div>
              <Thermometer className="w-10 h-10 text-red-500" />
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">External Device</div>
          </div>

          {/* Humidity */}
          <div className="bg-white rounded-2xl shadow-lg p-4 flex-1">
            <div className="h-8 mb-2"></div>
            <div className="flex items-center justify-center gap-3">
              <div className="text-4xl font-bold text-blue-500">
                {humidity.toFixed(1)}%
              </div>
              <Droplets className="w-10 h-10 text-blue-500" />
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">External Device</div>
          </div>
        </div>

        {/* Song List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <Music className="w-7 h-7 text-purple-600 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-700">Song List</h2>
          </div>
          <div className="space-y-3">
            {songs.map((song) => (
              <div
                key={song.id}
                className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                  currentlyPlaying === song.id
                    ? 'bg-gradient-to-r from-purple-200 to-indigo-200 shadow-md'
                    : 'bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100'
                }`}
              >
                <div className="flex items-center flex-1">
                  <button
                    onClick={() => togglePlayPause(song.id)}
                    className="w-12 h-12 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center text-white mr-4 transition-colors"
                  >
                    {currentlyPlaying === song.id ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6 ml-1" />
                    )}
                  </button>
                  <div>
                    <div className="font-semibold text-gray-800">{song.title}</div>
                    <div className="text-sm text-gray-600">{song.artist}</div>
                  </div>
                </div>
                <div className="text-gray-600 font-medium">{song.duration}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}