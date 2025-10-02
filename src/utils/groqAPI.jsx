const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = import.meta.env.VITE_API_URL;


console.log('API Key:', GROQ_API_KEY);
console.log('API URL:', GROQ_API_URL);

console.log("API Key:", GROQ_API_KEY ? "Loaded " : "Missing ");
console.log("API URL:", GROQ_API_URL || "Undefined ");

// remove HTML tags and extra spaces
export const stripHtml = (html) =>
  html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

// generic API call
export const callGroqAPI = async (prompt, maxTokens = 500, temperature = 0.5) => {
  const response = await fetch(`${GROQ_API_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxTokens,
      temperature,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Groq API Error: ${response.status}`);
  };

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || "";
};

// Example: Summarize a note
export const summarizeNote = async (content) => {
  const text = stripHtml(content);
  if (text.length < 20) throw new Error("Content too short to summarize");

  const prompt = `Summarize the following note in 1-2 sentences:\n\n${text.slice(0, 3000)}\n\nSummary:`;
  return await callGroqAPI(prompt, 150, 0.3);
};

// Example: Suggest tags
export const suggestTags = async (content) => {
  const text = stripHtml(content);
  if (text.length < 20) throw new Error("Content too short for tag suggestions");


  const prompt = `Analyze this note and suggest 3-5 relevant tags. Return ONLY the tags as a comma-separated list.\n\nNote content:\n${text.slice(0, 2000)}\n\nTags:`;
  const response = await callGroqAPI(prompt, 100, 0.4);
  return response.split(",").map(t => t.trim()).filter(t => t.length > 0).slice(0, 5);
};

// 3️⃣ Extract Glossary Terms
export const extractGlossaryTerms = async (content) => {
  const text = stripHtml(content);
  if (text.length < 50) throw new Error("Content too short for glossary extraction");

  const prompt = `Identify 5-8 key technical terms, acronyms, or important concepts from this text. Return ONLY a valid JSON array in this exact format:\n[{"term":"example term","definition":"brief explanation"}]\n\nText:\n${text.slice(0, 2000)}\n\nJSON:`;

  try {
    const response = await callGroqAPI(prompt, 800, 0.3);
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("Invalid response format");

    const terms = JSON.parse(jsonMatch[0]);
    return terms.filter(item => item.term && item.definition).slice(0, 8);
  } catch (error) {
    console.error("Glossary extraction error:", error);
    return [];
  }
};

// 4️⃣ Grammar Check
export const checkGrammar = async (content) => {
  const text = stripHtml(content);
  if (text.length < 10) throw new Error("Content too short for grammar check");

  const prompt = `Check this text for grammar, spelling, and punctuation errors. Return ONLY a valid JSON array in this format:\n[{"error":"incorrect text","correction":"correct text","type":"grammar"}]\n\nText:\n${text.slice(0, 1500)}\n\nJSON:`;

  try {
    const response = await callGroqAPI(prompt, 600, 0.2);
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const errors = JSON.parse(jsonMatch[0]);
    return errors.filter(e => e.error && e.correction && e.type).slice(0, 10);
  } catch (error) {
    console.error("Grammar check error:", error);
    return [];
  }
};

// 5️⃣ Translate Note
export const translateNote = async (content, targetLanguage) => {
  const text = stripHtml(content);
  if (text.length < 5) throw new Error("Content too short to translate");

  const prompt = `Translate the following text to ${targetLanguage}. Return ONLY the translated text.\n\nText:\n${text.slice(0, 2500)}\n\nTranslation:`;
  return await callGroqAPI(prompt, 1200, 0.3);
};

// 6️⃣ Generate Insights
export const generateInsights = async (content) => {
  const text = stripHtml(content);
  if (text.length < 50) throw new Error("Content too short for insights");

  const prompt = `Analyze this note and provide:\n1. Sentiment (positive/neutral/negative)\n2. 3-5 key points\n3. 2-3 actionable recommendations\n\nReturn ONLY a valid JSON object in this format:\n{\n"sentiment": "positive",\n"keyPoints": ["point 1", "point 2", "point 3"],\n"recommendations": ["recommendation 1", "recommendation 2"]\n}\n\nNote:\n${text.slice(0, 2000)}\n\nJSON:`;

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
