import { z } from "zod";

const carPricingSchema = z.object({
  car: z.string({
    required_error: "Car ID is required",
  }),
  fare: z.number({
    required_error: "Fare is required",
  }),
  discountedFare: z.number().optional(),
});

const createPackageZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Package name is required",
    }),
    description: z.string().optional(),
    pickupLocation: z.string({
      required_error: "Pickup location ID is required",
    }),
    dropLocation: z.string({
      required_error: "Drop location ID is required",
    }),
    carPricing: z.array(carPricingSchema, {
      required_error: "At least one car pricing is required",
    }),
    features: z.array(z.string()).optional(),
    createdBy: z.string({
      required_error: "Creator ID is required",
    }),
    image: z.string().optional(),
  }),
});

const updatePackageZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    pickupLocation: z.string().optional(),
    dropLocation: z.string().optional(),
    carPricing: z.array(carPricingSchema).optional(),
    features: z.array(z.string()).optional(),
    image: z.string().optional(),
  }),
});

export const PackageValidation = {
  createPackageZodSchema,
  updatePackageZodSchema,
};
