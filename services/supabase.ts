import { createClient } from '@supabase/supabase-js';

// 🔑 استخدام مفاتيح Supabase من بيئة Vite/Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ✅ التحقق من أن إعدادات Supabase موجودة
export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

// 🚀 إنشاء عميل Supabase
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// 🧾 دالة التسجيل (Sign Up)
// لا تلمس جدول profiles هنا — فقط تسجل المستخدم وترسل الاسم في metadata
export const signUpUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  const fullName = `${firstName} ${lastName}`.trim();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) {
    console.error('Sign-up error:', error.message);
    throw error;
  }

  return data.user;
};
