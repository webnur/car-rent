import { z } from "zod";

const createOrderZodSchema = z.object({
  body: z.object({
    package: z.string({
      required_error: "Package ID is required",
    }),
    user: z.string({
      required_error: "User ID is required",
    }),
    car: z.string({
      required_error: "Car ID is required",
    }),
    pickupDate: z
      .string({
        required_error: "Pickup date is required",
      })
      .datetime(),
    dropDate: z
      .string({
        required_error: "Drop date is required",
      })
      .datetime(),
    totalAmount: z.number({
      required_error: "Total amount is required",
    }),
    discountedAmount: z.number().optional(),
    status: z
      .enum(["pending", "confirmed", "completed", "cancelled"])
      .optional(),
    paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
  }),
});

const updateOrderZodSchema = z.object({
  body: z.object({
    package: z.string().optional(),
    car: z.string().optional(),
    pickupDate: z.string().datetime().optional(),
    dropDate: z.string().datetime().optional(),
    totalAmount: z.number().optional(),
    discountedAmount: z.number().optional(),
    status: z
      .enum(["pending", "confirmed", "completed", "cancelled"])
      .optional(),
    paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
  }),
});

export const OrderValidation = {
  createOrderZodSchema,
  updateOrderZodSchema,
};
