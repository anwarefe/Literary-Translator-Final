import Auth from "./components/Auth";
import React, { useState, useCallback, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './services/supabase.ts';
import { TranslationPair } from './types.ts';
import { translateText, researchTerm, checkPunctuation, isGeminiConfigured } from './services/geminiService.ts';
import FileUpload from './components/FileUpload.tsx';
import Loader from './components/Loader.tsx';
import { 
  TranslateIcon, CheckCircleIcon, XCircleIcon, SearchIcon, XIcon, ClipboardCopyIcon, 
  TrashIcon, SparklesIcon, PencilIcon, LogOutIcon 
} from './components/icons.tsx';
import TmSearchResultsModal from './components/TmSearchResultsModal.tsx';
import AskAiModal from './components/AskAiModal.tsx';

const ConfigurationNotice: React.FC<{isSupabaseConfigured: boolean, isGeminiConfigured: boolean}> = ({ isSupabaseConfigured, isGeminiConfigured }) => (
    <div className="min-h-screen bg-slate-900 flex justify-center items-center p-4">
        <div className="w-full max-w-2xl p-8 space-y-2 bg-slate-800/50 rounded-xl shadow-lg ring-1 ring-slate-700 text-center">
            <h1 className="text-3xl font-bold text-red-400">Configuration Required</h1>
            
            {!isSupabaseConfigured && (
                <div className="pt-4">
                    <p className="text-slate-300">
                        The Supabase URL and Anonymous Key are not configured.
                    </p>
                    <p className="text-slate-400">
                        Please set the <code className="bg-slate-900 text-sky-400 p-1 rounded-md font-mono">SUPABASE_URL</code> and <code className="bg-slate-900 text-sky-400 p-1 rounded-md font-mono">SUPABASE_ANON_KEY</code> environment variables.
                    </p>
                </div>
            )}

            {!isGeminiConfigured && (
                <div className="pt-4">
                    <p className="text-slate-300">
                        The Gemini API Key is not configured.
                    </p>
                    <p className="text-slate-400">
                        Please set the <code className="bg-slate-900 text-sky-400 p-1 rounded-md font-mono">API_KEY</code> environment variable.
                    </p>
                </div>
            )}
        </div>
    </div>
);

const UserHeader: React.FC<{ user: User }> = ({ user }) => {
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error('Error logging out:', error.message);
    };

    return (
        <div className="flex justify-between items-center mb-6 p-3 bg-slate-800/50 rounded-lg ring-1 ring-slate-700">
            <p className="text-sm text-slate-300 truncate">
                Logged in as: <span className="font-semibold text-sky-400">{user.email}</span>
            </p>
            <button
                onClick={handleLogout}
                className="flex items-center text-sm px-3 py-1.5 bg-slate-700 text-slate-300 rounded-md hover:bg-red-600 hover:text-white transition-colors"
                title="Log Out"
            >
                <LogOutIcon className="w-4 h-4 mr-2" />
                <span>Log Out</span>
            </button>
        </div>
    );
};

