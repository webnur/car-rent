// payment-history.interface.ts
import { Document, Model, Types } from "mongoose";
import { IPayment } from "../payment/payment.interface";

export enum PaymentAction {
  CREATED = "created",
  ATTEMPTED = "attempted",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export interface IPaymentHistory extends Document {
  payment: Types.ObjectId | IPayment;
  action: PaymentAction;
  amount?: number;
  status?: string;
  details?: any;
  performedBy?: Types.ObjectId; // User or system
  createdAt: Date;
}

export interface IPaymentHistoryModel extends Model<IPaymentHistory> {
  // Add any static methods here if needed
}

export interface IPaymentHistoryFilters {
  searchTerm?: string;
  action?: PaymentAction;
  status?: string;
  payment?: Types.ObjectId;
  performedBy?: Types.ObjectId;
}
