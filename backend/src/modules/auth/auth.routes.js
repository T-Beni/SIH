import { Router } from "express";
import { googleLogin } from "./google.controller.js";
import {
  register,
  login,
} from "./auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);

export default router;