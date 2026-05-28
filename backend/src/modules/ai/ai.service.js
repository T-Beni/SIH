import { env } from "../../config/env.js";

const groqKeys = [
  env.GROQ_API_KEY_1,
  env.GROQ_API_KEY_2,
  env.GROQ_API_KEY_3,
].filter(Boolean);

let currentKeyIndex = 0;

function getNextKey() {
  const key = groqKeys[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % groqKeys.length;
  return key;
}

export async function generateChatResponse(messages) {
  if (groqKeys.length === 0) {
    throw new Error("No Groq API keys configured.");
  }

  let lastError = null;

  for (let attempt = 0; attempt < groqKeys.length; attempt++) {
    const apiKey = getNextKey();

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: env.GROQ_MODEL,
          messages: [
            {
              role: "system",
              content:
                "Ești AI Chat pentru Smart Invoice Hub. Răspunde clar, concis și util. Nu pretinde că ai acces la facturile userului decât dacă acestea sunt furnizate în conversație. Poți folosi Markdown pentru liste, bold și structurare.",
            },
            ...messages,
          ],
          temperature: 0.4,
          max_completion_tokens: 900,
        }),
      });

      if ([429, 500, 502, 503, 504].includes(response.status)) {
        lastError = new Error(`Groq key failed with status ${response.status}`);
        continue;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message || "Groq request failed.");
      }

      return data.choices[0].message.content;
    } catch (error) {
      lastError = error;
      continue;
    }
  }

  throw lastError || new Error("All Groq API keys failed.");
}