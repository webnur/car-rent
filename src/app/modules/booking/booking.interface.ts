import { Model, Types } from "mongoose";

export interface IBooking {
  user: Types.ObjectId;
  car: Types.ObjectId;
  pickupLocation: Types.ObjectId;
  dropLocation: Types.ObjectId;
  pickUpTime: Date;
  dropOffTime?: Date;
  totalAmount: number;
  paymentStatus: "pending" | "partial" | "paid" | "cancelled";
  paymentType: "full" | "partial" | "free";
  amountPaid?: number;
  transactionId?: string;
}

export interface IBookingFilters {
  user?: Types.ObjectId;
  car?: Types.ObjectId;
  pickupLocation?: Types.ObjectId;
  dropLocation?: Types.ObjectId;
  pickUpTime?: Date;
  dropOffTime?: Date;
  totalAmount?: number;
  paymentStatus?: "pending" | "partial" | "paid" | "cancelled";
  paymentType?: "full" | "partial" | "free";
  amountPaid?: number;
  transactionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  searchTerm?: string;
}

export type IBookingModel = Model<IBooking, Record<string, unknown>>;
