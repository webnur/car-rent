import { Model, Types } from "mongoose";

export interface IPackage {
  name: string;
  description?: string;
  pickupLocation: Types.ObjectId;
  dropLocation: Types.ObjectId;
  car: Types.ObjectId;
  basePrice: number;
  discountedPrice?: number;
  startDate: Date;
  endDate: Date;
  available?: boolean;
  features?: string[];
  createdBy: Types.ObjectId;
  image?: string;
}

export interface IPackageFilters {
  searchTerm?: string;
  pickupLocation?: string;
  dropLocation?: string;
  car?: string;
  basePrice?: number;
  discountedPrice?: number;
  startDate?: Date;
  endDate?: Date;
  available?: boolean;
  features?: string[];
}

export type IPackageModel = Model<IPackage, Record<string, unknown>>;
