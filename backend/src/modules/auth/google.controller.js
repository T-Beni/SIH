import { OAuth2Client } from "google-auth-library";
import { db } from "../../config/db.js";
import { env } from "../../config/env.js";
import { signToken } from "../../utils/jwt.js";

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export async function googleLogin(req, res) {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({
      message: "Google credential is required",
    });
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  const googleId = payload.sub;
  const email = payload.email;
  const name = payload.name || "Google User";
  const avatarUrl = payload.picture || null;

  let result = await db.query(
    `
    SELECT
      id,
      name,
      email,
      google_id,
      auth_provider,
      avatar_url
    FROM users
    WHERE email = $1
    `,
    [email]
  );

  let user = result.rows[0];

  if (!user) {
    result = await db.query(
      `
      INSERT INTO users (
        name,
        email,
        google_id,
        auth_provider,
        avatar_url
      )
      VALUES ($1, $2, $3, 'google', $4)
      RETURNING id, name, email, google_id, auth_provider, avatar_url
      `,
      [name, email, googleId, avatarUrl]
    );

    user = result.rows[0];
  } else{
    result = await db.query(
      `
      UPDATE users
      SET google_id = $1,
          avatar_url = $2,
          updated_at = NOW()
      WHERE id = $3
      RETURNING id, name, email, google_id, auth_provider, avatar_url
      `,
      [googleId, avatarUrl, user.id]
    );

    user = result.rows[0];
  }

  const token = signToken({
    userId: user.id,
  });

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      auth_provider: user.auth_provider,
      avatar_url: user.avatar_url,
    },
    token,
  });
}