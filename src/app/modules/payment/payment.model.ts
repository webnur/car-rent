// payment.model.ts
import { Schema, model } from "mongoose";
import {
  IPayment,
  IPaymentModel,
  PaymentMethod,
  PaymentStatus,
} from "./payment.interface";

const paymentSchema = new Schema<IPayment, IPaymentModel>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    transactionId: {
      type: String,
      required: true,
    },
    paymentDetails: Schema.Types.Mixed, // Store raw payment gateway response
  },
  {
    timestamps: true,
  }
);

export const Payment = model<IPayment, IPaymentModel>("Payment", paymentSchema);
