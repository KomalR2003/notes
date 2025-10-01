const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = "/groq/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";


if (!GROQ_API_KEY) {
  console.error(" Groq API key is missing. Did you add it to .env?");
}

// 🔹 Helper: Strip HTML tags from text
export const stripHtml = (html) =>
  html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

// 🔹 Core: Call Groq API
export const callGroqAPI = async (prompt, maxTokens = 500, temperature = 0.5) => {
  if (!GROQ_API_KEY) {
    throw new Error(
      "⚠️ Groq API key not configured!\n\n" +
      "Please add VITE_GROQ_API_KEY to your .env file"
    );
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant for a note-taking app. Provide concise, accurate responses."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature,
        max_tokens: maxTokens,
        top_p: 1,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message ||
        `Groq API Error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Groq API Error:", error);
    throw error;
  }
};

//
// --- AI FEATURES ---
//

// 1️ Summarize Note
export const summarizeNote = async (content) => {
  const text = stripHtml(content);
  if (text.length < 20) throw new Error("Content too short to summarize");

  const prompt = `Summarize the following note in 1-2 concise sentences. Focus on the main point:

${text.slice(0, 3000)}

Summary:`;

  return await callGroqAPI(prompt, 150, 0.3);
};

// 2️ Suggest Tags
export const suggestTags = async (content) => {
  const text = stripHtml(content);
  if (text.length < 20) throw new Error("Content too short for tag suggestions");

  const prompt = `Analyze this note and suggest 3-5 relevant tags. 
Return ONLY the tags as a comma-separated list, nothing else.

Note content:
${text.slice(0, 2000)}

Tags:`;

  const response = await callGroqAPI(prompt, 100, 0.4);

  return response
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => tag.length > 0 && tag.length < 20)
    .slice(0, 5);
};

// 3️ Extract Glossary Terms
export const extractGlossaryTerms = async (content) => {
  const text = stripHtml(content);
  if (text.length < 50) throw new Error("Content too short for glossary extraction");

  const prompt = `Identify 5-8 key technical terms, acronyms, or important concepts from this text. 
For each term, provide a brief definition.

Return ONLY a valid JSON array in this exact format:
[{"term":"example term","definition":"brief explanation"}]

Text:
${text.slice(0, 2000)}

JSON:`;

  try {
    const response = await callGroqAPI(prompt, 800, 0.3);
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("Invalid response format");

    const terms = JSON.parse(jsonMatch[0]);
    return terms.filter((item) => item.term && item.definition).slice(0, 8);
  } catch (error) {
    console.error("Glossary extraction error:", error);
    return [];
  }
};

// 4️ Grammar Check
export const checkGrammar = async (content) => {
  const text = stripHtml(content);
  if (text.length < 10) throw new Error("Content too short for grammar check");

  const prompt = `Check this text for grammar, spelling, and punctuation errors. 
For each error, provide the incorrect text, the correction, and the error type.

Return ONLY a valid JSON array in this format:
[{"error":"incorrect text","correction":"correct text","type":"grammar"}]

If no errors found, return [].

Text:
${text.slice(0, 1500)}

JSON:`;

  try {
    const response = await callGroqAPI(prompt, 600, 0.2);
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const errors = JSON.parse(jsonMatch[0]);
    return errors.filter((e) => e.error && e.correction && e.type).slice(0, 10);
  } catch (error) {
    console.error("Grammar check error:", error);
    return [];
  }
};

// 5️ Translate Note
export const translateNote = async (content, targetLanguage) => {
  const text = stripHtml(content);
  if (text.length < 5) throw new Error("Content too short to translate");

  const prompt = `Translate the following text to ${targetLanguage}. 
Return ONLY the translated text, nothing else.

Text:
${text.slice(0, 2500)}

Translation:`;

  return await callGroqAPI(prompt, 1200, 0.3);
};

// 6️ Generate Insights
export const generateInsights = async (content) => {
  const text = stripHtml(content);
  if (text.length < 50) throw new Error("Content too short for insights");

  const prompt = `Analyze this note and provide:
1. Sentiment (positive/neutral/negative)
2. 3-5 key points
3. 2-3 actionable recommendations

Return ONLY a valid JSON object in this format:
{
  "sentiment": "positive",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "recommendations": ["recommendation 1", "recommendation 2"]
}

Note:
${text.slice(0, 2000)}

JSON:`;

  try {
    const response = await callGroqAPI(prompt, 500, 0.4);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid response format");

    const insights = JSON.parse(jsonMatch[0]);
    return {
      sentiment: insights.sentiment || "neutral",
      keyPoints: Array.isArray(insights.keyPoints) ? insights.keyPoints.slice(0, 5) : [],
      recommendations: Array.isArray(insights.recommendations) ? insights.recommendations.slice(0, 3) : []
    };
  } catch (error) {
    console.error("Insights generation error:", error);
    return { sentiment: "neutral", keyPoints: [], recommendations: [] };
  }
};
