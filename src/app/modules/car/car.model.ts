import { Schema, model } from "mongoose";
import { ICar, ICarModel } from "./car.interface";

const carSchema = new Schema<ICar, ICarModel>(
  {
    name: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    seats: {
      type: Number,
      required: true,
    },
    bags: {
      type: Number,
      required: true,
    },
    image: String,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Car = model<ICar, ICarModel>("Car", carSchema);
