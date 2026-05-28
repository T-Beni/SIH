import { Router } from "express";
import multer from "multer";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import {
  getMyInvoices,
  getInvoiceById,
  uploadInvoice,
} from "./invoices.controller.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024,
  },
});

router.get("/", authMiddleware, getMyInvoices);
router.get("/:id", authMiddleware, getInvoiceById);
router.post(
  "/upload",
  authMiddleware,
  upload.single("invoice"),
  uploadInvoice
);

export default router;