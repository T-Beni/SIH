import { db } from "../../config/db.js";
import { extractTextFromImage } from "../vision/vision.service.js";
import { analyzeInvoiceText } from "./invoice-ai.service.js";

export async function getMyInvoices(req, res) {
  const result = await db.query(
    `
    SELECT
      id,
      supplier_name,
      invoice_number,
      issue_date,
      due_date,
      total_amount,
      currency,
      status,
      created_at
    FROM invoices
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [req.user.userId]
  );

  res.json(result.rows);
}

export async function getInvoiceById(req, res) {
  const result = await db.query(
    `
    SELECT
      id,
      supplier_name,
      invoice_number,
      issue_date,
      due_date,
      total_amount,
      currency,
      status,
      file_url,
      extracted_text,
      created_at
    FROM invoices
    WHERE id = $1 AND user_id = $2
    `,
    [req.params.id, req.user.userId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      message: "Factura nu a fost găsită.",
    });
  }

  res.json(result.rows[0]);
}

export async function uploadInvoice(req, res) {
  if (!req.file) {
    return res.status(400).json({
      message: "Nu ai încărcat niciun fișier.",
    });
  }

  const extractedText = await extractTextFromImage(req.file.buffer);
  const invoiceData = await analyzeInvoiceText(extractedText);

  const result = await db.query(
    `
    INSERT INTO invoices (
      user_id,
      supplier_name,
      invoice_number,
      issue_date,
      due_date,
      total_amount,
      currency,
      status,
      extracted_text
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
    `,
    [
      req.user.userId,
      invoiceData.supplier_name,
      invoiceData.invoice_number,
      invoiceData.issue_date,
      invoiceData.due_date,
      invoiceData.total_amount,
      invoiceData.currency || "RON",
      "Procesată AI",
      extractedText,
    ]
  );

  res.status(201).json(result.rows[0]);
}