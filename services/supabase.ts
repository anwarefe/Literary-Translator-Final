import { createClient } from '@supabase/supabase-js';

// 🔑 استخدام مفاتيح Supabase من بيئة Vite/Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

// إنشاء العميل
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// دالة التسجيل
export const signUpUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  try {
    // 1) إنشاء الحساب في Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Sign-up error:", error.message);
      throw error;
    }

    const user = data.user;

    // 2) إنشاء سجل في profiles
    const username = `${firstName} ${lastName}`.trim();

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: user?.id,
        email,
        username,        // ← الاسم الكامل هنا
        plan: "trial",   // ← مبدئياً يبدأ بخطة trial
      });

    if (profileError) {
      console.error("Profile insert error:", profileError.message);
      throw profileError;
    }

    return user;

  } catch (err) {
    console.error("Unexpected sign-up error:", err);
    throw err;
  }
};
