
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import SocialMap from './views/SocialMap';
import Membership from './views/Membership';
import Auth from './views/Auth';
import Profile from './views/Profile';
import Admin from './views/Admin';
import { authService } from './services/authService';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { Loader2 } from 'lucide-react';

const Members = () => <div className="p-10 text-center text-gray-500 italic font-bold">Üye Rehberi Modülü (Yakında)</div>;
const Events = () => <div className="p-10 text-center text-gray-500 italic font-bold">Etkinlik Katılım Sistemi (Yakında)</div>;

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // Başlangıç oturumunu kontrol et
      const currentUser = await authService.getSession();
      setUser(currentUser);
      setLoading(false);

      // Eğer Supabase aktifse, realtime değişiklikleri dinle
      if (isSupabaseConfigured() && supabase) {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
             // Oturum açıldığında güncel profil verisini çekmek için servisi kullan
             const updatedUser = await authService.getSession();
             setUser(updatedUser);
          } else if (event === 'SIGNED_OUT') {
             setUser(null);
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      }
    };

    initAuth();
  }, []);

  const handleLogin = (userData: any) => {
    // Auth componentinden manuel tetikleme (Mock mod veya signup sonrası anlık update için)
    setUser(userData);
  };

  const handleLogout = async () => {
    await authService.signOut();
    setUser(null);
  };
  
  const handleProfileUpdate = (updatedUser: any) => {
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/map" element={<SocialMap />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/profile" element={<Profile user={user} onProfileUpdate={handleProfileUpdate} />} />
          <Route path="/members" element={<Members />} />
          <Route path="/events" element={<Events />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
