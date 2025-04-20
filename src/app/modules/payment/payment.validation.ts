import { z } from "zod";

const createPaymentZodSchema = z.object({
  body: z.object({
    order: z.string({
      required_error: "Order ID is required",
    }),
    user: z.string({
      required_error: "User ID is required",
    }),
    amount: z.number({
      required_error: "Amount is required",
    }),
    currency: z.string().default("USD"),
    paymentMethod: z.enum(["paypal", "stripe"], {
      required_error: "Payment method is required",
    }),
    status: z
      .enum(["pending", "success", "failed", "refunded"])
      .default("pending"),
    transactionId: z.string({
      required_error: "Transaction ID is required",
    }),
  }),
});

const updatePaymentZodSchema = z.object({
  body: z.object({
    order: z.string().optional(),
    amount: z.number().optional(),
    currency: z.string().optional(),
    paymentMethod: z.enum(["paypal", "stripe"]).optional(),
    status: z.enum(["pending", "success", "failed", "refunded"]).optional(),
    transactionId: z.string().optional(),
  }),
});

export const PaymentValidation = {
  createPaymentZodSchema,
  updatePaymentZodSchema,
};
