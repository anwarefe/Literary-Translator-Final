import { createClient } from '@supabase/supabase-js';

// 🔑 استخدام مفاتيح Supabase من بيئة Vite/Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ✅ التأكد من إعداد المفاتيح
export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

// 🚀 إنشاء عميل Supabase
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
      options: {
        data: {
          first_name: firstName, // إضافة الاسم الأول في البيانات الوصفية للمستخدم
          last_name: lastName,   // إضافة اللقب في البيانات الوصفية للمستخدم
        },
      },
    });

    if (error) {
      console.error("Sign-up error:", error.message);
      throw error;
    }

    const user = data.user;

    // تأكد من أن المستخدم تم إنشاؤه بنجاح
    if (!user?.id) {
      throw new Error("User ID was not returned from sign-up.");
    }

    // 2) إضافة البيانات إلى جدول profiles
    const username = `${firstName} ${lastName}`.trim();  // اجمع الاسم الأول واللقب في username

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,            // id المستخدم من Supabase
        email,                  // البريد الإلكتروني
        username,               // الاسم الكامل
        plan: "trial",          // الخطة الافتراضية هي "trial"
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

