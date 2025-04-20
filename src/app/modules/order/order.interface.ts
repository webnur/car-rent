// order.interface.ts
import { Document, Model, Types } from "mongoose";
import { IPackage } from "../package/package.interface";

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface IOrder extends Document {
  package: Types.ObjectId | IPackage;
  user: Types.ObjectId;
  car: Types.ObjectId;
  pickupDate: Date;
  dropDate: Date;
  totalAmount: number;
  discountedAmount?: number;
  status: OrderStatus;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod?: "paypal" | "stripe";
  paymentId?: string; // Payment gateway reference ID
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderModel extends Model<IOrder> {
  // Add any static methods here if needed
}

export interface IOrderFilters {
  searchTerm?: string;
  package?: string;
  user?: string;
  car?: string;
  pickupDate?: Date;
  dropDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  status?: OrderStatus;
  paymentStatus?: "pending" | "paid" | "failed" | "refunded";
  paymentMethod?: "paypal" | "stripe";
}
