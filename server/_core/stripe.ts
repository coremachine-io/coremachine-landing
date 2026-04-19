import Stripe from "stripe";
import { ENV } from "./env";
import { router, publicProcedure } from "./trpc";
import { z } from "zod";

const stripe = new Stripe(ENV.stripeSecretKey ?? "sk_test_placeholder", {
  apiVersion: "2025-04-30.basil",
});

// 方案定義
const PLANS = {
  starter: {
    name: "Starter",
    description: "每月 10 次 AI 文件生成 + 最新資助資訊",
    price: 38, // HKD
    priceId: "price_starter_monthly", // 等 Johnny 喺 Stripe Dashboard 建立
    interval: "month" as const,
  },
  starter_yearly: {
    name: "Starter Yearly",
    description: "年費方案，相當於每月 HK$32",
    price: 388, // HKD
    priceId: "price_starter_yearly",
    interval: "year" as const,
  },
  pro: {
    name: "Pro",
    description: "無限 AI 生成 + 公司註冊/秘書服務 + 全程申請代辦",
    price: 12800, // HKD 一次性
    priceId: "price_pro_one_time",
    interval: "once" as const,
  },
  pro_monthly: {
    name: "Pro Monthly",
    description: "Pro 月費計劃",
    price: 1800, // HKD/月
    priceId: "price_pro_monthly",
    interval: "month" as const,
  },
} as const;

type PlanKey = keyof typeof PLANS;

export const stripeRouter = router({
  // 獲取方案列表
  getPlans: publicProcedure.query(() => {
    return Object.entries(PLANS).map(([key, plan]) => ({
      key,
      ...plan,
    }));
  }),

  // 建立 Checkout Session
  createCheckoutSession: publicProcedure
    .input(z.object({
      planKey: z.enum(["starter", "starter_yearly", "pro", "pro_monthly"]),
      successUrl: z.string().url(),
      cancelUrl: z.string().url(),
      email: z.string().email().optional(), // 用於識別用戶
    }))
    .mutation(async ({ input }) => {
      const plan = PLANS[input.planKey as PlanKey];
      
      if (!plan) {
        throw new Error("Invalid plan");
      }

      // 如果係一次性付款，用 paymentIntent
      if (plan.interval === "once") {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: plan.price * 100, // Stripe 用 cents
          currency: "hkd",
          automatic_payment_methods: {
            enabled: true,
          },
          metadata: {
            plan: input.planKey,
            productName: plan.name,
            email: input.email ?? "",
          },
        });
        return {
          clientSecret: paymentIntent.client_secret,
          type: "payment" as const,
        };
      }

      // 訂閱方案：用 Checkout Session
      if (!plan.priceId || plan.priceId === `price_${input.planKey}`) {
        // 價格 ID 未設置，返回提示
        return {
          error: "Stripe Price ID 未配置。請喺 Stripe Dashboard 建立產品並設置 STRIPE_PRICE_ID_* 環境變量。",
          type: "not_configured" as const,
        };
      }

      const sessionParams: any = {
        mode: "subscription",
        line_items: [
          {
            price: plan.priceId,
            quantity: 1,
          },
        ],
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
        metadata: {
          plan: input.planKey,
        },
      };

      // 如果提供了 email，設置 customer_email
      if (input.email) {
        sessionParams.customer_email = input.email;
      }

      const session = await stripe.checkout.sessions.create(sessionParams);

      return {
        url: session.url,
        type: "subscription" as const,
      };
    }),

  // 建立 Payment Intent（一次性付款）
  createPaymentIntent: publicProcedure
    .input(z.object({
      amount: z.number().min(100).max(1000000), // HKD 1 - 10000
      planKey: z.string(),
    }))
    .mutation(async ({ input }) => {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: input.amount * 100, // 轉為 cents
        currency: "hkd",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          plan: input.planKey,
        },
      });
      return {
        clientSecret: paymentIntent.client_secret,
      };
    }),

  // Webhook handler（server番歸後喺 Railway 度設置）
  webhook: publicProcedure
    .input(z.object({
      payload: z.string(),
      signature: z.string(),
    }))
    .mutation(async ({ input }) => {
      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(
          input.payload,
          input.signature,
          ENV.stripeWebhookSecret ?? "whsec_placeholder"
        );
      } catch (err) {
        throw new Error(`Webhook signature verification failed`);
      }

      switch (event.type) {
        case "checkout.session.completed":
          // 客戶完成付款
          console.log("[Stripe] Checkout completed:", event.data.object);
          break;
        case "payment_intent.succeeded":
          // 一次性付款成功
          console.log("[Stripe] Payment succeeded:", event.data.object);
          break;
        case "invoice.payment_succeeded":
          // 訂閱續費成功
          console.log("[Stripe] Invoice paid:", event.data.object);
          break;
        case "customer.subscription.deleted":
          // 訂閱取消
          console.log("[Stripe] Subscription cancelled:", event.data.object);
          break;
      }

      return { received: true };
    }),
});

export { PLANS };
