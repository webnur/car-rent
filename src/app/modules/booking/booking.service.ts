import { IBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";
import { User } from "../users/user.model";
import { Car } from "../car/car.model";
import { Package } from "../package/package.model";

const createBooking = async (bookingData: IBooking): Promise<IBooking> => {
  const user = await User.findById(bookingData.user);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  const car = await Car.findById(bookingData.car);
  if (!car) {
    throw new ApiError(httpStatus.NOT_FOUND, "Car not found");
  }

  const packageData = await Package.findById(bookingData.package);

  if (!packageData) {
    throw new ApiError(httpStatus.NOT_FOUND, "Package not found");
  }

  const result = await Booking.create(bookingData);
  return result;
};

const getAllBookings = async (
  filters: any,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IBooking[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: ["paymentStatus", "paymentType", "transactionId"].map((field) => ({
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

  const result = await Booking.find(whereConditions)
    .populate("user")
    .populate("car")
    .populate("pickupLocation")
    .populate("dropLocation")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Booking.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleBooking = async (id: string): Promise<IBooking | null> => {
  const result = await Booking.findById(id)
    .populate("user")
    .populate("car")
    .populate("pickupLocation")
    .populate("dropLocation");
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Booking not found");
  }
  return result;
};

const updateBooking = async (
  id: string,
  payload: Partial<IBooking>
): Promise<IBooking | null> => {
  const isExist = await Booking.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Booking not found");
  }

  const result = await Booking.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  })
    .populate("user")
    .populate("car")
    .populate("pickupLocation")
    .populate("dropLocation");
  return result;
};

const deleteBooking = async (id: string): Promise<IBooking | null> => {
  const result = await Booking.findByIdAndDelete(id)
    .populate("user")
    .populate("car")
    .populate("pickupLocation")
    .populate("dropLocation");
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Booking not found");
  }
  return result;
};

const getUserBookings = async (
  userId: string,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IBooking[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await Booking.find({ user: userId })
    .populate("car")
    .populate("pickupLocation")
    .populate("dropLocation")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Booking.countDocuments({ user: userId });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const BookingService = {
  createBooking,
  getAllBookings,
  getSingleBooking,
  updateBooking,
  deleteBooking,
  getUserBookings,
};
