import { createClient } from '@supabase/supabase-js';

// 🔑 نستخدم الطريقة الصحيحة للوصول للمفاتيح العامة في بيئة Vercel/Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ✅ منطق المرونة: التحقق من أن المفاتيح موجودة
export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

// تهيئة العميل (Client Initialization)
// نستخدم الروابط الوهمية لمنع التطبيق من الانهيار في بيئة الاختبار (Sandbox)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
