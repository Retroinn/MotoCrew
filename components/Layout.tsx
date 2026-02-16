
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Users, 
  Calendar, 
  ShieldCheck, 
  LogOut,
  Bell,
  Menu,
  X,
  CreditCard,
  User,
  Check
} from 'lucide-react';
import { notificationService } from '../services/notificationService';
import { Notification } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Panel', icon: LayoutDashboard, path: '/' },
    { name: 'Sosyal Harita', icon: MapIcon, path: '/map' },
    { name: 'Üyelik Kartım', icon: CreditCard, path: '/membership' },
    { name: 'Üyeler', icon: Users, path: '/members' },
    { name: 'Etkinlikler', icon: Calendar, path: '/events' },
    { name: 'Yönetim', icon: ShieldCheck, path: '/admin' },
  ];

  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await notificationService.getNotifications(user.id);
      setNotifications(data);
    };
    fetchNotifications();

    // Click outside handler
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [user.id]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead(user.id);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-gray-100 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#111111] border-r border-white/5">
        <div className="p-8">
          <h1 className="text-2xl font-black italic tracking-tighter text-white">
            Y&E <span className="text-red-500">MOTO</span> CREW
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center px-4 py-3.5 text-sm font-bold rounded-2xl transition-all duration-300
                ${isActive 
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'}
              `}
            >
              <item.icon className="w-5 h-5 mr-4" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button 
            onClick={onLogout}
            className="flex items-center w-full px-4 py-3.5 text-sm font-bold text-gray-500 hover:text-red-400 transition-all group"
          >
            <LogOut className="w-5 h-5 mr-4 group-hover:-translate-x-1 transition-transform" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <h1 className="text-xl font-black italic tracking-tighter text-white">
          Y&E <span className="text-red-500">MOTO</span>
        </h1>
        <div className="flex items-center space-x-3">
          <button 
             onClick={() => navigate('/profile')}
             className="p-2 text-gray-400 bg-white/5 rounded-xl"
          >
             <User className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-400 bg-white/5 rounded-xl"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0a0a0a] pt-24 px-6 lg:hidden animate-in fade-in slide-in-from-top duration-300">
          <nav className="space-y-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => `
                  flex items-center px-6 py-5 text-lg font-black rounded-2xl transition-all
                  ${isActive 
                    ? 'bg-red-500 text-white shadow-xl shadow-red-500/30' 
                    : 'bg-white/5 text-gray-400'}
                `}
              >
                <item.icon className="w-6 h-6 mr-5" />
                {item.name}
              </NavLink>
            ))}
            <div className="border-t border-white/10 my-4"></div>
            <button 
              onClick={() => navigate('/profile')}
              className="flex items-center w-full px-6 py-5 text-lg font-black rounded-2xl bg-white/5 text-gray-400"
            >
              <User className="w-6 h-6 mr-5" />
              Profilim
            </button>
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-auto pt-20 lg:pt-0 pb-20 lg:pb-0">
        <header className="hidden lg:flex items-center justify-between px-10 py-8 bg-transparent">
          <div>
            <h2 className="text-3xl font-black text-white font-heading">Hoş geldin, {user.name.split(' ')[0]}!</h2>
            <p className="text-gray-500 text-sm mt-1 font-medium italic">Yolun açık olsun, rüzgarın bol olsun.</p>
          </div>
          <div className="flex items-center space-x-6">
            
            {/* Notification Dropdown */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-gray-400 hover:text-white relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border border-[#111]"></span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 top-full mt-4 w-96 bg-[#171717] border border-white/10 rounded-[2rem] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Bildirimler</h3>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllRead} className="text-[10px] font-bold text-red-500 hover:text-red-400 uppercase tracking-widest">
                        Tümünü Oku
                      </button>
                    )}
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-500 text-xs font-bold">Bildiriminiz yok.</div>
                    ) : (
                      notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          className={`p-5 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group ${notif.read ? 'opacity-50' : 'opacity-100'}`}
                          onClick={() => handleMarkAsRead(notif.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-sm font-bold text-white mb-1 group-hover:text-red-500 transition-colors">{notif.title}</h4>
                              <p className="text-xs text-gray-400 leading-relaxed">{notif.message}</p>
                            </div>
                            {!notif.read && <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 ml-2"></div>}
                          </div>
                          <span className="text-[10px] text-gray-600 font-bold mt-2 block">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-white">{user.name}</span>
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{user.role}</span>
            </div>
            
            <button 
              onClick={() => navigate('/profile')}
              className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-orange-500 p-0.5 shadow-lg shadow-red-500/20 hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="w-full h-full rounded-[14px] bg-[#111] flex items-center justify-center font-black text-white text-lg overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt="Profil" className="w-full h-full object-cover" />
                ) : (
                  <img src={`https://i.pravatar.cc/150?u=${user.email}`} alt="Profil" />
                )}
              </div>
            </button>
          </div>
        </header>

        <div className="flex-1 px-6 lg:px-10 py-4">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-2xl border-t border-white/5 flex items-center justify-around py-4 px-2">
        {navItems.slice(0, 4).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center p-2 transition-all duration-300
              ${isActive ? 'text-red-500' : 'text-gray-500'}
            `}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] mt-1.5 font-bold uppercase tracking-tighter">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
