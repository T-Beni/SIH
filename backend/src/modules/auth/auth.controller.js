import { z } from "zod";

import {
  createUser,
  findUserByEmail,
  validatePassword,
} from "./auth.service.js";

import { signToken } from "../../utils/jwt.js";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export async function register(req, res) {
  const data = registerSchema.parse(req.body);

  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    return res.status(409).json({
      message: "Email already exists",
    });
  }

  const user = await createUser(data);

  const token = signToken({
    userId: user.id,
  });

  res.json({
    user,
    token,
  });
}

export async function login(req, res) {
  const data = loginSchema.parse(req.body);

  const user = await findUserByEmail(data.email);

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const validPassword = await validatePassword(
    data.password,
    user.password_hash
  );

  if (!validPassword) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const token = signToken({
    userId: user.id,
  });

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
}