const App: React.FC = () => {
    // الاستماع لحدث استعادة كلمة المرور من Supabase
  React.useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        const newPassword = window.prompt('أدخل كلمة المرور الجديدة:');
        if (!newPassword) {
          return;
        }
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
          window.alert('حدث خطأ أثناء تحديث كلمة المرور: ' + error.message);
        } else {
          window.alert('تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بكلمتك الجديدة.');
        }
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  if (!isSupabaseConfigured || !isGeminiConfigured) {
    return <ConfigurationNotice isSupabaseConfigured={isSupabaseConfigured} isGeminiConfigured={isGeminiConfigured} />;
  }

  const [session, setSession] = useState<Session | null>(null);
  const [isSupabaseLoading, setIsSupabaseLoading] = useState(true);
  
  const [translationMemory, setTranslationMemory] = useState<TranslationPair[]>([]);
  const [spanishText, setSpanishText] = useState<string>('');
  const [arabicText, setArabicText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPunctuationLoading, setIsPunctuationLoading] = useState<boolean>(false);
  const [isContextExpanded, setIsContextExpanded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  
  const [selectedSpanishText, setSelectedSpanishText] = useState<string>('');
  const [tmSearchResults, setTmSearchResults] = useState<TranslationPair[]>([]);
  const [isTmSearchModalOpen, setIsTmSearchModalOpen] = useState<boolean>(false);
  const [contextPairs, setContextPairs] = useState<TranslationPair[]>([]);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const [isAskAiModalOpen, setIsAskAiModalOpen] = useState<boolean>(false);
  const [askAiResult, setAskAiResult] = useState<string>('');
  const [isAskAiLoading, setIsAskAiLoading] = useState<boolean>(false);

  const [isCloudTmLoading, setIsCloudTmLoading] = useState<boolean>(true);
  const [cloudTmFailed, setCloudTmFailed] = useState<boolean>(false);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsSupabaseLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) { // Only fetch TM if user is logged in
        const fetchCloudTm = async () => {
        try {
            const response = await fetch('https://raw.githubusercontent.com/anwarefe/my-translator-files/refs/heads/main/translation_memory_spanish_arabic_large.json');
            if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
            }
            const data = await response.json();

            if (!Array.isArray(data) || data.some(item => typeof item.spanish !== 'string' || typeof item.arabic !== 'string')) {
            throw new Error('Invalid JSON structure from cloud TM.');
            }
            
            setTranslationMemory(data);
            setFileName('Cloud TM');
            setError(null);
            setCloudTmFailed(false);
        } catch (e: any) {
            console.error("Cloud TM fetch failed:", e);
            setError('Cloud TM failed. Please upload manually.');
            setCloudTmFailed(true);
        } finally {
            setIsCloudTmLoading(false);
        }
        };

        fetchCloudTm();
    }
  }, [session]);

  const handleFileSelect = useCallback((file: File) => {
    setError(null);
    setFileName(null);
    setTranslationMemory([]);

    if (file.type !== 'application/json') {
      setError('Invalid file type. Please upload a JSON file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsedJson = JSON.parse(content);

        if (!Array.isArray(parsedJson) || parsedJson.some(item => typeof item.spanish !== 'string' || typeof item.arabic !== 'string')) {
          setError('Invalid JSON structure. Expected an array of objects with "spanish" and "arabic" string properties.');
          return;
        }

        setTranslationMemory(parsedJson);
        setFileName(file.name);
      } catch (e) {
        setError('Failed to parse JSON file.');
        console.error(e);
      }
    };
    reader.onerror = () => {
      setError('Failed to read file.');
    };
    reader.readAsText(file);
  }, []);

