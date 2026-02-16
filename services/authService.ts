
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User, UserRole, MembershipPlan } from '../types';

// Mock (Yerel) Depolama Yardımcıları
const MOCK_STORAGE_KEY = 'moto_crew_user';

export const authService = {
  // Mevcut oturumu al
  getSession: async (): Promise<User | null> => {
    if (isSupabaseConfigured() && supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Profil tablosundan ek verileri çek
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        return {
          id: session.user.id,
          email: session.user.email!,
          name: profile?.name || session.user.user_metadata?.name || 'Üye',
          role: profile?.role || UserRole.MEMBER,
          membershipPlan: profile?.membership_plan || MembershipPlan.FREE,
          points: profile?.points || 0,
          nickname: profile?.nickname || '',
          motorcycleModel: profile?.motorcycle_model || 'Belirtilmedi',
          experienceLevel: profile?.experience_level || 'Novice',
          avatar: profile?.avatar_url || session.user.user_metadata?.avatar_url || '',
          bio: profile?.bio || '',
          badges: profile?.badges || []
        };
      }
      return null;
    } else {
      // Mock Modu
      const stored = localStorage.getItem(MOCK_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    }
  },

  // Giriş Yap
  signIn: async (email: string, password: string): Promise<{ user: User | null; error: string | null }> => {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { user: null, error: error.message };
      
      const user = await authService.getSession(); 
      return { user, error: null };
    } else {
      // Mock Login
      console.warn("Supabase yapılandırılmadı. Mock Login kullanılıyor.");
      // Basit bir gecikme simülasyonu
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockUser: User = {
        id: 'mock-123',
        email,
        name: 'Demo Kullanıcı',
        role: UserRole.MEMBER,
        membershipPlan: MembershipPlan.FREE,
        points: 150,
        nickname: 'RiderTR',
        motorcycleModel: 'Yamaha MT-07',
        experienceLevel: 'Intermediate',
        avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D',
        bio: 'Yol tutkunu. Rüzgarı hissetmeyi severim.',
        badges: []
      };
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(mockUser));
      return { user: mockUser, error: null };
    }
  },

  // Kayıt Ol
  signUp: async (email: string, password: string, name: string): Promise<{ user: User | null; error: string | null }> => {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name: name }
        }
      });
      
      if (error) return { user: null, error: error.message };
      
      if (data.user && !data.session) {
         return { user: null, error: "Kayıt başarılı! Lütfen e-posta adresinizi onaylayın." };
      }

      const user = await authService.getSession();
      return { user, error: null };
    } else {
      // Mock Signup
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockUser: User = {
        id: `mock-${Date.now()}`,
        email,
        name,
        role: UserRole.MEMBER,
        membershipPlan: MembershipPlan.FREE,
        points: 0,
        nickname: '',
        motorcycleModel: '',
        experienceLevel: 'Novice',
        avatar: '',
        bio: '',
        badges: []
      };
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(mockUser));
      return { user: mockUser, error: null };
    }
  },

  // Çıkış Yap
  signOut: async () => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(MOCK_STORAGE_KEY);
  },

  // Şifre Sıfırla
  resetPassword: async (email: string) => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { error: error?.message || null };
    }
    return { error: null };
  },

  // Google ile Giriş
  signInWithGoogle: async (): Promise<{ user: User | null; error: string | null }> => {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: window.location.origin
        },
      });
      
      if (error) return { user: null, error: error.message };
      
      // OAuth redirect işlemi başlatır, bu yüzden hemen user dönmez.
      return { user: null, error: null };
    } else {
      // Mock Google Login
      console.log("Supabase yok, Google Mock Login yapılıyor...");
      await new Promise(resolve => setTimeout(resolve, 1500)); // Google'a gidip geliyormuş gibi bekle

      const googleMockUser: User = {
        id: 'google-mock-user-1',
        email: 'google.demo@motocrew.app',
        name: 'Google User',
        role: UserRole.MEMBER,
        membershipPlan: MembershipPlan.PREMIUM, // Google ile gelenlere kıyak geçelim
        points: 850,
        nickname: 'G-Moto',
        motorcycleModel: 'Ducati Panigale V4',
        experienceLevel: 'Expert',
        // Google benzeri varsayılan avatar veya güzel bir görsel
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop',
        bio: 'Google hesabı ile giriş yapıldı.',
        badges: ['Doğrulanmış Hesap', 'Premium Üye']
      };

      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(googleMockUser));
      return { user: googleMockUser, error: null };
    }
  },

  // Profili Güncelle
  updateProfile: async (userId: string, updates: Partial<User>): Promise<{ user: User | null; error: string | null }> => {
    if (isSupabaseConfigured() && supabase) {
      // Supabase'de profile tablosunu güncelle
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          nickname: updates.nickname,
          motorcycle_model: updates.motorcycleModel,
          bio: updates.bio,
          avatar_url: updates.avatar,
          experience_level: updates.experienceLevel
        })
        .eq('id', userId);
      
      if (error) return { user: null, error: error.message };
      const updatedUser = await authService.getSession();
      return { user: updatedUser, error: null };
    } else {
      // Mock Update
      const stored = localStorage.getItem(MOCK_STORAGE_KEY);
      if (stored) {
        const currentUser = JSON.parse(stored);
        const updatedUser = { ...currentUser, ...updates };
        localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(updatedUser));
        return { user: updatedUser, error: null };
      }
      return { user: null, error: "Kullanıcı bulunamadı" };
    }
  }
};
