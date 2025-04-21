import httpStatus from "http-status";

import { SortOrder } from "mongoose";
import { ITourBook, ITourBookStatus } from "./tour-book.interface";
import TourBook from "./tour-book.model";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import ApiError from "../../../errors/ApiError";

const createTourBook = async (tourBookData: ITourBook): Promise<ITourBook> => {
  const result = await TourBook.create(tourBookData);
  return result;
};

const getAllTourBooks = async (
  filters: any,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ITourBook[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: [
        "name",
        "email",
        "phoneNumber",
        "pickupLocation",
        "dropoffLocation",
      ].map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => {
        if (field === "status") {
          return { [field]: value };
        }
        if (field === "pickupDate" || field === "dropoffDate") {
          return { [field]: { $gte: new Date(value as string) } };
        }
        if (field === "numberOfPeople") {
          return { [field]: { $gte: parseInt(value as string) } };
        }
        return {
          [field]: {
            $regex: new RegExp(value as string, "i"),
          },
        };
      }),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await TourBook.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await TourBook.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleTourBook = async (id: string): Promise<ITourBook | null> => {
  const result = await TourBook.findById(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "TourBook not found");
  }
  return result;
};

const updateTourBook = async (
  id: string,
  payload: Partial<ITourBook>
): Promise<ITourBook | null> => {
  const isExist = await TourBook.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "TourBook not found");
  }

  const result = await TourBook.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deleteTourBook = async (id: string): Promise<ITourBook | null> => {
  const result = await TourBook.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "TourBook not found");
  }
  return result;
};

const updateTourBookStatus = async (
  id: string,
  status: ITourBookStatus
): Promise<ITourBook | null> => {
  const result = await TourBook.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "TourBook not found");
  }
  return result;
};

const getTourBooksByStatus = async (
  status: ITourBookStatus,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ITourBook[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await TourBook.find({ status })
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await TourBook.countDocuments({ status });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const TourBookService = {
  createTourBook,
  getAllTourBooks,
  getSingleTourBook,
  updateTourBook,
  deleteTourBook,
  updateTourBookStatus,
  getTourBooksByStatus,
};
