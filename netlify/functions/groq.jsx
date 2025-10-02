export async function handler(event) {
  try {
    // In Netlify functions, use GROQ_API_KEY (without VITE_ prefix)
    const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;
    
    if (!GROQ_API_KEY) {
      console.error("Missing GROQ_API_KEY");
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: "Missing GROQ_API_KEY" })
      };
    }

    const { prompt, task } = JSON.parse(event.body);

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing prompt" })
      };
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are an AI that helps with different tasks: summarization, glossary extraction, insights, grammar checking, translation. Task: ${task || 'general'}. Return JSON only when requested.`,
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 800,
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Groq API Error:", errorData);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: errorData.error || "Groq API Error" })
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: data.choices?.[0]?.message?.content || "",
      }),
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}