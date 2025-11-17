import { GoogleGenAI } from "@google/genai";
import { TranslationPair } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const constructPrompt = (
    spanishText: string,
    contextPairs: TranslationPair[]
  ): string => {
    
    const promptParts: string[] = [];

    // --- [Part 1: Manually Selected References (If any)] ---
    if (contextPairs.length > 0) {
        const manualContextString = contextPairs
            .map(
                (pair, index) =>
                    `مثال ${index + 1}: ${pair.spanish} -> ${pair.arabic}`
            )
            .join("\n");

        const part1 = `--- [الجزء الأول: المرجعيات المختارة يدوياً (إن وجدت)] ---
**المرجعيات السياقية (يجب الالتزام بها):**
استخدم الأمثلة التالية لاستخلاص المصطلحات والتعبيرات والأسلوب.
${manualContextString}`;
        promptParts.push(part1);
    }

    // --- [Part 2: Style Guide (Saleh Almani's approach)] ---
    const part2 = `--- [الجزء الثاني: دليل الأسلوب (نهج صالح علماني)] ---
**دليل الأسلوب الإلزامي (نهج صالح علماني):**
أثناء الترجمة، يجب عليك الالتزام بالمبادئ التالية بدقة:

1.  **الأمانة للمعنى الأصلي:**
    * **الأولوية القصوى:** نقل المعنى الدقيق والسياق الكامل للنص الأصلي.
    * **الدقة:** فهم الفروق الدقيقة في المفردات والتراكيب قبل اختيار المقابل العربي.

2.  **المعالجة الثقافية:**
    * **تحديد العناصر الثقافية:** التعرف على الإشارات الثقافية، التاريخية، الاجتماعية.
    * **إيجاد المكافئ:** البحث عن أقرب مكافئ ثقافي أو تعبيري مفهوم للقارئ العربي.

3.  **التعابير الاصطلاحية والعامية:**
    * **البحث عن مقابل:** محاولة إيجاد تعبير اصطلاحي عربي له نفس الدلالة.
    * **إعادة الصياغة:** إذا لم يوجد مقابل، قم بإعادة صياغة الجملة لنقل المعنى بأسلوب عربي طبيعي.

4.  **الحفاظ على الأسلوب والنبرة:**
    * **محاكاة أسلوب المؤلف:** الانتباه إلى أسلوب الكاتب الأصلي ومحاولة محكاته باللغة العربية.
    * **نقل النبرة:** الحفاظ على النبرة العاطفية للنص (حزن، فرح, سخرية، توتر، إلخ).

5.  **بنية الجملة والربط:**
    * **المرونة:** عدم الالتزام الحرفي ببنية الجملة المصدر. يمكن تقسيم الجمل الطويلة أو دمج القصيرة لتحسين السلاسة.

6.  **أسماء الأعلام والأماكن:**
    * **النقل الصوتي والثبات:** استخدام النقل الصوتي والحفاظ على نفس النطق للاسم الواحد.

7.  **القارئ المستهدف:**
    * **السلاسة:** يجب أن يكون النص العربي النهائي سلساً ومقروءاً وكأنه كُتب بالعربية أصلاً.`;
    promptParts.push(part2);

    // --- [Part 3: Task and Output Rule] ---
    const part3 = `--- [الجزء الثالث: المهمة وقاعدة الإخراج] ---
**المهمة:**
"الآن، اتبع 'دليل الأسلوب' أعلاه بدقة، واستخدم 'المرجعيات السياقية' (إن وجدت)، لترجمة النص التالي:"
${spanishText}

**قاعدة الإخراج:**
"إجابتك يجب أن تحتوي على **النص العربي المترجم النهائي فقط**. لا تقم بتضمين أي شرح، أو ملاحظات، أو نجوم (*)."`;
    promptParts.push(part3);
    
    return promptParts.join('\n\n');
};

export const translateText = async (
  spanishText: string,
  translationMemory: TranslationPair[],
  contextPairs: TranslationPair[]
): Promise<string> => {
  if (!spanishText.trim()) {
    return "";
  }
  // The UI disables the button if TM is not loaded, so this check is for robustness.
  if (translationMemory.length === 0) {
    throw new Error("Translation Memory is empty. Please upload a TM file to enable translation.");
  }

  // Build the new prompt without automatic RAG.
  // The prompt now only relies on manually selected context pairs and the style guide.
  const prompt = constructPrompt(spanishText, contextPairs);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `Error during translation: ${error.message}`;
    }
    return "An unknown error occurred during translation.";
  }
};

const constructResearchPrompt = (selectedText: string, fullText: string): string => {
    return `أنت مساعد باحث لغوي وخبير في القواميس وتحليل السياق. مهمتك هي تحليل **'المصطلح المحدد'** ضمن **'السياق الكامل'** الذي سيتم تزويدك به.

---
**السياق الكامل للنص:**
${fullText}
---
**المصطلح المحدد للبحث:**
${selectedText}
---

الآن، بناءً على ما سبق، قدم تقريراً موجزاً ومنظماً كالتالي:

1.  **المعنى الإسباني:** ما هو التعريف الأساسي لـ **'المصطلح المحدد'**؟
2.  **مقترحات ترجمة عربية (عامة):** ما هي **الترجمات** العربية المحتملة و **المقابلات** الشائعة لهذا المصطلح؟
3.  **مرادفات عربية (للمقترحات):** ما هي **المرادفات العربية** للترجمات المقترحة في النقطة 2؟ (لتوسيع الخيارات).
4.  **الاقتراح الأفضل (حسب السياق):** بناءً على **'السياق الكامل'** أعلاه، ما هي **أفضل ترجمة عربية** دقيقة تقترحها لـ **'المصطلح المحدد'** في هذا النص تحديداً؟`;
};


export const researchTerm = async (
    selectedText: string,
    fullText: string
): Promise<string> => {
    if (!selectedText.trim() || !fullText.trim()) {
        return "";
    }

    const prompt = constructResearchPrompt(selectedText, fullText);

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for research:", error);
        if (error instanceof Error) {
            return `Error during research: ${error.message}`;
        }
        return "An unknown error occurred during research.";
    }
};

const constructPunctuationPrompt = (arabicText: string): string => {
    return `أنت مدقق لغوي عربي خبير (Arabic Proofreader).

مهمتك هي مراجعة النص العربي التالي. **لا تقم بتغيير أي كلمات أو معاني أو إعادة صياغة أي جمل.**

مهمتك **الوحيدة** هي **إصلاح وضبط علامات الترقيم** (الفاصلة، الفاصلة المنقوطة، النقطة، علامات التنصيص، الأقواس) لتتوافق 100% مع قواعد الترقيم في اللغة العربية الفصحى الحديثة.

**النص المطلوب ضبط ترقيمه:**
${arabicText}

**قاعدة الإخراج:**
أعد النص العربي المصحح فقط، بدون أي مقدمات أو شروحات.`;
};

export const checkPunctuation = async (
  arabicText: string
): Promise<string> => {
  if (!arabicText.trim()) {
    return "";
  }

  const prompt = constructPunctuationPrompt(arabicText);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for punctuation check:", error);
    if (error instanceof Error) {
        return `Error during punctuation check: ${error.message}`;
    }
    return "An unknown error occurred during punctuation check.";
  }
};