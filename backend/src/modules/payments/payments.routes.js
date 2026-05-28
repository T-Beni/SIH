import { Router } from "express";
import express from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";

import {
  createInvoiceCheckout,
  stripeWebhook,
  payInvoiceWithSavedCard,
} from "./payments.controller.js";

const router = Router();
const stripeWebhookRouter = Router();

stripeWebhookRouter.post(
  "/",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

router.post("/checkout", authMiddleware, createInvoiceCheckout);
router.post(
  "/pay-saved",
  authMiddleware,
  payInvoiceWithSavedCard
);

export { stripeWebhookRouter };
export default router;