import Stripe from "stripe";
import { db } from "../../config/db.js";
import { env } from "../../config/env.js";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function createInvoiceCheckout(req, res) {
  const { invoiceId } = req.body;

  const userResult = await db.query(
    `
    SELECT id, email, name, stripe_customer_id
    FROM users
    WHERE id = $1
    `,
    [req.user.userId]
  );

  const user = userResult.rows[0];

  let customerId = user.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: {
        userId: user.id,
      },
    });

    customerId = customer.id;

    await db.query(
      `
      UPDATE users
      SET stripe_customer_id = $1,
          updated_at = NOW()
      WHERE id = $2
      `,
      [customerId, user.id]
    );
  }

  const invoiceResult = await db.query(
    `
    SELECT id, supplier_name, total_amount, currency
    FROM invoices
    WHERE id = $1 AND user_id = $2
    `,
    [invoiceId, req.user.userId]
  );

  const invoice = invoiceResult.rows[0];

  if (!invoice) {
    return res.status(404).json({
      message: "Factura nu a fost găsită.",
    });
  }

  if (!invoice.total_amount) {
    return res.status(400).json({
      message: "Factura nu are total valid.",
    });
  }

  const amountInCents = Math.round(Number(invoice.total_amount) * 100);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: customerId,
    payment_method_types: ["card"],

    payment_intent_data: {
      setup_future_usage: "off_session",
    },

    line_items: [
      {
        price_data: {
          currency: (invoice.currency || "ron").toLowerCase(),
          product_data: {
            name: `Plată factură - ${invoice.supplier_name || "Furnizor"}`,
          },
          unit_amount: amountInCents,
        },
        quantity: 1,
      },
    ],

    metadata: {
      invoiceId: invoice.id,
      userId: req.user.userId,
    },

    success_url: `${env.FRONTEND_URL}/invoice/${invoice.id}?payment=success`,
    cancel_url: `${env.FRONTEND_URL}/invoice/${invoice.id}?payment=cancel`,
  });

  await db.query(
    `
    INSERT INTO payments (
      user_id,
      invoice_id,
      stripe_checkout_session_id,
      amount,
      currency,
      status
    )
    VALUES ($1, $2, $3, $4, $5, 'pending')
    `,
    [
      req.user.userId,
      invoice.id,
      session.id,
      invoice.total_amount,
      invoice.currency || "RON",
    ]
  );

  res.json({ url: session.url });
}

export async function stripeWebhook(req, res) {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
  console.error("STRIPE WEBHOOK ERROR:", err.message);

  return res.status(400).json({
    message: err.message,
  });
}

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const paymentIntent = await stripe.paymentIntents.retrieve(
      session.payment_intent
    );

    const paymentMethodId = paymentIntent.payment_method;
    const invoiceId = session.metadata.invoiceId;
    const userId = session.metadata.userId;

    await db.query(
      `
      UPDATE users
      SET stripe_customer_id = $1,
          default_payment_method_id = $2,
          updated_at = NOW()
      WHERE id = $3
      `,
      [session.customer, paymentMethodId, userId]
    );

    await db.query(
      `
      UPDATE invoices
      SET status = 'Plătită'
      WHERE id = $1 AND user_id = $2
      `,
      [invoiceId, userId]
    );

    await db.query(
      `
      UPDATE payments
      SET stripe_payment_intent_id = $1,
          status = 'succeeded'
      WHERE stripe_checkout_session_id = $2
      `,
      [session.payment_intent, session.id]
    );
  }

  res.json({ received: true });
}
export async function payInvoiceWithSavedCard(req, res) {
  const { invoiceId } = req.body;

  const userResult = await db.query(
    `
    SELECT id, stripe_customer_id, default_payment_method_id
    FROM users
    WHERE id = $1
    `,
    [req.user.userId]
  );

  const user = userResult.rows[0];

  if (!user?.stripe_customer_id || !user?.default_payment_method_id) {
    return res.status(400).json({
      message: "Nu ai un card salvat. Fă prima plată prin Stripe Checkout.",
    });
  }

  const invoiceResult = await db.query(
    `
    SELECT id, supplier_name, total_amount, currency
    FROM invoices
    WHERE id = $1 AND user_id = $2
    `,
    [invoiceId, req.user.userId]
  );

  const invoice = invoiceResult.rows[0];

  if (!invoice) {
    return res.status(404).json({
      message: "Factura nu a fost găsită.",
    });
  }

  if (!invoice.total_amount) {
    return res.status(400).json({
      message: "Factura nu are total valid.",
    });
  }

  const amountInCents = Math.round(Number(invoice.total_amount) * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: (invoice.currency || "ron").toLowerCase(),
    customer: user.stripe_customer_id,
    payment_method: user.default_payment_method_id,
    off_session: true,
    confirm: true,
    metadata: {
      invoiceId: invoice.id,
      userId: req.user.userId,
    },
  });

  await db.query(
    `
    INSERT INTO payments (
      user_id,
      invoice_id,
      stripe_payment_intent_id,
      amount,
      currency,
      status
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    `,
    [
      req.user.userId,
      invoice.id,
      paymentIntent.id,
      invoice.total_amount,
      invoice.currency || "RON",
      paymentIntent.status,
    ]
  );

  await db.query(
    `
    UPDATE invoices
    SET status = 'Plătită'
    WHERE id = $1 AND user_id = $2
    `,
    [invoice.id, req.user.userId]
  );

  res.json({
    message: "Factura a fost plătită automat.",
    paymentIntentId: paymentIntent.id,
    status: paymentIntent.status,
  });
}