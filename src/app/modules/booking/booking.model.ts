import { Schema, model } from "mongoose";
import { IBooking, IBookingModel } from "./booking.interface";

const bookingSchema = new Schema<IBooking, IBookingModel>(
  {
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
    package: {
      type: Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    pickUpTime: {
      type: Date,
      required: true,
    },
    dropOffTime: {
      type: Date,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "paid", "cancelled"],
      default: "pending",
    },
    paymentType: {
      type: String,
      enum: ["full", "partial", "free"],
      default: "free",
      required: true,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    transactionId: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Booking = model<IBooking, IBookingModel>("Booking", bookingSchema);
