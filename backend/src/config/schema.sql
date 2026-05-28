CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  google_id TEXT UNIQUE,
  auth_provider TEXT NOT NULL DEFAULT 'local',
  stripe_customer_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  supplier_name TEXT,
  invoice_number TEXT,
  issue_date DATE,
  due_date DATE,
  total_amount NUMERIC(12, 2),
  currency TEXT DEFAULT 'RON',
  status TEXT DEFAULT 'uploaded',
  file_url TEXT,
  extracted_text TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  stripe_payment_intent_id TEXT,
  amount NUMERIC(12, 2),
  currency TEXT DEFAULT 'RON',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);