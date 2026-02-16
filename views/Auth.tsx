
import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';

interface AuthProps {
  onLogin: (userData: any) => void;
}

const GoogleIcon = () => (
  <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
    <path d="M12 4.63c1.69 0 3.21.58 4.41 1.72l3.3-3.3C17.46 1.14 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (isForgotPassword) {
        const { error } = await authService.resetPassword(email);
        if (error) {
          setError(error);
        } else {
          setSuccessMessage('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
          setTimeout(() => {
            setIsForgotPassword(false);
            setIsLogin(true);
            setSuccessMessage(null);
          }, 3000);
        }
      } else if (isLogin) {
        const { user, error } = await authService.signIn(email, password);
        if (error) {
          setError(error === "Invalid login credentials" ? "Hatalı e-posta veya şifre." : error);
        } else if (user) {
          onLogin(user);
        }
      } else {
        // Sign Up
        const { user, error } = await authService.signUp(email, password, name);
        if (error) {
           setError(error);
        } else if (user) {
           onLogin(user);
        } else {
           setSuccessMessage("Kayıt başarılı! Lütfen e-posta kutunuzu kontrol ederek hesabınızı onaylayın.");
           setIsLogin(true);
        }
      }
    } catch (err) {
      setError("Beklenmedik bir hata oluştu.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsGoogleLoading(true);
    try {
      const { user, error } = await authService.signInWithGoogle();
      if (error) {
        setError(error);
      } else if (user) {
        onLogin(user);
      }
    } catch (err) {
      setError("Google ile giriş yapılırken bir hata oluştu.");
      console.error(err);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4 relative overflow-hidden">
      {/* Dekoratif Arka Plan */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black italic tracking-tighter text-white mb-2">
            Y&E <span className="text-red-500">MOTO</span> CREW
          </h1>
          <p className="text-gray-400 font-medium tracking-tight">Sürüş Tutkusunun Dijital Merkezi</p>
        </div>

        <div className="glass-card p-8 rounded-[2.5rem] border-white/10 shadow-2xl">
          
          {/* Hata / Başarı Mesajları */}
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl flex items-center text-xs font-bold animate-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
              {error}
            </div>
          )}
          {successMessage && (
            <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-3 rounded-xl flex items-center text-xs font-bold animate-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
              {successMessage}
            </div>
          )}

          {!isForgotPassword ? (
            <>
              <div className="flex mb-8 bg-white/5 p-1.5 rounded-2xl">
                <button 
                  onClick={() => { setIsLogin(true); setError(null); }}
                  className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${isLogin ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-gray-500'}`}
                >
                  Giriş Yap
                </button>
                <button 
                  onClick={() => { setIsLogin(false); setError(null); }}
                  className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${!isLogin ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-gray-500'}`}
                >
                  Kayıt Ol
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Ad Soyad" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-red-500/50 outline-none transition-all font-medium"
                      required
                    />
                  </div>
                )}
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                  <input 
                    type="email" 
                    placeholder="E-posta Adresi" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-red-500/50 outline-none transition-all font-medium"
                    required
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                  <input 
                    type="password" 
                    placeholder="Şifre" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-red-500/50 outline-none transition-all font-medium"
                    required
                    minLength={6}
                  />
                </div>

                {isLogin && (
                  <div className="flex justify-end">
                    <button 
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-xs font-black text-gray-500 hover:text-red-500 uppercase tracking-widest transition-colors"
                    >
                      Şifremi Unuttum?
                    </button>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isLoading || isGoogleLoading}
                  className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-red-500/20 transition-all flex items-center justify-center group text-xs active:scale-[0.98]"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {isLogin ? 'Giriş Yap' : 'Hesap Oluştur'}
                      <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8">
                <div className="relative flex items-center justify-center mb-6">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                  <span className="relative px-4 bg-[#171717] text-[10px] text-gray-600 uppercase tracking-[0.2em] font-black">Veya şununla devam et</span>
                </div>
                
                <button 
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading || isLoading}
                  className="w-full flex items-center justify-center py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-xs font-black text-white uppercase tracking-widest active:scale-[0.98] disabled:opacity-50"
                >
                  {isGoogleLoading ? (
                    <Loader2 className="w-4 h-4 mr-3 animate-spin" />
                  ) : (
                    <GoogleIcon />
                  )}
                  Google ile Giriş Yap
                </button>
              </div>
            </>
          ) : (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <button 
                onClick={() => setIsForgotPassword(false)}
                className="flex items-center text-xs font-black text-gray-500 hover:text-white uppercase tracking-widest mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Geri Dön
              </button>
              <h2 className="text-xl font-black italic tracking-tighter text-white mb-2">Şifremi Unuttum</h2>
              <p className="text-gray-500 text-sm mb-6 font-medium">E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                  <input 
                    type="email" 
                    placeholder="E-posta Adresi" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-red-500/50 outline-none transition-all font-medium"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-red-500/20 transition-all flex items-center justify-center group text-xs"
                >
                   {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Bağlantı Gönder
                      <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          <p className="mt-10 text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest">
            Devam ederek, <span className="text-gray-400 underline cursor-pointer hover:text-red-500 transition-colors">Hizmet Şartlarımızı</span> ve <span className="text-gray-400 underline cursor-pointer hover:text-red-500 transition-colors">Gizlilik Politikamızı</span> kabul etmiş olursunuz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
