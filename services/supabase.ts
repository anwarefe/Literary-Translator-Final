import { createClient } from '@supabase/supabase-js';

// 🔑 نستخدم الطريقة الصحيحة للوصول للمفاتيح العامة في بيئة Vercel/Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ✅ منطق المرونة: التحقق من أن المفاتيح موجودة
export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

// تهيئة العميل (Client Initialization)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// دالة التسجيل
export const signUpUser = async (email: string, password: string, firstName: string, lastName: string) => {
  const { user, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Error during sign-up:', error.message);
    throw error;
  }

  // إضافة الاسم الأول واللقب إلى جدول profiles
  const { data, profileError } = await supabase
    .from('profiles')
    .upsert({
      id: user?.id,
      email,
      first_name: firstName,
      last_name: lastName,
    });

  if (profileError) {
    console.error('Error creating profile:', profileError.message);
    throw profileError;
  }

  return user;
};
