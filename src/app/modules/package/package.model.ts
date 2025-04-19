import { Schema, model } from "mongoose";
import { IPackage, IPackageModel } from "./package.interface";

const packageSchema = new Schema<IPackage, IPackageModel>(
  {
    name: { type: String, required: true },
    description: String,
    pickupLocation: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    dropLocation: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    carPricing: [
      {
        car: { type: Schema.Types.ObjectId, ref: "Car", required: true },
        fare: { type: Number, required: true },
        discountedFare: Number,
      },
    ],

    features: [String],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    image: String,
  },
  {
    timestamps: true,
  }
);

export const Package = model<IPackage, IPackageModel>("Package", packageSchema);
