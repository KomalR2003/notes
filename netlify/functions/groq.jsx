export async function handler(event) {
  try {
    const GROQ_API_KEY = process.env.VITE_GROQ_API_KEY; // ✅ keep using VITE_
    if (!GROQ_API_KEY) {
      return { statusCode: 500, body: "Missing GROQ_API_KEY" };
    }

    const { prompt, task } = JSON.parse(event.body);

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
            content: `You are an AI that helps with different tasks: summarization, glossary extraction, insights, grammar checking, translation. Task: ${task}. Return JSON only.`,
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 800,
        temperature: 0.5,
      }),
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        content: data.choices?.[0]?.message?.content || "",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
