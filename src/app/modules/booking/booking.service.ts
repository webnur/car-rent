import { IBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { Car } from "../car/car.model";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";
import { bookingSearchableFields } from "./booking.constants";

const createBooking = async (payload: IBooking): Promise<IBooking> => {
  // Check car availability
  const car = await Car.findById(payload.car);
  if (!car || !car.available) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Car is not available");
  }

  // Calculate duration in hours
  const durationInHours =
    (payload.dropOffTime.getTime() - payload.pickUpTime.getTime()) /
    (1000 * 60 * 60);

  // Calculate total amount based on duration
  if (durationInHours >= 24) {
    const days = Math.ceil(durationInHours / 24);
    payload.totalAmount = days * car.dailyRate;
  } else {
    payload.totalAmount = Math.ceil(durationInHours) * car.hourlyRate;
  }

  // Set payment amount based on payment type
  if (payload.paymentType === "full") {
    payload.amountPaid = payload.totalAmount;
    payload.paymentStatus = "paid";
  } else if (payload.paymentType === "partial") {
    payload.amountPaid = payload.totalAmount * 0.2; // 20% payment
    payload.paymentStatus = "partial";
  } else {
    payload.amountPaid = 0;
    payload.paymentStatus = "pending";
  }

  // Mark car as unavailable
  car.available = false;
  await car.save();

  const booking = await Booking.create(payload);
  return booking;
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
      $or: bookingSearchableFields.map((field) => ({
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

  // If updating dates, recalculate amount
  if (payload.pickUpTime || payload.dropOffTime) {
    const booking = await Booking.findById(id);
    const car = await Car.findById(booking?.car);

    if (car && booking) {
      const pickUpTime = payload.pickUpTime || booking.pickUpTime;
      const dropOffTime = payload.dropOffTime || booking.dropOffTime;

      if (pickUpTime && dropOffTime) {
        const durationInHours =
          (dropOffTime.getTime() - pickUpTime.getTime()) / (1000 * 60 * 60);

        if (durationInHours >= 24) {
          const days = Math.ceil(durationInHours / 24);
          payload.totalAmount = days * car.dailyRate;
        } else {
          payload.totalAmount = Math.ceil(durationInHours) * car.hourlyRate;
        }
      }
    }
  }

  const result = await Booking.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deleteBooking = async (id: string): Promise<IBooking | null> => {
  const booking = await Booking.findById(id);
  if (!booking) {
    throw new ApiError(httpStatus.NOT_FOUND, "Booking not found");
  }

  // Mark car as available again
  await Car.findByIdAndUpdate(booking.car, { available: true });

  const result = await Booking.findByIdAndDelete(id);
  return result;
};

export const BookingService = {
  createBooking,
  getAllBookings,
  getSingleBooking,
  updateBooking,
  deleteBooking,
};
