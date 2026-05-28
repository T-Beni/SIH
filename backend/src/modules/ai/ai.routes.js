import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { chat } from "./ai.controller.js";

const router = Router();

router.post("/chat", authMiddleware, chat);

export default router;