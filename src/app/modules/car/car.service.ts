import { ICar } from "./car.interface";
import { Car } from "./car.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";

const createCar = async (carData: ICar): Promise<ICar> => {
  const result = await Car.create(carData);
  return result;
};

const getAllCars = async (
  filters: any,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ICar[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: ["name", "model"].map((field) => ({
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

  const result = await Car.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Car.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleCar = async (id: string): Promise<ICar | null> => {
  const result = await Car.findById(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Car not found");
  }
  return result;
};

const updateCar = async (
  id: string,
  payload: Partial<ICar>
): Promise<ICar | null> => {
  const isExist = await Car.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Car not found");
  }

  const result = await Car.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deleteCar = async (id: string): Promise<ICar | null> => {
  const result = await Car.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Car not found");
  }
  return result;
};

export const CarService = {
  createCar,
  getAllCars,
  getSingleCar,
  updateCar,
  deleteCar,
};
