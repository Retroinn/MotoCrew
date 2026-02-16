
import React, { useState } from 'react';
import { 
  Megaphone, 
  Send, 
  Bell, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Radio,
  Activity
} from 'lucide-react';
import { notificationService } from '../services/notificationService';

const Admin: React.FC = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'SYSTEM' | 'EVENT' | 'ALERT'>('SYSTEM');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('idle');

    try {
      await notificationService.sendGlobalNotification(title, message, type);
      setStatus('success');
      // Formu temizle
      setTitle('');
      setMessage('');
      
      // 3 saniye sonra başarı mesajını kaldır
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter text-white flex items-center">
            <ShieldCheck className="w-8 h-8 mr-3 text-red-500" /> Komuta Merkezi
          </h2>
          <p className="text-gray-500 text-sm mt-1 font-medium">Sistem yönetimi ve topluluk duyuruları.</p>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Sistem Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Bildirim Gönderme Paneli */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-[2.5rem] p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[80px] rounded-full pointer-events-none"></div>
            
            <div className="flex items-center mb-8">
              <div className="p-3 bg-white/5 rounded-2xl mr-4">
                <Megaphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white italic tracking-tighter">Toplu Bildirim Gönder</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Tüm üyelere anlık duyuru ilet</p>
              </div>
            </div>

            <form onSubmit={handleSendNotification} className="space-y-6">
              {/* Tip Seçimi */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'SYSTEM', label: 'Sistem', icon: Bell, color: 'blue' },
                  { id: 'EVENT', label: 'Etkinlik', icon: Activity, color: 'emerald' },
                  { id: 'ALERT', label: 'Acil Durum', icon: AlertTriangle, color: 'red' },
                ].map((option) => (
                  <label 
                    key={option.id}
                    className={`cursor-pointer group relative flex flex-col items-center p-4 rounded-2xl border transition-all ${
                      type === option.id 
                        ? `bg-${option.color}-500/20 border-${option.color}-500 text-white` 
                        : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="type" 
                      value={option.id} 
                      checked={type === option.id}
                      onChange={(e) => setType(e.target.value as any)}
                      className="hidden" 
                    />
                    <option.icon className={`w-6 h-6 mb-2 ${type === option.id ? `text-${option.color}-500` : 'text-gray-500 group-hover:text-gray-300'}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{option.label}</span>
                  </label>
                ))}
              </div>

              {/* Inputlar */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Bildirim Başlığı</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Örn: Hafta Sonu Sürüşü Hakkında"
                    className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-red-500/50 outline-none transition-all font-bold placeholder:text-gray-600"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Mesaj İçeriği</label>
                  <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Duyuru detaylarını buraya yazın..."
                    rows={4}
                    className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-red-500/50 outline-none transition-all font-bold resize-none placeholder:text-gray-600"
                    required
                  />
                </div>
              </div>

              {/* Feedback Mesajı */}
              {status === 'success' && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-2xl flex items-center animate-in slide-in-from-top-2">
                  <CheckCircle2 className="w-5 h-5 mr-3" />
                  <span className="text-sm font-bold">Bildirim başarıyla tüm üyelere gönderildi!</span>
                </div>
              )}
              
              {status === 'error' && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-center animate-in slide-in-from-top-2">
                  <AlertTriangle className="w-5 h-5 mr-3" />
                  <span className="text-sm font-bold">Bir hata oluştu. Lütfen tekrar deneyin.</span>
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-white text-black hover:bg-gray-200 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all flex items-center justify-center group active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-3"></div>
                    Gönderiliyor...
                  </span>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" />
                    Bildirimi Yayınla
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Yan İstatistik Paneli */}
        <div className="space-y-6">
          <div className="glass-card rounded-[2.5rem] p-8">
             <h3 className="text-lg font-black italic tracking-tighter text-white mb-6">Sistem Özeti</h3>
             <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-500/20 rounded-lg mr-3">
                      <Users className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Toplam Üye</p>
                      <p className="text-xl font-black text-white">1,284</p>
                    </div>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-500/20 rounded-lg mr-3">
                      <Radio className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Aktif Oturum</p>
                      <p className="text-xl font-black text-white">342</p>
                    </div>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-500/20 rounded-lg mr-3">
                      <Bell className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Günlük Bildirim</p>
                      <p className="text-xl font-black text-white">12.5k</p>
                    </div>
                  </div>
                </div>
             </div>
          </div>

          <div className="glass-card rounded-[2.5rem] p-8 bg-gradient-to-br from-red-900/20 to-black border-red-500/20">
            <h3 className="text-lg font-black italic tracking-tighter text-white mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
              Acil Durum Modu
            </h3>
            <p className="text-xs text-gray-400 font-medium leading-relaxed mb-6">
              Bu mod, tüm kullanıcıların ekranına kapatılamayan bir uyarı penceresi gönderir. Sadece kritik durumlarda kullanın.
            </p>
            <button className="w-full py-3 bg-red-500/10 hover:bg-red-500 border border-red-500 text-red-500 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">
              Acil Durum Yayınla
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
