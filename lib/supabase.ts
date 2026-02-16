
import { createClient } from '@supabase/supabase-js';

// NOT: Kendi Supabase projenizden aldığınız URL ve ANON KEY'i buraya yapıştırın.
// Eğer burası boş kalırsa veya placeholder değerler durursa, uygulama otomatik olarak
// "Mock Modu"na geçecek ve localStorage kullanacaktır.
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_KEY || 'your-anon-key';

// Anahtar kontrolü: Gerçek anahtarlar girilmemişse null döner
const isConfigured = SUPABASE_URL !== 'https://your-project.supabase.co' && SUPABASE_ANON_KEY !== 'your-anon-key';

export const supabase = isConfigured 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

export const isSupabaseConfigured = () => isConfigured;
