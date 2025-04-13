import { z } from "zod";

const createPackageZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Package name is required",
    }),
    description: z.string().optional(),
    pickupLocation: z.string({
      required_error: "Pickup location is required",
    }),
    dropLocation: z.string({
      required_error: "Drop location is required",
    }),
    car: z.string({
      required_error: "Car is required",
    }),
    basePrice: z.number({
      required_error: "Base price is required",
    }),
    discountedPrice: z.number().optional(),
    startDate: z
      .string({
        required_error: "Start date is required",
      })
      .transform((str) => new Date(str)),
    endDate: z
      .string({
        required_error: "End date is required",
      })
      .transform((str) => new Date(str)),
    features: z.array(z.string()).optional(),
    image: z.string().optional(),
  }),
});

const updatePackageZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    pickupLocation: z.string().optional(),
    dropLocation: z.string().optional(),
    car: z.string().optional(),
    basePrice: z.number().optional(),
    discountedPrice: z.number().optional(),
    startDate: z
      .string()
      .optional()
      .transform((str) => (str ? new Date(str) : undefined)),
    endDate: z
      .string()
      .optional()
      .transform((str) => (str ? new Date(str) : undefined)),
    available: z.boolean().optional(),
    features: z.array(z.string()).optional(),
    image: z.string().optional(),
  }),
});

export const PackageValidation = {
  createPackageZodSchema,
  updatePackageZodSchema,
};
