
import React from 'react';
import { 
  TrendingUp, 
  Users, 
  MapPin, 
  Calendar,
  ChevronRight,
  ArrowUpRight,
  Plus,
  Clock,
  Navigation
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const stats = [
  { label: 'Aktif Sürücüler', value: '1.284', change: '+%12', icon: Users, color: 'text-blue-500' },
  { label: 'Gelecek Sürüşler', value: '24', change: '+2', icon: Calendar, color: 'text-red-500' },
  { label: 'Popüler Mekanlar', value: '156', change: '+45', icon: MapPin, color: 'text-orange-500' },
  { label: 'Crew Puanı', value: '45.2k', change: '+1.4k', icon: TrendingUp, color: 'text-emerald-500' },
];

const activityData = [
  { name: 'Pzt', riders: 400 },
  { name: 'Sal', riders: 300 },
  { name: 'Çar', riders: 500 },
  { name: 'Per', riders: 450 },
  { name: 'Cum', riders: 800 },
  { name: 'Cmt', riders: 1200 },
  { name: 'Paz', riders: 1100 },
];

const upcomingRides = [
  {
    id: 1,
    title: 'Kıyı Şeridi Turu',
    date: '12 Kasım 2024',
    time: '08:30',
    location: 'Beşiktaş İskele',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=2070',
    participants: 42
  },
  {
    id: 2,
    title: 'Gece Kartalları Buluşması',
    date: '14 Kasım 2024',
    time: '21:00',
    location: 'Bağdat Caddesi',
    image: 'https://images.unsplash.com/photo-1625043484555-47841a752840?auto=format&fit=crop&q=80&w=2070',
    participants: 18
  }
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card p-6 rounded-[2rem] hover:border-white/20 transition-all cursor-default group hover:bg-white/[0.03]">
            <div className="flex items-center justify-between mb-5">
              <div className={`p-4 rounded-2xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform shadow-inner`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-black text-emerald-400 flex items-center bg-emerald-400/10 px-2 py-1 rounded-lg">
                {stat.change} <ArrowUpRight className="w-3 h-3 ml-1" />
              </span>
            </div>
            <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest">{stat.label}</h3>
            <p className="text-3xl font-black text-white mt-1 italic tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Aktivite Grafiği */}
        <div className="lg:col-span-2 glass-card p-8 rounded-[2.5rem]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black italic tracking-tighter">Crew Aktivitesi</h3>
            <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:border-red-500/50 appearance-none cursor-pointer">
              <option>Son 7 Gün</option>
              <option>Son 30 Gün</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorRiders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12, fontWeight: 'bold'}} dy={15} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171717', border: '1px solid #404040', borderRadius: '16px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#f3f4f6' }}
                />
                <Area type="monotone" dataKey="riders" stroke="#ef4444" strokeWidth={4} fillOpacity={1} fill="url(#colorRiders)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hızlı İşlemler ve Yaklaşan Sürüşler */}
        <div className="space-y-8">
          <div className="glass-card p-8 rounded-[2.5rem]">
            <h3 className="text-xl font-black italic tracking-tighter mb-6">Hızlı İşlemler</h3>
            <div className="grid grid-cols-1 gap-4">
              <button className="flex items-center justify-between p-5 bg-red-500 hover:bg-red-600 text-white rounded-[1.5rem] transition-all shadow-xl shadow-red-500/30 font-black italic group">
                <span className="flex items-center">
                  <Plus className="w-6 h-6 mr-4" /> Yeni Sürüş Oluştur
                </span>
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 text-white rounded-[1.5rem] transition-all border border-white/5 font-black italic group">
                <span className="flex items-center">
                  <MapPin className="w-6 h-6 mr-4" /> Tehlike Bildir
                </span>
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black italic tracking-tighter">Yaklaşan Sürüşler</h3>
              <button className="text-xs font-bold text-gray-500 hover:text-white uppercase tracking-widest">Tümü</button>
            </div>
            
            <div className="space-y-6">
              {upcomingRides.map((ride) => (
                <div key={ride.id} className="group cursor-pointer">
                  <div className="relative h-32 rounded-2xl overflow-hidden mb-4">
                    <img src={ride.image} alt={ride.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <h4 className="font-black italic text-lg leading-tight">{ride.title}</h4>
                      <p className="text-[10px] uppercase font-bold text-gray-300 tracking-widest mt-1">{ride.participants} Katılımcı</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 px-1">
                    <div className="flex items-center justify-between text-sm text-gray-400 font-medium">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-red-500" />
                        {ride.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-red-500" />
                        {ride.time}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-400 font-medium">
                      <MapPin className="w-4 h-4 mr-2 text-red-500" />
                      {ride.location}
                    </div>

                    <button className="w-full py-3 mt-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-black uppercase tracking-widest text-xs flex items-center justify-center transition-all hover:border-red-500/50">
                      Sürüşe Katıl <Navigation className="w-3 h-3 ml-2" />
                    </button>
                  </div>
                  
                  {/* Divider except last item */}
                  {ride.id !== upcomingRides[upcomingRides.length - 1].id && (
                    <div className="border-t border-white/5 mt-6"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
