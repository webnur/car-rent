import { IPayment, IPaymentFilters } from "./payment.interface";
import { Payment } from "./payment.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";
import { Order } from "../order/order.model";
import { User } from "../users/user.model";
import { paymentSearchableFields } from "./payment.constants";

const createPayment = async (payload: IPayment): Promise<IPayment> => {
  // Validate order exists
  const orderExists = await Order.findById(payload.order);
  if (!orderExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  // Validate user exists
  const userExists = await User.findById(payload.user);
  if (!userExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Validate payment method
  if (!["paypal", "stripe"].includes(payload.paymentMethod)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid payment method");
  }

  const createdPayment = await Payment.create(payload);

  // Update order payment status
  if (payload.status === "success") {
    await Order.findByIdAndUpdate(payload.order, {
      paymentStatus: "paid",
      status: "confirmed",
    });
  }

  return createdPayment;
};

const getAllPayments = async (
  filters: IPaymentFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IPayment[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: paymentSearchableFields.map((field) => ({
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
          return { amount: { $gte: value } };
        } else if (field === "maxAmount") {
          return { amount: { $lte: value } };
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

  const result = await Payment.find(whereConditions)
    .populate("order")
    .populate("user")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Payment.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getPaymentById = async (id: string): Promise<IPayment | null> => {
  const result = await Payment.findById(id).populate("order").populate("user");

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment not found");
  }
  return result;
};

const updatePayment = async (
  id: string,
  payload: Partial<IPayment>
): Promise<IPayment | null> => {
  const existingPayment = await Payment.findById(id);
  if (!existingPayment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment not found");
  }

  // If updating status to success, update order status
  if (payload.status === "success") {
    await Order.findByIdAndUpdate(existingPayment.order, {
      paymentStatus: "paid",
      status: "confirmed",
    });
  }

  const result = await Payment.findByIdAndUpdate(id, payload, { new: true })
    .populate("order")
    .populate("user");

  return result;
};

const deletePayment = async (id: string): Promise<IPayment | null> => {
  const result = await Payment.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment not found");
  }
  return result;
};

const getUserPayments = async (
  userId: string,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IPayment[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await Payment.find({ user: userId })
    .populate("order")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Payment.countDocuments({ user: userId });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const PaymentService = {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  getUserPayments,
};
