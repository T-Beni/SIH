import { db } from "../../config/db.js";

export async function getMe(req, res) {
  const result = await db.query(
    `
    SELECT
      id,
      name,
      email,
      auth_provider,
      avatar_url,
      created_at
    FROM users
    WHERE id = $1
    `,
    [req.user.userId]
  );

  res.json(result.rows[0]);
}