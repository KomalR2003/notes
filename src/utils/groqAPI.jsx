const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Utility: Remove HTML tags and extra spaces
export const stripHtml = (html) =>
  html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

// Generic API caller - Direct API call from frontend
export const callGroqAPI = async (prompt, task = "general", maxTokens = 800) => {
  try {
    if (!GROQ_API_KEY) {
      throw new Error("Missing VITE_GROQ_API_KEY. Please add it to your environment variables.");
    }

    console.log(`Calling Groq API for task: ${task}`);

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are an AI that helps with different tasks: summarization, glossary extraction, insights, grammar checking, translation. Task: ${task}. Return JSON only when requested.`,
          },
          { role: "user", content: prompt },
        ],
        max_tokens: maxTokens,
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
      console.error("Groq API error:", errorData);
      throw new Error(errorData.error?.message || errorData.error || `API Error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim() || "";
    
    console.log("API call successful");
    return content;
  } catch (err) {
    console.error("callGroqAPI error:", err);
    throw err;
  }
};

// 1️ Summarize a Note
export const summarizeNote = async (content) => {
  const text = stripHtml(content);
  if (text.length < 20) throw new Error("Content too short to summarize");

  const prompt = `Summarize the following note in 1-2 sentences:\n\n${text.slice(0, 3000)}\n\nSummary:`;
  return await callGroqAPI(prompt, "summarization", 150);
};

// 2️ Suggest Tags
export const suggestTags = async (content) => {
  const text = stripHtml(content);
  if (text.length < 20) throw new Error("Content too short for tag suggestions");

  const prompt = `Analyze this note and suggest 3-5 relevant tags. Return ONLY the tags as a comma-separated list.\n\nNote:\n${text.slice(0, 2000)}\n\nTags:`;
  const response = await callGroqAPI(prompt, "tag_suggestion", 100);
  return response.split(",").map(t => t.trim()).filter(Boolean).slice(0, 5);
};

// 3️ Extract Glossary Terms
export const extractGlossaryTerms = async (content) => {
  const text = stripHtml(content);
  if (text.length < 50) throw new Error("Content too short for glossary extraction");

  const prompt = `Identify 5-8 key technical terms, acronyms, or important concepts from this text. 
Return ONLY a valid JSON array in this format:
[{"term":"example","definition":"brief explanation"}]

Text:
${text.slice(0, 2000)}

JSON:`;

  try {
    const response = await callGroqAPI(prompt, "glossary_extraction", 800);
    console.log("Glossary raw response:", response);
    
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error("No JSON array found in response");
      return [];
    }

    const terms = JSON.parse(jsonMatch[0]);
    return terms.filter(item => item.term && item.definition).slice(0, 8);
  } catch (err) {
    console.error("Glossary extraction error:", err);
    return [];
  }
};

// 4️ Grammar Check
export const checkGrammar = async (content) => {
  const text = stripHtml(content);
  if (text.length < 10) throw new Error("Content too short for grammar check");

  const prompt = `Check this text for grammar, spelling, and punctuation errors. 
Return ONLY a JSON array in this format:
[{"error":"incorrect","correction":"correct","type":"grammar"}]

Text:
${text.slice(0, 1500)}

JSON:`;

  try {
    const response = await callGroqAPI(prompt, "grammar_check", 600);
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const errors = JSON.parse(jsonMatch[0]);
    return errors.filter(e => e.error && e.correction).slice(0, 10);
  } catch (err) {
    console.error("Grammar check error:", err);
    return [];
  }
};

// 5️ Translate Note
export const translateNote = async (content, targetLanguage) => {
  const text = stripHtml(content);
  if (text.length < 5) throw new Error("Content too short to translate");

  const prompt = `Translate the following text to ${targetLanguage}. 
Return ONLY the translated text.

Text:
${text.slice(0, 2500)}

Translation:`;

  return await callGroqAPI(prompt, "translation", 1200);
};

// 6️ Generate Insights
export const generateInsights = async (content) => {
  const text = stripHtml(content);
  if (text.length < 50) throw new Error("Content too short for insights");

  const prompt = `Analyze this note and provide:
1. Sentiment (positive/neutral/negative)
2. 3-5 key points
3. 2-3 actionable recommendations

Return ONLY a JSON object in this format:
{
  "sentiment": "positive",
  "keyPoints": ["point1", "point2", "point3"],
  "recommendations": ["rec1", "rec2"]
}

Note:
${text.slice(0, 2000)}

JSON:`;

  try {
    const response = await callGroqAPI(prompt, "insights", 500);
    console.log("Insights raw response:", response);
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON object found in response");
      return { sentiment: "neutral", keyPoints: [], recommendations: [] };
    }

    const insights = JSON.parse(jsonMatch[0]);
    return {
      sentiment: insights.sentiment || "neutral",
      keyPoints: Array.isArray(insights.keyPoints) ? insights.keyPoints.slice(0, 5) : [],
      recommendations: Array.isArray(insights.recommendations) ? insights.recommendations.slice(0, 3) : []
    };
  } catch (err) {
    console.error("Insights generation error:", err);
    return { sentiment: "neutral", keyPoints: [], recommendations: [] };
  }
}