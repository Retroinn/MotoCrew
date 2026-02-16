
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Notification } from '../types';

const NOTIFICATION_STORAGE_KEY = 'moto_crew_notifications';

const INITIAL_MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    userId: 'global', // Herkese görünür
    type: 'EVENT',
    title: 'Sezon Açılış Sürüşü',
    message: 'Bu pazar Belgrad Ormanı sürüşü için teker dönüyor! Hazır mısın?',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    id: '2',
    userId: 'mock-123',
    type: 'SYSTEM',
    title: 'Hoş Geldin!',
    message: 'Y&E Moto Crew ailesine katıldığın için teşekkürler. Profilini tamamlamayı unutma!',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  }
];

// Helper: LocalStorage'dan veriyi al
const getStoredNotifications = (): Notification[] => {
  const stored = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_NOTIFICATIONS));
    return INITIAL_MOCK_NOTIFICATIONS;
  }
  return JSON.parse(stored);
};

export const notificationService = {
  getNotifications: async (userId: string): Promise<Notification[]> => {
    if (isSupabaseConfigured() && supabase) {
      // Supabase implementation (gerçek veritabanı)
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .or(`user_id.eq.${userId},user_id.eq.global`)
        .order('created_at', { ascending: false });
      return (data as Notification[]) || [];
    } else {
      // Mock / LocalStorage implementation
      const allNotifications = getStoredNotifications();
      // Kullanıcıya özel olanlar VEYA Global olanlar
      return allNotifications
        .filter(n => n.userId === userId || n.userId === 'global')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  },

  markAsRead: async (notificationId: string) => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('notifications').update({ read: true }).eq('id', notificationId);
    } else {
      const allNotifications = getStoredNotifications();
      const updated = allNotifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(updated));
    }
  },

  markAllAsRead: async (userId: string) => {
    if (isSupabaseConfigured() && supabase) {
      await supabase
        .from('notifications')
        .update({ read: true })
        .or(`user_id.eq.${userId},user_id.eq.global`);
    } else {
      const allNotifications = getStoredNotifications();
      const updated = allNotifications.map(n => 
        (n.userId === userId || n.userId === 'global') ? { ...n, read: true } : n
      );
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(updated));
    }
  },

  // Yeni: Tüm kullanıcılara bildirim gönder
  sendGlobalNotification: async (title: string, message: string, type: 'EVENT' | 'SYSTEM' | 'INVITE' | 'ALERT') => {
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      userId: 'global',
      type,
      title,
      message,
      read: false,
      createdAt: new Date().toISOString()
    };

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('notifications').insert(newNotification);
    } else {
      const allNotifications = getStoredNotifications();
      const updated = [newNotification, ...allNotifications];
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(updated));
      
      // Simüle edilmiş bir gecikme (gerçekçilik için)
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    return newNotification;
  }
};
