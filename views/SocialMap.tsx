
import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Search, 
  Layers, 
  Navigation, 
  Plus, 
  AlertTriangle, 
  Wrench,
  User,
  Zap,
  Filter,
  Check,
  Coffee,
  Mountain,
  Loader2
} from 'lucide-react';
import { getRideRecommendations, getPlacesForMap } from '../services/geminiService';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Leaflet icon fix for React
const createCustomIcon = (iconMarkup: string, color: string) => {
  return L.divIcon({
    html: `<div class="w-10 h-10 rounded-full ${color} border-2 border-white/20 shadow-xl flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform">${iconMarkup}</div>`,
    className: 'custom-div-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

// Icons HTML strings
const icons = {
  rider: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
  shop: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>',
  cafe: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"></path><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>',
  scenic: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"></path></svg>',
  event: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
  hazard: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
};

// Component to handle map clicks/moves
const MapController = ({ onMoveEnd }: { onMoveEnd: (center: L.LatLng) => void }) => {
  const map = useMapEvents({
    moveend: () => {
      onMoveEnd(map.getCenter());
    },
  });
  return null;
};

const SocialMap: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'map' | 'routes'>('map');
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);
  const [isLoadingMapData, setIsLoadingMapData] = useState(false);
  
  // Map State
  const [mapCenter, setMapCenter] = useState<[number, number]>([41.0082, 28.9784]); // Istanbul Default
  const [markers, setMarkers] = useState<any[]>([
    { type: 'rider', title: 'YolCanavari', lat: 41.0122, lng: 28.9764, description: 'RiderTR üyesi' },
    { type: 'rider', title: 'RüzgarOğlu', lat: 40.9922, lng: 29.0264, description: 'Aktif sürüşte' },
  ]);

  // Filter state
  const [filters, setFilters] = useState({
    rider: true,
    event: true,
    shop: true,
    cafe: true,
    scenic: true,
    hazard: true
  });

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredMarkers = markers.filter(m => filters[m.type as keyof typeof filters] !== false);

  const handleGetAITips = async () => {
    setIsLoadingRecs(true);
    const result = await getRideRecommendations("İstanbul", "Orta");
    setRecommendations(result);
    setIsLoadingRecs(false);
  };

  const fetchNearbyPlaces = async (lat: number, lng: number) => {
    setIsLoadingMapData(true);
    const places = await getPlacesForMap(lat, lng);
    
    // Mevcut 'rider' markerlarını koru, yeni gelen yerleri ekle
    setMarkers(prev => {
      const riders = prev.filter(m => m.type === 'rider');
      return [...riders, ...places];
    });
    setIsLoadingMapData(false);
  };

  // Harita her kaydırıldığında değil, kullanıcı butona basınca ara
  const handleSearchArea = () => {
    fetchNearbyPlaces(mapCenter[0], mapCenter[1]);
  };

  const filterConfig = [
    { key: 'rider', label: 'Sürücüler', icon: User, color: 'text-blue-500' },
    { key: 'event', label: 'Etkinlikler', icon: Zap, color: 'text-red-500' },
    { key: 'shop', label: 'Tamirciler', icon: Wrench, color: 'text-orange-500' },
    { key: 'cafe', label: 'Kafeler', icon: Coffee, color: 'text-amber-500' },
    { key: 'scenic', label: 'Manzara', icon: Mountain, color: 'text-emerald-500' },
    { key: 'hazard', label: 'Tehlikeler', icon: AlertTriangle, color: 'text-red-900' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in slide-in-from-bottom-6 duration-700 lg:h-[calc(100vh-12rem)]">
      {/* Yan Panel Kontrolleri */}
      <div className="w-full lg:w-96 flex flex-col gap-6 shrink-0">
        <div className="glass-card p-6 rounded-[2.5rem]">
          <div className="flex p-1.5 bg-white/5 rounded-2xl mb-6">
            <button 
              onClick={() => setActiveTab('map')}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'map' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-gray-500'}`}
            >
              Canlı Harita
            </button>
            <button 
              onClick={() => setActiveTab('routes')}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'routes' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-gray-500'}`}
            >
              Rotalar
            </button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Mekan veya sürücü ara..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:border-red-500/50 outline-none transition-all placeholder:text-gray-600"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Filtreler</h4>
              <Filter className="w-3 h-3 text-gray-600" />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {filterConfig.map((item) => (
                <button 
                  key={item.key}
                  onClick={() => toggleFilter(item.key as keyof typeof filters)}
                  className={`flex items-center justify-between p-3 rounded-2xl transition-all border ${
                    filters[item.key as keyof typeof filters] 
                      ? 'bg-white/10 border-white/10 text-white' 
                      : 'bg-transparent border-white/5 text-gray-600 opacity-50'
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className={`w-4 h-4 mr-2 ${filters[item.key as keyof typeof filters] ? item.color : 'text-gray-600'}`} />
                    <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
                  </div>
                  {filters[item.key as keyof typeof filters] && <Check className="w-3 h-3 text-emerald-500" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card p-7 rounded-[2.5rem] overflow-y-auto flex-1 border-t-4 border-t-yellow-500/20 max-h-[300px] lg:max-h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black italic tracking-tighter flex items-center text-lg">
              <Zap className="w-5 h-5 mr-3 text-yellow-500 fill-yellow-500" /> AI Rota Önerisi
            </h3>
            <button 
              onClick={handleGetAITips}
              disabled={isLoadingRecs}
              className="text-xs font-black text-red-500 hover:text-red-400 disabled:opacity-50 uppercase tracking-widest"
            >
              {isLoadingRecs ? "Düşünüyor..." : "Yenile"}
            </button>
          </div>
          <div className="text-xs text-gray-400 leading-relaxed font-medium italic whitespace-pre-wrap">
            {recommendations || "Bölgenizdeki manzaralı rotaları AI ile keşfetmek için yenile butonuna basın."}
          </div>
        </div>
      </div>

      {/* İnteraktif Harita Alanı */}
      <div className="w-full h-[500px] lg:h-auto lg:flex-1 glass-card rounded-[3rem] relative overflow-hidden bg-[#151515] border-white/5 group shadow-2xl z-0">
         <MapContainer 
           center={mapCenter} 
           zoom={13} 
           style={{ height: "100%", width: "100%", borderRadius: "3rem" }}
           zoomControl={false}
         >
            {/* Dark Mode Map Tiles */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            
            <MapController onMoveEnd={(center) => setMapCenter([center.lat, center.lng])} />

            {filteredMarkers.map((marker, idx) => {
              let iconHtml = icons.rider;
              let colorClass = 'bg-blue-600';

              switch(marker.type) {
                case 'shop': iconHtml = icons.shop; colorClass = 'bg-orange-600'; break;
                case 'cafe': iconHtml = icons.cafe; colorClass = 'bg-amber-600'; break;
                case 'scenic': iconHtml = icons.scenic; colorClass = 'bg-emerald-600'; break;
                case 'event': iconHtml = icons.event; colorClass = 'bg-red-600'; break;
                case 'hazard': iconHtml = icons.hazard; colorClass = 'bg-red-900'; break;
              }

              return (
                <Marker 
                  key={idx} 
                  position={[marker.lat, marker.lng]}
                  icon={createCustomIcon(iconHtml, colorClass)}
                >
                  <Popup className="bg-transparent border-none">
                    <div className="p-1">
                      <h3 className="font-black text-sm uppercase tracking-wider mb-1">{marker.title}</h3>
                      <p className="text-xs text-gray-300">{marker.description}</p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
         </MapContainer>

        {/* Harita Üstü Kontroller */}
        <div className="absolute bottom-8 right-8 flex flex-col gap-4 z-[500]">
          <button 
            onClick={handleSearchArea}
            disabled={isLoadingMapData}
            className="p-5 bg-red-600 text-white rounded-3xl shadow-2xl hover:bg-red-500 transition-all accent-glow active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group relative"
          >
            {isLoadingMapData ? (
               <Loader2 className="w-7 h-7 animate-spin" />
            ) : (
               <Search className="w-7 h-7" />
            )}
            <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black/80 px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Bu Alanda Ara
            </span>
          </button>
          
          <button className="p-5 bg-[#171717]/90 backdrop-blur-md border border-white/10 text-white rounded-3xl shadow-2xl hover:bg-white/5 transition-all active:scale-95">
            <Navigation className="w-7 h-7" />
          </button>
        </div>

        <div className="absolute top-8 left-8 space-y-3 z-[500]">
          <div className="bg-[#171717]/90 backdrop-blur-xl px-5 py-3 border border-white/10 rounded-[1.5rem] flex items-center shadow-2xl">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-3 animate-pulse"></div>
            <span className="text-xs font-black text-white uppercase tracking-widest">
              Haritada {filteredMarkers.length} Nokta
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMap;
