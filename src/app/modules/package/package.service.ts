import { IPackage, IPackageFilters } from "./package.interface";
import { Package } from "./package.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";
import { packageSearchableFields } from "./package.constants";

const createPackage = async (payload: IPackage): Promise<IPackage> => {
  // Validate that carPricing has at least one item
  if (!payload.carPricing || payload.carPricing.length === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "At least one car pricing is required"
    );
  }

  const createdPackage = await Package.create(payload);
  return createdPackage;
};

const getAllPackages = async (
  filters: IPackageFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IPackage[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: packageSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    const filterConditions = Object.entries(filtersData).map(
      ([field, value]) => {
        if (field === "minFare") {
          return { "carPricing.fare": { $gte: value } };
        } else if (field === "maxFare") {
          return { "carPricing.fare": { $lte: value } };
        } else if (field === "car") {
          return { "carPricing.car": value };
        } else {
          return { [field]: value };
        }
      }
    );
    andConditions.push({ $and: filterConditions });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Package.find(whereConditions)
    .populate("pickupLocation")
    .populate("dropLocation")
    .populate("carPricing.car")
    // .populate("createdBy")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Package.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getPackageById = async (id: string): Promise<IPackage | null> => {
  const result = await Package.findById(id)
    .populate("pickupLocation")
    .populate("dropLocation")
    .populate("carPricing.car");
  // .populate("createdBy");

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Package not found");
  }
  return result;
};

const updatePackage = async (
  id: string,
  payload: Partial<IPackage>
): Promise<IPackage | null> => {
  const existingPackage = await Package.findById(id);
  if (!existingPackage) {
    throw new ApiError(httpStatus.NOT_FOUND, "Package not found");
  }

  // If updating carPricing, validate it's not empty
  if (payload.carPricing && payload.carPricing.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Car pricing cannot be empty");
  }

  const result = await Package.findByIdAndUpdate(id, payload, { new: true })
    .populate("pickupLocation")
    .populate("dropLocation")
    .populate("carPricing.car");
  // .populate("createdBy");

  return result;
};

const deletePackage = async (id: string): Promise<IPackage | null> => {
  const result = await Package.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Package not found");
  }
  return result;
};

export const PackageService = {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
};