const handleTranslate = async () => {
  if (!spanishText || isLoading) return;

  setError(null);
  setIsLoading(true);

  try {
    // ✅ تأكد أن للمستخدم صف في جدول profiles (لو مش موجود ينشئه بـ trial)
    if (session?.user?.id) {
      await supabase
        .from("profiles")
        .upsert({ id: session.user.id, plan: "trial" });
    }

    // 1️⃣ Fetch user plan
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", session?.user.id)
      .single();

    const plan = profile?.plan ?? "trial";

    // 2️⃣ Monthly word limits based on plan (تم تبسيطها الآن)
    const planLimits: Record<string, number | null> = {
      trial: 3000,  // حد الكلمات الشهري للخطة trial هو 3000
      pro: 50000,   // حد الكلمات الشهري للخطة pro هو 50000
      unlimited: null,  // لا يوجد حد شهري لخطة unlimited
    };

    // 3️⃣ Daily limits (Trial only)
    const dailyLimits: Record<string, number | null> = {
      trial: 500,   // الحد اليومي لخطة trial هو 500 كلمة
      pro: null,
      unlimited: null, // لا يوجد حد يومي لخطة unlimited
    };

    const monthlyLimit = planLimits[plan];  // تحديد الحد الشهري بناءً على الخطة
    const dailyLimit = dailyLimits[plan];  // تحديد الحد اليومي بناءً على الخطة

    // 4️⃣ Count words in current text
    const newWords = spanishText.trim().split(/\s+/).length;

    // 5️⃣ Current month & date
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7); // YYYY-MM
    const currentDate = now.toISOString().slice(0, 10); // YYYY-MM-DD

    // 6️⃣ Fetch monthly usage
    const { data: monthlyUsage } = await supabase
      .from("word_usage")
      .select("words_used")
      .eq("user_id", session?.user.id)
      .eq("month", currentMonth)
      .single();

    const usedThisMonth = monthlyUsage?.words_used ?? 0;

    // 7️⃣ Fetch daily usage
    const { data: dailyUsage } = await supabase
      .from("daily_usage")
      .select("words_used")
      .eq("user_id", session?.user.id)
      .eq("date", currentDate)
      .single();

    const usedToday = dailyUsage?.words_used ?? 0;

    // 8️⃣ Check daily limit (for Trial plans only)
    if (plan === 'trial' && dailyLimit !== null && usedToday + newWords > dailyLimit) {
      setError(
        `⚠ You reached your daily word limit for the ${plan} plan (${dailyLimit.toLocaleString()} words).\n\n⛔ Come back tomorrow or contact us on WhatsApp (+201001080760) to upgrade your plan.`
      );
      setIsLoading(false);
      return;
    }

    // 9️⃣ Check monthly limit (for Trial plans only)
    if (plan === 'trial' && monthlyLimit !== null && usedThisMonth + newWords > monthlyLimit) {
      setError(
        `⚠ You reached your monthly word limit for the ${plan} plan (${monthlyLimit.toLocaleString()} words).\n\n⛔ Please contact us on WhatsApp (+201001080760) to upgrade your plan.`
      );
      setIsLoading(false);
      return;
    }

    // 🔟 Perform translation
    const result = await translateText(
      spanishText,
      translationMemory,
      contextPairs
    );
    setArabicText(result);

    // 1️⃣1️⃣ Update monthly usage
    if (session?.user?.id) {
      await supabase.from("word_usage").upsert(
        {
          user_id: session.user.id,
          month: currentMonth,
          words_used: usedThisMonth + newWords,
          updated_at: new Date(),
        },
        { onConflict: "user_id,month" }
      );

      // 1️⃣2️⃣ Update daily usage
      await supabase.from("daily_usage").upsert(
        {
          user_id: session.user.id,
          date: currentDate,
          words_used: usedToday + newWords,
          updated_at: new Date(),
        },
        { onConflict: "user_id,date" }
      );
    }

  } catch (e: any) {
    console.error(e);

    const msg = typeof e?.message === "string" ? e.message : "";

    if (msg.includes('"code":503') || msg.toLowerCase().includes("model is overloaded")) {
      setError(
        "The translation engine is temporarily overloaded. Please try again with a shorter text or retry after a little while."
      );
    } else {
      setError(msg || "An unexpected error occurred while translating.");
    }
  } finally {
    setIsLoading(false);
  }
};



  const handlePunctuationCheck = async () => {
    if (!arabicText || isLoading || isPunctuationLoading) return;

    setIsPunctuationLoading(true);
    setError(null);

    try {
        const result = await checkPunctuation(arabicText);
        setArabicText(result);
    } catch (e: any) {
        setError(e.message || 'An unexpected error occurred during punctuation check.');
    } finally {
        setIsPunctuationLoading(false);
    }
  };
  
  const handleTextSelection = (event: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const textarea = event.currentTarget;
    const selectedText = textarea.value.substring(
      textarea.selectionStart,
      textarea.selectionEnd
    );
    setSelectedSpanishText(selectedText.trim());
  };

  const handleTmSearch = () => {
    if (selectedSpanishText.trim().length === 0) return;

    const searchTerm = selectedSpanishText.toLowerCase();
    const results = translationMemory.filter(pair => 
        pair.spanish.toLowerCase().includes(searchTerm)
    );
    setTmSearchResults(results);
    setIsTmSearchModalOpen(true);
  };

  const handleAskAi = async () => {
    if (!selectedSpanishText.trim() || !spanishText.trim() || isAskAiLoading) return;
    
    setIsAskAiModalOpen(true);
    setIsAskAiLoading(true);
    setAskAiResult('');

    try {
        const result = await researchTerm(selectedSpanishText, spanishText);
        setAskAiResult(result);
    } catch (e: any) {
        setAskAiResult(`An error occurred: ${e.message}`);
    } finally {
        setIsAskAiLoading(false);
    }
  };

  const handleAddContextPair = useCallback((pair: TranslationPair) => {
    setContextPairs(prev => {
        if (prev.some(p => p.spanish === pair.spanish && p.arabic === pair.arabic)) {
            return prev;
        }
        return [...prev, pair];
    });
  }, []);

  const handleRemoveContextPair = (indexToRemove: number) => {
    setContextPairs(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleClearContext = () => {
    setContextPairs([]);
  };
  
  const handleCopy = () => {
    if (!arabicText || isLoading) return;
    navigator.clipboard.writeText(arabicText).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
  };

  const handleClearAll = () => {
    setSpanishText('');
    setArabicText('');
    setContextPairs([]);
  };

  const canTranslate = translationMemory.length > 0 && spanishText.trim().length > 0 && !isLoading && !isPunctuationLoading;
  const canClear = spanishText.trim().length > 0 || arabicText.trim().length > 0 || contextPairs.length > 0;

  if (isSupabaseLoading) {
    return (
        <div className="min-h-screen bg-slate-900 flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-sky-400"></div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      {!session ? (
        <Auth />
      ) : (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <UserHeader user={session.user} />
<div className="mb-8"></div>


                <main className="space-y-8">
                <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg ring-1 ring-slate-700">
                    <h2 className="text-2xl font-semibold mb-4 text-slate-100 flex items-center">
                        <span className="bg-sky-500 text-white rounded-full h-8 w-8 text-lg font-bold flex items-center justify-center mr-3">1</span>
                        Upload Translation Memory
                    </h2>
                    
                    {isCloudTmLoading ? (
                        <div className="flex items-center justify-center text-slate-400 p-6">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-400 mr-4"></div>
                            <span>Attempting to load Cloud TM...</span>
                        </div>
                    ) : (
                        <>
                            {cloudTmFailed && !(fileName && !error) && (
                            <FileUpload onFileSelect={handleFileSelect} fileName={fileName} />
                            )}
                            
                            {error && (
  <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 text-red-200 bg-red-900/20 p-3 rounded-lg">
    <div className="flex items-start">
      <XCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
      {/* نخلي الرسالة تحترم الأسطر الجديدة */}
      <span className="whitespace-pre-line">{error}</span>
    </div>

    {/* زر واتساب يظهر فقط إذا كانت الرسالة فيها كلمة WhatsApp */}
    {error.includes("WhatsApp") && (
      <a
        href="https://wa.me/201001080760"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-semibold rounded-md bg-green-500 hover:bg-green-600 text-white"
      >
        Contact on WhatsApp
      </a>
    )}
  </div>
)}

                            {fileName && !error && (
                                <div className="flex items-center text-green-400 bg-green-900/20 p-3 rounded-lg">
                                    <CheckCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                                    <span>
                                        {(fileName === 'Cloud TM' ? 'Cloud' : '')} TM loaded successfully with {translationMemory.length} pairs.
                                    </span>
                                </div>
                            )}
                        </>
                    )}
                </div>
                
                <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg ring-1 ring-slate-700">
                    <h2 className="text-2xl font-semibold mb-4 text-slate-100 flex items-center">
                        <span className="bg-sky-500 text-white rounded-full h-8 w-8 text-lg font-bold flex items-center justify-center mr-3">2</span>
                        Translate Your Text
                    </h2>

                    {contextPairs.length > 0 && (
                        <div className="mb-6 border border-slate-700 rounded-lg bg-slate-900/50">
                            <button
                                onClick={() => setIsContextExpanded(prev => !prev)}
                                className="w-full flex justify-between items-center p-4 text-left hover:bg-slate-800/50 rounded-t-lg transition-colors"
                                aria-expanded={isContextExpanded}
                                aria-controls="context-references-list"
                            >
                                <div className="flex items-center">
                                    <h3 className="text-lg font-semibold text-sky-400">View Selected References</h3>
                                    <span className="ml-3 bg-sky-800 text-sky-300 text-xs font-bold px-2 py-1 rounded-full">
                                        {contextPairs.length}
                                    </span>
                                </div>
                                <svg className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isContextExpanded ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {isContextExpanded && (
                                <div id="context-references-list" className="px-4 pb-4 border-t border-slate-700 pt-4">
                                    <div className="flex justify-end mb-4">
                                        <button
                                            onClick={handleClearContext}
                                            className="flex items-center text-sm px-3 py-1.5 bg-slate-700 text-slate-300 rounded-md hover:bg-red-600 hover:text-white transition-colors"
                                            aria-label="Clear all context references"
                                        >
                                            <TrashIcon className="w-4 h-4 mr-2" />
                                            Clear Context
                                        </button>
                                    </div>
                                    <ul className="space-y-3 max-h-48 overflow-y-auto pr-2">
                                        {contextPairs.map((pair, index) => (
                                            <li key={index} className="flex items-start justify-between p-3 bg-slate-800 rounded-md">
                                                <div className="flex-1 mr-4">
                                                    <p className="text-sm text-slate-400">{pair.spanish}</p>
                                                    <p className="text-sm font-arabic text-right text-slate-300" dir="rtl">{pair.arabic}</p>
                                                </div>
                                                <button onClick={() => handleRemoveContextPair(index)} className="p-1 rounded-full text-slate-500 hover:bg-slate-700 hover:text-red-400 transition-colors" aria-label="Remove context reference" >
                                                    <XIcon className="w-5 h-5" />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label htmlFor="spanish-input" className="block text-sm font-medium text-slate-400">Spanish (Español)</label>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={handleClearAll}
                                        disabled={!canClear}
                                        className="flex items-center text-sm px-3 py-1.5 bg-slate-700 text-slate-300 rounded-md hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Clear all text and context"
                                    >
                                        <TrashIcon className="w-4 h-4 mr-2" />
                                        <span>Clear</span>
                                    </button>
                                    <button
                                        onClick={handleTmSearch}
                                        disabled={!selectedSpanishText}
                                        className="flex items-center text-sm px-3 py-1.5 bg-slate-700 text-slate-300 rounded-md hover:bg-sky-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Search TM for selected text"
                                    >
                                        <SearchIcon className="w-4 h-4 mr-2" />
                                        <span>Search TM</span>
                                    </button>
                                    <button
                                        onClick={handleAskAi}
                                        disabled={!selectedSpanishText}
                                        className="flex items-center text-sm px-3 py-1.5 bg-slate-700 text-slate-300 rounded-md hover:bg-violet-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Ask AI to analyze selected text"
                                    >
                                        <SparklesIcon className="w-4 h-4 mr-2" />
                                        <span>Ask AI</span>
                                    </button>
                                </div>
                            </div>

                            <textarea
                                id="spanish-input"
                                rows={10}
                                className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder={translationMemory.length > 0 ? "Enter Spanish literary text here..." : "Upload a TM file to enable..."}
                                value={spanishText}
                                onChange={(e) => {
                                    setSpanishText(e.target.value);
                                    setSelectedSpanishText('');
                                }}
                                onSelect={handleTextSelection}
                                disabled={translationMemory.length === 0}
                            />
                        </div>
                        <div className="relative">
                            <div className="flex justify-between items-center mb-2">
                                <label htmlFor="arabic-output" className="block text-sm font-medium text-slate-400">Arabic (العربية)</label>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={handlePunctuationCheck}
                                        disabled={!arabicText || isLoading || isPunctuationLoading}
                                        className="flex items-center text-sm text-slate-400 hover:text-sky-400 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
                                        title="Correct Punctuation"
                                    >
                                        {isPunctuationLoading ? (
                                            <>
                                                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-sky-400 mr-2"></span>
                                                <span>Correcting...</span>
                                            </>
                                        ) : (
                                            <>
                                                <PencilIcon className="w-4 h-4 mr-1" />
                                                <span>Punctuation</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleCopy}
                                        disabled={!arabicText || isLoading || isCopied || isPunctuationLoading}
                                        className="flex items-center text-sm text-slate-400 hover:text-sky-400 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
                                        title={isCopied ? "Copied!" : "Copy to clipboard"}
                                    >
                                        {isCopied ? (
                                            <>
                                                <CheckCircleIcon className="w-4 h-4 mr-1 text-green-400" />
                                                <span className="text-green-400">Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <ClipboardCopyIcon className="w-4 h-4 mr-1" />
                                                <span>Copy</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div
                                id="arabic-output"
                                dir="rtl"
                                lang="ar"
                                className="font-arabic w-full h-full min-h-[254px] bg-slate-900 border border-slate-700 rounded-md p-3"
                            >
                            {isLoading ? (
                                    <Loader />
                                ) : (
                                    <p className="whitespace-pre-wrap">{arabicText}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleTranslate}
                            disabled={!canTranslate}
                            className="flex items-center justify-center px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-70 transition-colors duration-300"
                        >
                            <TranslateIcon className="w-5 h-5 mr-2" />
                            <span>{isLoading ? 'Translating...' : 'Translate'}</span>
                        </button>
                    </div>
                </div>
                </main>

                {isTmSearchModalOpen && (
                    <TmSearchResultsModal 
                        results={tmSearchResults} 
                        searchTerm={selectedSpanishText}
                        onClose={() => setIsTmSearchModalOpen(false)} 
                        onAddContext={handleAddContextPair}
                        existingContextPairs={contextPairs}
                    />
                )}

                {isAskAiModalOpen && (
                    <AskAiModal
                        term={selectedSpanishText}
                        result={askAiResult}
                        isLoading={isAskAiLoading}
                        onClose={() => setIsAskAiModalOpen(false)}
                        onAddContext={handleAddContextPair}
                        existingContextPairs={contextPairs}
                    />
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default App;
