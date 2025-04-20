// payment-history.model.ts
import { Schema, model } from "mongoose";
import {
  IPaymentHistory,
  IPaymentHistoryModel,
  PaymentAction,
} from "./payment-history.interface";

const paymentHistorySchema = new Schema<IPaymentHistory, IPaymentHistoryModel>(
  {
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    action: {
      type: String,
      enum: Object.values(PaymentAction),
      required: true,
    },
    amount: Number,
    status: String,
    details: Schema.Types.Mixed,
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const PaymentHistory = model<IPaymentHistory, IPaymentHistoryModel>(
  "PaymentHistory",
  paymentHistorySchema
);
