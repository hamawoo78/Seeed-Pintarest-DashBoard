import React, { useState, useEffect } from 'react';
import { Clock, Droplets, Thermometer, Music, Play, Pause, User, X } from 'lucide-react';

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [humidity, setHumidity] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [useCelsius, setUseCelsius] = useState(true);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [audio, setAudio] = useState(null);

  // Profile system
  const [profiles] = useState([
    {
      id: 1,
      name: 'Nae',
      type: 'adult',
      image: null,
      bgColor: '#fee2e2',
      seasons: [
        { id: 1, name: 'Spring', emoji: '🌸', songs: [
          { id: 1, title: "Spring", url: "/public/music/Spring.mp3"},
        ]},
        { id: 2, name: 'Summer', emoji: '☀️', songs: [
          { id: 2, title: "Summer", url: "/music/Summer.mp3"},
        ]},
        { id: 3, name: 'Autumn', emoji: '🍂', songs: [
          { id: 3, title: "Fall", url: "/music/Fall.mp3" },
        ]},
        { id: 4, name: 'Winter', emoji: '❄️', songs: [
          { id: 4, title: "Winter", url: "/music/Winter.mp3" },
        ]}
      ]
    },
    {
      id: 2,
      name: 'Nae',
      type: 'kids',
      image: null,
      bgColor: '#FFE4E9',
      seasons: [
        { id: 1, name: 'Dogs', emoji: '🐕', songs: [
          { id: 11, title: "Puppy", url: "/music/dog.wav" },
        ]},
        { id: 2, name: 'Cats', emoji: '🐱', songs: [
          { id: 12, title: "Kitty", url: "/music/cat.wav" },
        ]},
        { id: 3, name: 'Birds', emoji: '🐦', songs: [
          { id: 13, title: "Bird", url: "/music/birds.wav" },
        ]},
        { id: 4, name: 'Cow', emoji: '🐄', songs: [
          { id: 14, title: "Cow", url: "/music/cow.wav" },

        ]}
      ]
    }
  ]);
  
  const [currentProfile, setCurrentProfile] = useState(profiles[0]);
  const [profileImages, setProfileImages] = useState({});
  // const [expandedSeason, setExpandedSeason] = useState(null);
  // const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  // const [currentSong, setCurrentSong] = useState(null);
  
  const [pinterestImages] = useState([
    { id: 1, url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300&h=400&fit=crop', title: 'Mountain View' },
    { id: 2, url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop', title: 'Ocean Sunset' },
    { id: 3, url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&h=500&fit=crop', title: 'Forest Path' },
    { id: 4, url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=350&fit=crop', title: 'Nature Scene' },
  ]);

  const handleProfileImageClick = (profileId, e) => {
    e.stopPropagation();
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setProfileImages(prev => ({
          ...prev,
          [profileId]: URL.createObjectURL(file)
        }));
      }
    };
    fileInput.click();
  };

  const switchProfile = (profile) => {
    setCurrentProfile(profile);
    setShowProfileModal(false);
    setExpandedSeason(null);
    setCurrentlyPlaying(null);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const res = await fetch("http://10.0.0.158/sensor"); 
        const json = await res.json();
        setTemperature(json.temperature);
        setHumidity(json.humidity);
      } catch (err) {
        console.error("Error fetching sensor data:", err);
      }
    };

    fetchSensorData(); // fetch immediately on mount
    const interval = setInterval(fetchSensorData, 5000); // fetch every 5 seconds
    return () => clearInterval(interval);
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
    if (temperature === null) return '--°C';
    if (useCelsius) {
      return `${temperature.toFixed(1)}°C`;
    }
    return `${((temperature * 9/5) + 32).toFixed(1)}°F`;
  };

  const togglePlayPause = (songId) => {
    if (currentlyPlaying === songId) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(songId);
    }
  };

  const playSong = (season) => {
    const song = season.songs[0]; // pick the first song in this season
    if (!song) return;

    // If the same song is playing, stop it
    if (currentlyPlaying === song.id) {
      if (audio) audio.pause();
      setCurrentlyPlaying(null);
      setCurrentSong(null);
      setAudio(null);
      return;
    }

    // Stop any currently playing audio
    if (audio) audio.pause();

    // Create and play new audio
    const newAudio = new Audio(song.url);
    newAudio.play();

    // Update states
    setAudio(newAudio);
    setCurrentlyPlaying(song.id);
    setCurrentSong(song);
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

  // Kids background with dots
  const kidsBackground = currentProfile.type === 'kids' ? {
    backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
    backgroundSize: '30px 30px',
    backgroundColor: currentProfile.bgColor
  } : { backgroundColor: currentProfile.bgColor };

  return (
    <div className="min-h-screen flex flex-col items-center p-0" style={kidsBackground}>
      <div className="w-full max-w-[390px] p-4">
        {/* Profile Section */}
        <div className="p-4 mb-4">
          <div className="flex items-center mb-3">
            <div
              className="w-12 h-12 rounded-full overflow-hidden cursor-pointer mr-3 border-2 border-purple-300"
              onClick={() => setShowProfileModal(true)}
            >
              {profileImages[currentProfile.id] ? (
                <img
                  src={profileImages[currentProfile.id]}
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
              <h1 className="text-xl font-bold text-gray-800">
                {getGreeting()}, {currentProfile.name}
              </h1>
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
            <div className="relative w-full h-24 flex items-end justify-center">
              <svg viewBox="0 0 100 60" className="w-full h-full">
                {(() => {
                  if (temperature === null) return null;
                  const tempC = useCelsius ? temperature : (temperature * 9/5) + 32;
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
              </svg>
            </div>
            
            <div className="flex items-center justify-center gap-2 mt-2">
              <Thermometer className="w-5 h-5 text-red-500" />
              <button
                onClick={() => setUseCelsius(!useCelsius)}
                className="text-2xl font-bold cursor-pointer hover:scale-105 transition-transform"
                style={{ 
                  color: (() => {
                    if (temperature === null) return '#6b7280';
                    const tempC = useCelsius ? temperature : (temperature * 9/5) + 32;
                    const minTemp = useCelsius ? -10 : 14;
                    const maxTemp = useCelsius ? 45 : 113;
                    const percentage = Math.max(0, Math.min(1, (tempC - minTemp) / (maxTemp - minTemp)));
                    if (percentage < 0.33) return '#3b82f6';
                    if (percentage < 0.66) return '#fbbf24';
                    return '#ef4444';
                  })()
                }}
              >
                {getTemperatureDisplay()}
              </button>
            </div>
          </div>

          {/* Humidity Gauge */}
          <div className="bg-white rounded-2xl shadow-lg p-4 flex-1">
            <div className="relative w-full h-24 flex items-end justify-center">
              <svg viewBox="0 0 100 60" className="w-full h-full">
                {(() => {
                  if (humidity === null) return null;
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
              </svg>
            </div>
            
            <div className="flex items-center justify-center gap-2 mt-2">
              <Droplets className="w-5 h-5 text-blue-500" />
              <div 
                className="text-2xl font-bold"
                style={{ 
                  color: (() => {
                    if (humidity === null) return '#6b7280';
                    const percentage = humidity / 100;
                    if (percentage < 0.33) return '#93c5fd';
                    if (percentage < 0.66) return '#3b82f6';
                    return '#1e40af';
                  })()
                }}
              >
                {humidity !== null ? `${humidity.toFixed(1)}%` : '--%'}
              </div>
            </div>
          </div>
        </div>

        {/* Pinterest-style Image Grid */}
        {/* <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
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
        </div> */}

        {/* Seasonal Song Lists
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="grid grid-cols-4 gap-2">
            {currentProfile.seasons.map((season) => (
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

          {expandedSeason && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-md font-semibold text-gray-700 mb-2">
                {currentProfile.seasons.find(s => s.id === expandedSeason)?.name} Playlist
              </h3>
              <div className="space-y-2">
                {currentProfile.seasons.find(s => s.id === expandedSeason)?.songs.map((song) => (
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
        </div> */}


        {/* Seasonal Song Lists */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          {/* Now Playing Display */}
          {currentSong && (
            <div className="mb-4 p-3 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center animate-pulse">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 text-sm">Now Playing</div>
                  <div className="text-xs text-gray-600">{currentSong.title} - {currentSong.artist}</div>
                </div>
                <div className="text-xs text-gray-600 font-medium">{currentSong.duration}</div>
              </div>
            </div>
          )}

          {/* Song Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {currentProfile.seasons.map((season) => (
              <div key={season.id} className="flex flex-col items-center">
                <button
                  onClick={() => playSong(season)}
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl transition-all ${
                    currentlyPlaying === season.songs[0].id 
                      ? 'bg-purple-300 scale-110 animate-pulse' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {season.emoji}
                </button>
                <span className="text-xs font-semibold text-gray-700 mt-1">{season.name}</span>
              </div>
            ))}
          </div>
        </div>
      {/* </div> */}

      {/* Yes/No Buttons */}
        <div className="flex gap-4">
          <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all hover:scale-105 text-xl">
            Yes
          </button>
          <button className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all hover:scale-105 text-xl">
            No
          </button>
        </div>
      </div>

      {/* Profile Selection Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Select Profile</h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-3">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => switchProfile(profile)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    currentProfile.id === profile.id
                      ? 'bg-purple-100 border-2 border-purple-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div
                    className="w-14 h-14 rounded-full overflow-hidden cursor-pointer border-2 border-purple-300"
                    onClick={(e) => handleProfileImageClick(profile.id, e)}
                  >
                    {profileImages[profile.id] ? (
                      <img
                        src={profileImages[profile.id]}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                        <User className="w-7 h-7" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{profile.name}</div>
                    <div className="text-xs text-gray-600">
                      {profile.type === 'adult' ? 'Adult Profile' : 'Kids Profile'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// Test interface

// import { useState, useEffect } from 'react';
// import { Thermometer, Droplets } from 'lucide-react';

// export default function WeatherDisplay() {
//   const [temperature, setTemperature] = useState(72);
//   const [humidity, setHumidity] = useState(45);

//   // Simulate data updates every 3 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setTemperature(prev => Math.max(60, Math.min(90, prev + (Math.random() - 0.5) * 4)));
//       setHumidity(prev => Math.max(30, Math.min(70, prev + (Math.random() - 0.5) * 6)));
//     }, 3000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center p-4">
//       <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
//         <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
//           Weather Monitor
//         </h1>
        
//         <div className="space-y-6">
//           {/* Temperature Card */}
//           <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl p-6 text-white transform transition hover:scale-105">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <Thermometer size={32} />
//                 <span className="text-lg font-semibold">Temperature</span>
//               </div>
//             </div>
//             <div className="mt-4">
//               <span className="text-5xl font-bold">{temperature.toFixed(1)}</span>
//               <span className="text-2xl ml-2">°F</span>
//             </div>
//           </div>

//           {/* Humidity Card */}
//           <div className="bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl p-6 text-white transform transition hover:scale-105">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <Droplets size={32} />
//                 <span className="text-lg font-semibold">Humidity</span>
//               </div>
//             </div>
//             <div className="mt-4">
//               <span className="text-5xl font-bold">{humidity.toFixed(1)}</span>
//               <span className="text-2xl ml-2">%</span>
//             </div>
//           </div>
//         </div>

//         <p className="text-center text-gray-500 text-sm mt-6">
//           Updates every 3 seconds
//         </p>
//       </div>
//     </div>
//   );
// }