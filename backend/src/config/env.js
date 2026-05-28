import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",

  DATABASE_URL: process.env.DATABASE_URL,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GROQ_API_KEY_1: process.env.GROQ_API_KEY_1,
  GROQ_API_KEY_2: process.env.GROQ_API_KEY_2,
  GROQ_API_KEY_3: process.env.GROQ_API_KEY_3,
  GROQ_MODEL: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
  GROQ_INVOICE_API_KEY: process.env.GROQ_INVOICE_API_KEY,
  GROQ_INVOICE_MODEL: process.env.GROQ_INVOICE_MODEL || "openai/gpt-oss-120b",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
};