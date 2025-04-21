import { Schema, model } from "mongoose";
import { ITourBook, ITourBookModel } from "./tour-book.interface";

const tourBookSchema = new Schema<ITourBook, ITourBookModel>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    pickupLocation: {
      type: String,
      required: [true, "Pickup location is required"],
      trim: true,
    },
    dropoffLocation: {
      type: String,
      required: [true, "Dropoff location is required"],
      trim: true,
    },
    pickupDate: {
      type: Date,
      required: [true, "Pickup date is required"],
    },
    dropoffDate: {
      type: Date,
      required: [true, "Dropoff date is required"],
    },
    pickupTime: {
      type: String,
      required: [true, "Pickup time is required"],
    },
    dropoffTime: {
      type: String,
      required: [true, "Dropoff time is required"],
    },
    numberOfPeople: {
      type: Number,
      required: [true, "Number of people is required"],
      min: [1, "At least one person is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ["pending", "running", "completed", "cancelled"],
      default: "pending",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

const TourBook = model<ITourBook, ITourBookModel>("TourBook", tourBookSchema);

export default TourBook;
