// order.model.ts
import { Schema, model } from "mongoose";
import { IOrder, IOrderModel, OrderStatus } from "./order.interface";

const orderSchema = new Schema<IOrder, IOrderModel>(
  {
    package: {
      type: Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    car: {
      type: Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    pickupDate: {
      type: Date,
      required: true,
    },
    dropDate: {
      type: Date,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    discountedAmount: Number,
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["paypal", "stripe"],
    },
    paymentId: String, // Payment gateway reference ID
  },
  {
    timestamps: true,
  }
);

export const Order = model<IOrder, IOrderModel>("Order", orderSchema);
