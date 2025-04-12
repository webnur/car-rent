import { Schema, Types, model } from "mongoose";
import { ILocation, ILocationModel } from "./location.interface";

const LocationSchema = new Schema<ILocation, ILocationModel>(
  {
    location: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    zipCode: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Location = model<ILocation, ILocationModel>(
  "Location",
  LocationSchema
);
