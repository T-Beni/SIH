import bcrypt from "bcrypt";
import { db } from "../../config/db.js";

export async function findUserByEmail(email) {
  const result = await db.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );

  return result.rows[0];
}

export async function createUser({
  name,
  email,
  password,
}) {
  const passwordHash = await bcrypt.hash(password, 12);

  const result = await db.query(
    `
    INSERT INTO users (
      name,
      email,
      password_hash,
      auth_provider
    )
    VALUES ($1, $2, $3, 'local')
    RETURNING id, name, email
    `,
    [name, email, passwordHash]
  );

  return result.rows[0];
}

export async function validatePassword(
  password,
  passwordHash
) {
  return bcrypt.compare(password, passwordHash);
}