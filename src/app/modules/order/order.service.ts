import { IOrder, IOrderFilters } from "./order.interface";
import { Order } from "./order.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";
import { Package } from "../package/package.model";
import { Car } from "../car/car.model";
import { User } from "../users/user.model";
import { orderSearchableFields } from "./order.constants";

const createOrder = async (payload: IOrder): Promise<IOrder> => {
  // Validate package exists
  const packageExists = await Package.findById(payload.package);
  if (!packageExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Package not found");
  }

  // Validate user exists
  const userExists = await User.findById(payload.user);
  if (!userExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Validate car exists
  const carExists = await Car.findById(payload.car);
  if (!carExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Car not found");
  }

  // Validate pickup and drop dates
  if (payload.pickupDate >= payload.dropDate) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Drop date must be after pickup date"
    );
  }

  const createdOrder = await Order.create(payload);
  return createdOrder;
};

const getAllOrders = async (
  filters: IOrderFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IOrder[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: orderSearchableFields.map((field) => ({
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
        if (field === "minAmount") {
          return { totalAmount: { $gte: value } };
        } else if (field === "maxAmount") {
          return { totalAmount: { $lte: value } };
        } else if (field === "startDate") {
          return { pickupDate: { $gte: new Date(value) } };
        } else if (field === "endDate") {
          return { dropDate: { $lte: new Date(value) } };
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

  const result = await Order.find(whereConditions)
    .populate("package")
    .populate("user")
    .populate("car")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getOrderById = async (id: string): Promise<IOrder | null> => {
  const result = await Order.findById(id)
    .populate("package")
    .populate("user")
    .populate("car");

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }
  return result;
};

const updateOrder = async (
  id: string,
  payload: Partial<IOrder>
): Promise<IOrder | null> => {
  const existingOrder = await Order.findById(id);
  if (!existingOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  // Validate dates if being updated
  if (payload.pickupDate || payload.dropDate) {
    const pickupDate = payload.pickupDate || existingOrder.pickupDate;
    const dropDate = payload.dropDate || existingOrder.dropDate;

    if (pickupDate >= dropDate) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Drop date must be after pickup date"
      );
    }
  }

  const result = await Order.findByIdAndUpdate(id, payload, { new: true })
    .populate("package")
    .populate("user")
    .populate("car");

  return result;
};

const deleteOrder = async (id: string): Promise<IOrder | null> => {
  const result = await Order.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }
  return result;
};

const getUserOrders = async (
  userId: string,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IOrder[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await Order.find({ user: userId })
    .populate("package")
    .populate("car")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments({ user: userId });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getUserOrders,
};
