import { Model, Types } from "mongoose";

export interface ICarPricing {
  car: Types.ObjectId;
  fare: number;
  discountedFare?: number;
}

export interface IPackage {
  name: string;
  description?: string;
  pickupLocation: Types.ObjectId;
  dropLocation: Types.ObjectId;
  carPricing: ICarPricing[];
  features?: string[];
  createdBy: Types.ObjectId;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPackageFilters {
  searchTerm?: string;
  name?: string;
  pickupLocation?: string;
  dropLocation?: string;
  car?: string;
  minFare?: number;
  maxFare?: number;
  features?: string[];
}

export type IPackageModel = Model<IPackage, Record<string, unknown>>;
