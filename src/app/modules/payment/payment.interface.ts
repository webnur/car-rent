// payment.interface.ts
import { Document, Model, Types } from "mongoose";
import { IOrder } from "../order/order.interface";

export enum PaymentStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export enum PaymentMethod {
  PAYPAL = "paypal",
  STRIPE = "stripe",
}

export interface IPayment extends Document {
  order: Types.ObjectId | IOrder;
  user: Types.ObjectId;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionId: string; // Payment gateway transaction ID
  paymentDetails?: any; // Raw response from payment gateway
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaymentModel extends Model<IPayment> {
  // Add any static methods here if needed
}

export interface IPaymentFilters {
  searchTerm?: string;
  order?: Types.ObjectId;
  user?: Types.ObjectId;
  status?: PaymentStatus;
  paymentMethod?: PaymentMethod;
}
