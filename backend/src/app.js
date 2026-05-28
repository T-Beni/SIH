import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

import authRoutes from "./modules/auth/auth.routes.js";
import usersRoutes from "./modules/users/users.routes.js";
import invoicesRoutes from "./modules/invoices/invoices.routes.js";
import aiRoutes from "./modules/ai/ai.routes.js";
import paymentsRoutes, {
  stripeWebhookRouter,
} from "./modules/payments/payments.routes.js";

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(
  helmet({
    crossOriginOpenerPolicy: false,
  })
);

app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/payments/webhook", stripeWebhookRouter);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Smart Invoice Hub API",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/invoices", invoicesRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/payments", paymentsRoutes);

app.use(errorMiddleware);

export default app;