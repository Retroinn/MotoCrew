
import React, { useState, useEffect } from 'react';
import { User, Camera, Save, Bike, AlignLeft, Award, User as UserIcon } from 'lucide-react';
import { authService } from '../services/authService';
import { User as UserType } from '../types';

interface ProfileProps {
  user: UserType;
  onProfileUpdate: (user: UserType) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    nickname: user.nickname || '',
    motorcycleModel: user.motorcycleModel || '',
    bio: user.bio || '',
    experienceLevel: user.experienceLevel || 'Novice',
    avatar: user.avatar || ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    setFormData({
      name: user.name,
      nickname: user.nickname || '',
      motorcycleModel: user.motorcycleModel || '',
      bio: user.bio || '',
      experienceLevel: user.experienceLevel || 'Novice',
      avatar: user.avatar || ''
    });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const { user: updatedUser, error } = await authService.updateProfile(user.id, formData);
      if (error) {
        setMessage({ type: 'error', text: error });
      } else if (updatedUser) {
        setMessage({ type: 'success', text: 'Profil başarıyla güncellendi!' });
        onProfileUpdate(updatedUser);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Bir hata oluştu.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 animate-in fade-in duration-500">
      <div className="glass-card rounded-[3rem] p-8 lg:p-12 relative overflow-hidden">
        {/* Dekoratif Arka Plan */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 blur-[100px] rounded-full pointer-events-none"></div>

        <h2 className="text-3xl font-black italic tracking-tighter text-white mb-8">Profilini Düzenle</h2>

        {message && (
          <div className={`mb-8 p-4 rounded-2xl text-sm font-bold flex items-center ${
            message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Avatar Bölümü */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-red-500 to-orange-500 shadow-xl shadow-red-500/20">
                <div className="w-full h-full rounded-full bg-[#111] overflow-hidden flex items-center justify-center">
                   {formData.avatar ? (
                     <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                   ) : (
                     <User className="w-12 h-12 text-gray-500" />
                   )}
                </div>
              </div>
              <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-white text-black p-3 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg">
                <Camera className="w-5 h-5" />
                <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            </div>
            <p className="mt-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Profil Fotoğrafını Değiştir</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center">
                <UserIcon className="w-4 h-4 mr-2" /> Ad Soyad
              </label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-red-500/50 outline-none transition-all font-bold"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center">
                <Award className="w-4 h-4 mr-2" /> Takma Ad (Nickname)
              </label>
              <input 
                type="text" 
                name="nickname" 
                value={formData.nickname} 
                onChange={handleChange}
                placeholder="Örn: YolCanavarı"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-red-500/50 outline-none transition-all font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center">
                <Bike className="w-4 h-4 mr-2" /> Motosiklet Modeli
              </label>
              <input 
                type="text" 
                name="motorcycleModel" 
                value={formData.motorcycleModel} 
                onChange={handleChange}
                placeholder="Örn: Yamaha MT-07"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-red-500/50 outline-none transition-all font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center">
                <Award className="w-4 h-4 mr-2" /> Deneyim Seviyesi
              </label>
              <select 
                name="experienceLevel" 
                value={formData.experienceLevel} 
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-red-500/50 outline-none transition-all font-bold appearance-none"
              >
                <option value="Novice">Acemi</option>
                <option value="Intermediate">Orta Seviye</option>
                <option value="Expert">Uzman</option>
                <option value="Veteran">Veteran</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center">
              <AlignLeft className="w-4 h-4 mr-2" /> Hakkında (Bio)
            </label>
            <textarea 
              name="bio" 
              rows={4}
              value={formData.bio} 
              onChange={handleChange}
              placeholder="Kendinden ve sürüş tutkundan bahset..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-red-500/50 outline-none transition-all font-bold resize-none"
            />
          </div>

          <div className="flex justify-end pt-6">
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-red-500/20 transition-all flex items-center disabled:opacity-50 active:scale-95"
            >
              <Save className="w-5 h-5 mr-3" />
              {isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
