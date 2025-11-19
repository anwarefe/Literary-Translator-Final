import { createClient } from '@supabase/supabase-js';

// 🔑 نستخدم الطريقة الصحيحة للوصول للمفاتيح العامة في بيئة Vercel/Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ✅ منطق المرونة: التحقق من أن المفاتيح موجودة
export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

// 🚀 تهيئة عميل Supabase
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// 🧾 دالة التسجيل مع حفظ الاسم الكامل في عمود username
export const signUpUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  try {
    // 1️⃣ تسجيل المستخدم باستخدام البريد الإلكتروني وكلمة المرور
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Error during sign-up:', error.message);
      throw error;
    }

    const userId = data.user?.id;
    if (!userId) {
      throw new Error('User ID was not returned from sign-up.');
    }

    // 2️⃣ تكوين الاسم الكامل من الاسم واللقب
    const fullName = `${firstName} ${lastName}`.trim();

    // 3️⃣ حفظ البيانات في جدول profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,       // نفس id المستخدم في auth.users
        email,            // البريد الإلكتروني
        username: fullName, // الاسم الكامل في عمود username
        // plan يظل بالقيمة الافتراضية trial من تعريف الجدول
      });

    if (profileError) {
      console.error('Error creating profile:', profileError.message);
      throw profileError;
    }

    return data.user;
  } catch (error) {
    console.error('Error during user sign up:', error);
    throw error;
  }
};
