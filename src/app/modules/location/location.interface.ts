import { Model } from "mongoose";

export interface ILocation {
  location: string;
  country: string;
  state: string;
  city: string;
  zipCode?: string;
}

export interface ILocationFilters {
  searchTerm?: string;
  location?: string;
  country?: string;
  state?: string;
  city?: string;
}

export type ILocationModel = Model<ILocation, Record<string, unknown>>;
