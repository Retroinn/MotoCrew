
import React from 'react';
import { 
  Shield, 
  CheckCircle2, 
  QrCode, 
  Crown, 
  Star,
  Award,
  Zap,
  ChevronRight
} from 'lucide-react';

const Membership: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-16 py-10 animate-in zoom-in-95 duration-700">
      <div className="flex flex-col lg:flex-row gap-16">
        
        {/* Dijital Üyelik Kartı */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <h3 className="text-2xl font-black italic tracking-tighter mb-8 self-start">Dijital Crew Kartın</h3>
          <div className="relative w-full aspect-[1.6/1] rounded-[3rem] bg-gradient-to-br from-[#171717] via-[#262626] to-[#0a0a0a] border border-white/10 p-10 shadow-2xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/10 blur-[80px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/5 blur-[80px] rounded-full"></div>
            
            <div className="h-full flex flex-col justify-between relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-3xl font-black italic tracking-tighter text-white">Y&E <span className="text-red-500">MOTO</span></h4>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.3em] mt-2">Resmi Kulüp Üyesi</p>
                </div>
                <div className="bg-red-500/20 text-red-500 px-4 py-1.5 rounded-full text-[10px] font-black border border-red-500/30 flex items-center tracking-widest">
                  <Star className="w-3.5 h-3.5 mr-2 fill-red-500" /> PREMIUM
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest">Üye Adı</p>
                    <p className="text-2xl font-black text-white italic tracking-tighter">JOHN DOE</p>
                  </div>
                  <div className="flex space-x-12">
                    <div>
                      <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest">Katılım</p>
                      <p className="text-sm font-black text-white uppercase">EKİM 2023</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest">ID Numarası</p>
                      <p className="text-sm font-black text-white tracking-widest">#YE-48291</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-[1.5rem] hover:scale-110 transition-transform cursor-pointer shadow-2xl">
                  <QrCode className="w-20 h-20 text-black" />
                </div>
              </div>
            </div>
          </div>
          <p className="mt-8 text-sm text-gray-500 text-center px-12 italic font-medium">
            Anlaşmalı mağazalarda özel indirimler ve sürüş check-in'leri için bu kartı gösterin.
          </p>
        </div>

        {/* Oyunlaştırma & Puanlar */}
        <div className="w-full lg:w-1/2 space-y-8">
          <h3 className="text-2xl font-black italic tracking-tighter">Crew Gelişimi</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="glass-card p-7 rounded-[2.5rem]">
              <div className="flex items-center text-orange-500 mb-3">
                <Award className="w-6 h-6 mr-3" />
                <span className="text-xs font-black uppercase tracking-widest">Sürüş Puanı</span>
              </div>
              <p className="text-3xl font-black text-white italic tracking-tighter">2.850</p>
              <div className="w-full bg-white/5 rounded-full h-2 mt-5">
                <div className="bg-gradient-to-r from-orange-600 to-orange-400 h-2 rounded-full w-[65%]"></div>
              </div>
              <p className="text-[10px] text-gray-500 mt-3 font-black uppercase tracking-widest">Sonraki seviyeye 1.150 puan kaldı</p>
            </div>
            <div className="glass-card p-7 rounded-[2.5rem]">
              <div className="flex items-center text-red-500 mb-3">
                <Shield className="w-6 h-6 mr-3" />
                <span className="text-xs font-black uppercase tracking-widest">Başarılar</span>
              </div>
              <p className="text-3xl font-black text-white italic tracking-tighter">12 / 50</p>
              <div className="flex -space-x-2 mt-5">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-lg group">
                    <Zap className="w-4 h-4 text-yellow-500 group-hover:scale-125 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] border-t-4 border-t-red-500/30">
            <h4 className="font-black italic tracking-tighter text-xl mb-6 flex items-center">
              <Crown className="w-6 h-6 mr-3 text-yellow-500" /> Üyelik Ayrıcalıkları
            </h4>
            <div className="space-y-5">
              {[
                "Moto Hub servislerinde %15 indirim",
                "VIP Sürüş Etkinliklerine öncelikli katılım",
                "Özel Crew ekipmanlarına erişim",
                "Reklamsız Sosyal Harita deneyimi"
              ].map((perk, idx) => (
                <div key={idx} className="flex items-center text-sm text-gray-300 font-medium">
                  <CheckCircle2 className="w-5 h-5 mr-4 text-emerald-500 shrink-0" />
                  {perk}
                </div>
              ))}
            </div>
            <button className="w-full mt-10 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center group text-xs">
              Tüm Avantajları Gör <ChevronRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Planlar Bölümü */}
      <section className="pt-10">
        <h3 className="text-4xl font-black italic tracking-tighter text-center mb-16">Üyeliğini Yükselt</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Ücretsiz', price: '0₺', features: ['Sosyal Harita Erişimi', 'Halka Açık Sürüşler', 'Üye Profili'], accent: 'gray' },
            { name: 'Premium', price: '299₺', features: ['Tüm Ücretsiz özellikler', 'Tehlike Bildirimi', 'Mağaza İndirimleri', 'Özel Etkinlikler'], accent: 'red', popular: true },
            { name: 'VIP Crew', price: '749₺', features: ['Tüm Premium özellikler', 'Kişisel Rota Oluşturucu', 'Erken Katılım Hakkı', 'Özel Profil Rozeti'], accent: 'orange' },
          ].map((plan, idx) => (
            <div key={idx} className={`glass-card p-10 rounded-[3rem] border-2 transition-all relative ${plan.popular ? 'border-red-500 scale-105 z-10 bg-red-500/[0.03] shadow-2xl' : 'border-white/5 opacity-80'}`}>
              {plan.popular && (
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.3em] px-6 py-2 rounded-full shadow-xl">En Popüler</span>
              )}
              <h4 className="text-2xl font-black italic tracking-tighter mb-2">{plan.name}</h4>
              <div className="flex items-baseline mb-8">
                <span className="text-4xl font-black text-white italic tracking-tighter">{plan.price}</span>
                <span className="text-gray-500 text-xs font-bold ml-2 uppercase tracking-widest">/ Ay</span>
              </div>
              <ul className="space-y-5 mb-10">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center text-sm text-gray-400 font-bold">
                    <CheckCircle2 className="w-4 h-4 mr-4 text-gray-600" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-widest transition-all text-xs ${plan.accent === 'red' ? 'bg-red-500 text-white hover:bg-red-600 shadow-xl shadow-red-500/30' : 'bg-white/5 text-white hover:bg-white/10'}`}>
                {plan.price === '0₺' ? 'Mevcut Planın' : `${plan.name}'a Geç`}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Membership;
