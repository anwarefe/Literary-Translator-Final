// دالة التسجيل (Sign Up)
export const signUpUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  const fullName = `${firstName} ${lastName}`.trim();  // توليد الاسم الكامل

  // تسجيل المستخدم في Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,  // إضافة الاسم الكامل إلى الـ metadata
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) {
    console.error('Sign-up error:', error.message);
    throw error;
  }

  const user = data.user;

  // تأكد من أن المستخدم تم إنشاؤه بنجاح
  if (!user?.id) {
    throw new Error("User ID was not returned from sign-up.");
  }

  // إضافة البيانات إلى جدول profiles
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,            // id المستخدم من Supabase
      email,                  // البريد الإلكتروني
      username: fullName,     // الاسم الكامل
      plan: "trial",          // الخطة الافتراضية هي "trial"
    });

  if (profileError) {
    console.error('Profile insert error:', profileError.message);
    throw profileError;
  }

  return user;
};
