import { z } from "zod";
import { generateChatResponse } from "./ai.service.js";

const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000),
      })
    )
    .min(1)
    .max(20),
});

export async function chat(req, res) {
  const data = chatSchema.parse(req.body);

  const answer = await generateChatResponse(data.messages);

  res.json({
    answer,
  });
}