import { Model } from "mongoose";

export interface ICar {
  name: string;
  model: string;
  seats: number;
  dailyRate: number;
  hourlyRate: number;
  available: boolean;
  image: string;
}

export interface ICarFilters {
  searchTerm?: string;
  name?: string;
  seats?: string;
  dailyRate?: string;
  hourlyRate?: string;
}

export type ICarModel = Model<ICar, Record<string, unknown>>;
