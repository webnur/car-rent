import { Model } from "mongoose";
export type ITourBookStatus = "pending" | "running" | "completed" | "cancelled";
export interface ITourBook {
  name: string;
  description: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: Date;
  dropoffDate: Date;
  pickupTime: string;
  dropoffTime: string;
  numberOfPeople: number;
  address: string;
  phoneNumber: string;
  email: string;
  status: ITourBookStatus;
}

export type ITourBookModel = Model<ITourBook, Record<string, unknown>>;
