import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { ENV } from "./env";
import { createOrUpdateSubscription, addCredits, getUserByOpenId, upsertUser } from "../db";
import { sendWelcomeEmail } from "./email";
import { notifyOwner } from "./notification";
import { stripe } from "./stripe"; // Reuse graceful Stripe instance

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

// Stripe plan → credits mapping
const PLAN_CREDITS: Record<string, number> = {
  starter: 10,
  starter_yearly: 120, // 10 credits/month × 12 months
  pro: 0,              // Pro has unlimited AI, no credits
  pro_monthly: 0,
};

// Stripe plan → readable name
const PLAN_NAMES: Record<string, string> = {
  starter: "Starter 月費",
  starter_yearly: "Starter 年費",
  pro: "Pro 一次性",
  pro_monthly: "Pro 月費",
};

// Register or lookup a guest user by email
async function getOrCreateUserByEmail(email: string): Promise<string> {
  // Find existing user by email
  const existing = await getUserByOpenId(`email:${email}`);
  if (existing) return existing.openId;

  // Create a new guest user
  const openId = `email:${email}`;
  await upsertUser({
    openId,
    email,
    name: email.split("@")[0],
    loginMethod: "stripe",
  });
  return openId;
}

// Handle payment success: activate subscription + grant credits
async function handlePaymentSuccess(event: Stripe.Event, stripe: Stripe) {
  let customerEmail = "";
  let customerId = "";
  let planKey = "";
  let subscriptionId = "";

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    customerEmail = session.customer_email || "";
    customerId = session.customer as string || "";
    planKey = session.metadata?.plan || "";
    subscriptionId = session.subscription as string || "";
  } else if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    customerEmail = pi.metadata?.email || "";
    customerId = pi.customer as string || "";
    planKey = pi.metadata?.plan || "";
  }

  if (!customerEmail && !customerId) {
    console.warn("[Stripe] No email or customer ID found in event");
    return;
  }

  const planName = PLAN_NAMES[planKey] || planKey;
  const credits = PLAN_CREDITS[planKey] || 0;

  // Get or create user
  const openId = customerEmail
    ? await getOrCreateUserByEmail(customerEmail)
    : `stripe:${customerId}`;

  // Activate subscription
  await createOrUpdateSubscription({
    openId,
    plan: planKey as any,
    stripeCustomerId: customerId || undefined,
    stripeSubscriptionId: subscriptionId || undefined,
    status: "active",
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Approximate
  });

  // Grant credits for Starter plans
  if (credits > 0) {
    await addCredits(openId, credits);
  }

  // Send welcome email
  try {
    await sendWelcomeEmail({
      email: customerEmail,
      planName,
      credits,
    });
  } catch (emailError) {
    console.warn("[Email] Failed to send welcome email:", emailError);
  }

  // Notify owner via Telegram
  try {
    await notifyOwner({
      title: "💳 新付款成功",
      content: [
        `方案：${planName}`,
        `客戶：${customerEmail || customerId}`,
        credits > 0 ? `已發放：${credits} credits` : "Pro 用戶（無限 AI）",
        `時間：${new Date().toLocaleString("zh-HK")}`,
      ].join("\n"),
    });
  } catch (notifyError) {
    console.warn("[Notify] Failed to send Telegram notification:", notifyError);
  }

  console.log(`[Stripe] ✓ Activated ${planName} for ${customerEmail}. Credits granted: ${credits}`);
}

// Handle subscription renewal: extend credits
async function handleSubscriptionRenewal(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;
  const customerEmail = invoice.customer_email || "";
  const subscriptionId = invoice.subscription as string;

  if (!customerEmail) return;

  const openId = `email:${customerEmail}`;
  const credits = PLAN_CREDITS["starter"] || 10;

  await addCredits(openId, credits);
  console.log(`[Stripe] ✓ Renewed Starter: added ${credits} credits for ${customerEmail}`);
}

// Handle subscription cancellation
async function handleSubscriptionCancelled(event: Stripe.Event) {
  const sub = event.data.object as Stripe.Subscription;
  const customerId = sub.customer as string;

  if (!customerId) return;

  const openId = `stripe:${customerId}`;
  const { getSubscriptionByOpenId } = await import("../db");
  const existing = await getSubscriptionByOpenId(openId);

  if (existing) {
    await createOrUpdateSubscription({
      ...existing,
      status: "cancelled",
    });
  }

  try {
    await notifyOwner({
      title: "❌ 訂閱被取消",
      content: `客戶 ID：${customerId}\n時間：${new Date().toLocaleString("zh-HK")}`,
    });
  } catch (notifyError) {
    console.warn("[Notify] Failed to send Telegram notification:", notifyError);
  }

  console.log(`[Stripe] ✓ Subscription cancelled for ${customerId}`);
}

// Stripe Webhook handler — must be BEFORE express.json()
async function registerStripeWebhook(app: express.Express) {
  if (!ENV.stripeSecretKey || !ENV.stripeWebhookSecret) {
    console.warn("[Stripe] Webhook not configured — skipping");
    return;
  }

  // Use the shared graceful stripe instance from ./stripe

  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, ENV.stripeWebhookSecret);
    } catch (err: any) {
      console.error("[Stripe] Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        case "checkout.session.completed":
        case "payment_intent.succeeded":
          await handlePaymentSuccess(event, stripe);
          break;
        case "invoice.payment_succeeded":
          await handleSubscriptionRenewal(event);
          break;
        case "customer.subscription.deleted":
          await handleSubscriptionCancelled(event);
          break;
        default:
          console.log(`[Stripe] Unhandled event type: ${event.type}`);
      }
    } catch (handlerError) {
      console.error("[Stripe] Webhook handler error:", handlerError);
    }

    res.json({ received: true });
  });
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // Stripe Webhook（需要在 express.json() 之後，但在 tRPC 之前）
  await registerStripeWebhook(app);

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
