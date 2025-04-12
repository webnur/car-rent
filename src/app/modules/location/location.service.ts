import mongoose, { SortOrder } from "mongoose";
import { ILocation, ILocationFilters } from "./location.interface";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { Location } from "./location.model";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { LocationSearchableFields } from "./location.constants";

const createLocation = async (
  locationData: ILocation
): Promise<ILocation | null> => {
  const isExist = await Location.findOne({ location: locationData.location });
  if (isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Location already exists");
  }

  const createdLocation = await Location.create(locationData);
  return createdLocation;
};

const getAllLocations = async (
  filters: ILocationFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ILocation[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: LocationSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Location.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Location.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleLocation = async (id: string): Promise<ILocation | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid location ID");
  }

  const result = await Location.findById(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Location not found");
  }
  return result;
};

const updateLocation = async (
  id: string,
  payload: Partial<ILocation>
): Promise<ILocation | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid location ID");
  }

  const isExist = await Location.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Location not found");
  }

  const result = await Location.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deleteLocation = async (id: string): Promise<ILocation | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid location ID");
  }

  const result = await Location.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Location not found");
  }
  return result;
};

export const LocationService = {
  createLocation,
  getAllLocations,
  getSingleLocation,
  updateLocation,
  deleteLocation,
};
