import { env } from "../../config/env.js";

export async function analyzeInvoiceText(extractedText) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.GROQ_INVOICE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.GROQ_INVOICE_MODEL,
      temperature: 0,
      messages: [
        {
          role: "system",
          content: `
Extrage date din textul unei facturi.
Răspunde DOAR cu JSON valid.
Nu adăuga explicații.

Schema:
{
  "supplier_name": string | null,
  "invoice_number": string | null,
  "issue_date": "YYYY-MM-DD" | null,
  "due_date": "YYYY-MM-DD" | null,
  "total_amount": number | null,
  "currency": string | null
}
          `,
        },
        {
          role: "user",
          content: extractedText,
        },
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Invoice AI analysis failed.");
  }

  const content = data.choices[0].message.content;

  try {
    return JSON.parse(content);
  } catch {
    throw new Error("AI-ul nu a returnat JSON valid.");
  }
}