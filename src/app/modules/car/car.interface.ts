import { Model } from "mongoose";

export interface ICar {
  name: string;
  model: string;
  bags: number;
  seats: number;
  image: string;
}

export interface ICarFilters {
  searchTerm?: string;
  name?: string;
  seats?: string;
}

export type ICarModel = Model<ICar, Record<string, unknown>>;
