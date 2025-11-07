// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App


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
  const [profileImage, setProfileImage] = useState(null);
  
  // Sample Pinterest-style images (replace with API data)
  const [pinterestImages] = useState([
    { id: 1, url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300&h=400&fit=crop', title: 'Mountain View' },
    { id: 2, url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop', title: 'Ocean Sunset' },
    { id: 3, url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&h=500&fit=crop', title: 'Forest Path' },
    { id: 4, url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=350&fit=crop', title: 'Nature Scene' },
  ]);

  const seasons = [
    { id: 1, name: 'Spring', emoji: '🌸', songs: [
      { id: 1, title: "Spring Awakening", artist: "Nature Sounds", duration: "3:45" },
      { id: 2, title: "Blooming Gardens", artist: "The Florals", duration: "4:20" },
    ]},
    { id: 2, name: 'Summer', emoji: '☀️', songs: [
      { id: 3, title: "Summer Breeze", artist: "Beach Vibes", duration: "5:12" },
      { id: 4, title: "Tropical Heat", artist: "Island Rhythm", duration: "3:58" },
    ]},
    { id: 3, name: 'Autumn', emoji: '🍂', songs: [
      { id: 5, title: "Fall Colors", artist: "Acoustic Soul", duration: "4:05" },
      { id: 6, title: "Harvest Moon", artist: "Folk Tales", duration: "3:33" },
    ]},
    { id: 4, name: 'Winter', emoji: '❄️', songs: [
      { id: 7, title: "Winter Wonderland", artist: "Snow Angels", duration: "4:15" },
      { id: 8, title: "Cozy Fireplace", artist: "Warm Nights", duration: "5:00" },
    ]}
  ];

  const [expandedSeason, setExpandedSeason] = useState(null);

  const handleProfileClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setProfileImage(URL.createObjectURL(file));
      }
    };
    fileInput.click();
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
    <div className="min-h-screen flex flex-col items-center p-0" style={{ backgroundColor: '#f0efeb'}}>
      <div className="w-full max-w-[390px] p-4">
        {/* Profile Section */}
        <div className="p-4 mb-4">
          <div className="flex items-center mb-3">
            <div
              className="w-12 h-12 rounded-full overflow-hidden cursor-pointer mr-3"
              onClick={handleProfileClick}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                  <User className="w-6 h-6" />
                </div>
              )}
            </div>
            <div className="flex-1">
              {isEditingName ? (
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  onKeyPress={(e) => e.key === 'Enter' && setIsEditingName(false)}
                  className="text-xl font-bold text-gray-800 border-b-2 border-indigo-500 outline-none w-full"
                  autoFocus
                />
              ) : (
                <h1
                  onClick={() => setIsEditingName(true)}
                  className="text-xl font-bold text-gray-800 cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  {getGreeting()}, {userName}
                </h1>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-lg font-bold text-gray-800">
                {currentTime.toLocaleDateString('en-US', { month: 'long' })}
              </div>
              <div className="text-lg font-bold text-gray-600">
                {currentTime.getFullYear()}
              </div>
            </div>
            <div className="flex justify-between gap-1 mt-1">
              {weekDays.map((day, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-1"
                >
                  <div className={`text-xs font-semibold mb-1 ${
                    day.isToday ? 'text-orange-600' : 'text-gray-700'
                  }`}>
                    {day.name}
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    day.isToday ? 'bg-orange-500 text-white' : 'bg-transparent text-gray-700'
                  }`}>
                    {day.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weather Data */}
        <div className="flex flex-row gap-3 mb-4">
          {/* Temperature Gauge */}
          <div className="bg-white rounded-2xl shadow-lg p-4 flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1"></div>
              <Thermometer className="w-5 h-5 text-red-500" />
              <button
                onClick={() => setUseCelsius(!useCelsius)}
                className="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-200 transition-colors"
              >
                {useCelsius ? '°F' : '°C'}
              </button>
            </div>
            
            {/* Semi-circle thermometer gauge */}
            <div className="relative w-full h-24 flex items-end justify-center">
              <svg viewBox="0 0 100 60" className="w-full h-full">
                <defs>
                  <linearGradient id="tempGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
                
                {/* Draw filled segments based on temperature */}
                {(() => {
                  const tempC = useCelsius ? convertToCelsius(temperature) : temperature;
                  const minTemp = useCelsius ? -10 : 14;
                  const maxTemp = useCelsius ? 45 : 113;
                  const percentage = Math.max(0, Math.min(1, (tempC - minTemp) / (maxTemp - minTemp)));
                  const segments = 20;
                  const filledSegments = Math.round(percentage * segments);
                  
                  return Array.from({ length: segments }).map((_, i) => {
                    const startAngle = 180 - (i / segments) * 180;
                    const endAngle = 180 - ((i + 1) / segments) * 180;
                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = (endAngle * Math.PI) / 180;
                    const innerRadius = 30;
                    const outerRadius = 38;
                    
                    const x1 = 50 + innerRadius * Math.cos(startRad);
                    const y1 = 50 - innerRadius * Math.sin(startRad);
                    const x2 = 50 + outerRadius * Math.cos(startRad);
                    const y2 = 50 - outerRadius * Math.sin(startRad);
                    const x3 = 50 + outerRadius * Math.cos(endRad);
                    const y3 = 50 - outerRadius * Math.sin(endRad);
                    const x4 = 50 + innerRadius * Math.cos(endRad);
                    const y4 = 50 - innerRadius * Math.sin(endRad);
                    
                    const colors = ['#3b82f6', '#3b82f6', '#3b82f6', '#60a5fa', '#60a5fa', '#60a5fa', '#60a5fa', '#93c5fd', '#fbbf24', '#fbbf24', '#fbbf24', '#fbbf24', '#fb923c', '#fb923c', '#f87171', '#f87171', '#ef4444', '#ef4444', '#dc2626', '#dc2626'];
                    const opacity = i < filledSegments ? 1 : 0.2;
                    
                    return (
                      <path
                        key={i}
                        d={`M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 0 0 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 1 ${x1} ${y1}`}
                        fill={colors[i]}
                        opacity={opacity}
                      />
                    );
                  });
                })()}
                
                {/* Temperature value in center */}
                <text x="50" y="45" textAnchor="middle" className="text-xs font-bold" fill={(() => {
                  const tempC = useCelsius ? convertToCelsius(temperature) : temperature;
                  const minTemp = useCelsius ? -10 : 14;
                  const maxTemp = useCelsius ? 45 : 113;
                  const percentage = Math.max(0, Math.min(1, (tempC - minTemp) / (maxTemp - minTemp)));
                  if (percentage < 0.33) return '#3b82f6';
                  if (percentage < 0.66) return '#fbbf24';
                  return '#ef4444';
                })()}>
                  {getTemperatureDisplay()}
                </text>
              </svg>
            </div>
          </div>

          {/* Humidity Gauge */}
          <div className="bg-white rounded-2xl shadow-lg p-4 flex-1">
            <div className="flex items-center justify-center mb-2">
              <Droplets className="w-5 h-5 text-blue-500" />
            </div>
            
            {/* Semi-circle humidity gauge */}
            <div className="relative w-full h-24 flex items-end justify-center">
              <svg viewBox="0 0 100 60" className="w-full h-full">
                <defs>
                  <linearGradient id="humidGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#dbeafe" />
                    <stop offset="50%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#1e40af" />
                  </linearGradient>
                </defs>
                
                {/* Draw filled segments based on humidity */}
                {(() => {
                  const percentage = humidity / 100;
                  const segments = 20;
                  const filledSegments = Math.round(percentage * segments);
                  
                  return Array.from({ length: segments }).map((_, i) => {
                    const startAngle = 180 - (i / segments) * 180;
                    const endAngle = 180 - ((i + 1) / segments) * 180;
                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = (endAngle * Math.PI) / 180;
                    const innerRadius = 30;
                    const outerRadius = 38;
                    
                    const x1 = 50 + innerRadius * Math.cos(startRad);
                    const y1 = 50 - innerRadius * Math.sin(startRad);
                    const x2 = 50 + outerRadius * Math.cos(startRad);
                    const y2 = 50 - outerRadius * Math.sin(startRad);
                    const x3 = 50 + outerRadius * Math.cos(endRad);
                    const y3 = 50 - outerRadius * Math.sin(endRad);
                    const x4 = 50 + innerRadius * Math.cos(endRad);
                    const y4 = 50 - innerRadius * Math.sin(endRad);
                    
                    const colors = ['#dbeafe', '#bfdbfe', '#bfdbfe', '#93c5fd', '#93c5fd', '#93c5fd', '#60a5fa', '#60a5fa', '#60a5fa', '#60a5fa', '#3b82f6', '#3b82f6', '#3b82f6', '#2563eb', '#2563eb', '#2563eb', '#1e40af', '#1e40af', '#1e3a8a', '#1e3a8a'];
                    const opacity = i < filledSegments ? 1 : 0.2;
                    
                    return (
                      <path
                        key={i}
                        d={`M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 0 0 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 1 ${x1} ${y1}`}
                        fill={colors[i]}
                        opacity={opacity}
                      />
                    );
                  });
                })()}
                
                {/* Humidity value in center */}
                <text x="50" y="45" textAnchor="middle" className="text-xs font-bold" fill={(() => {
                  const percentage = humidity / 100;
                  if (percentage < 0.33) return '#93c5fd';
                  if (percentage < 0.66) return '#3b82f6';
                  return '#1e40af';
                })()}>
                  {humidity.toFixed(1)}%
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* Pinterest-style Image Grid */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Gallery</h2>
          <div className="columns-2 gap-3">
            {pinterestImages.map((image) => (
              <div key={image.id} className="mb-3 break-inside-avoid">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                />
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-3 text-center">
            Connect your API to display custom images
          </div>
        </div>

        {/* Seasonal Song Lists - Bottom Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="grid grid-cols-4 gap-2">
            {seasons.map((season) => (
              <div key={season.id} className="flex flex-col items-center">
                <button
                  onClick={() => setExpandedSeason(expandedSeason === season.id ? null : season.id)}
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl transition-all ${
                    expandedSeason === season.id ? 'bg-purple-200 scale-110' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {season.emoji}
                </button>
                <span className="text-xs font-semibold text-gray-700 mt-1">{season.name}</span>
              </div>
            ))}
          </div>

          {/* Expanded Song List */}
          {expandedSeason && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-md font-semibold text-gray-700 mb-2">
                {seasons.find(s => s.id === expandedSeason)?.name} Playlist
              </h3>
              <div className="space-y-2">
                {seasons.find(s => s.id === expandedSeason)?.songs.map((song) => (
                  <div
                    key={song.id}
                    className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                      currentlyPlaying === song.id
                        ? 'bg-gradient-to-r from-purple-200 to-indigo-200 shadow-md'
                        : 'bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100'
                    }`}
                  >
                    <div className="flex items-center flex-1 gap-2">
                      <button
                        onClick={() => togglePlayPause(song.id)}
                        className="w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center text-white transition-colors"
                      >
                        {currentlyPlaying === song.id ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4 ml-1" />
                        )}
                      </button>
                      <div className="flex flex-col">
                        <div className="font-semibold text-gray-800 text-sm">{song.title}</div>
                        <div className="text-xs text-gray-600">{song.artist}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 font-medium">{song.duration}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}