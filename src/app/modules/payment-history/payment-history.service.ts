import {
  IPaymentHistory,
  IPaymentHistoryFilters,
} from "./payment-history.interface";
import { PaymentHistory } from "./payment-history.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";
import { paymentHistorySearchableFields } from "./payment-history.constants";

const getAllPaymentHistories = async (
  filters: IPaymentHistoryFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IPaymentHistory[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: paymentHistorySearchableFields.map((field) => ({
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

  const result = await PaymentHistory.find(whereConditions)
    .populate("payment")
    .populate("performedBy")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await PaymentHistory.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getPaymentHistoryById = async (
  id: string
): Promise<IPaymentHistory | null> => {
  const result = await PaymentHistory.findById(id)
    .populate("payment")
    .populate("performedBy");

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment history not found");
  }
  return result;
};

const getPaymentHistoriesByPayment = async (
  paymentId: string,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IPaymentHistory[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await PaymentHistory.find({ payment: paymentId })
    .populate("performedBy")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await PaymentHistory.countDocuments({ payment: paymentId });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const PaymentHistoryService = {
  getAllPaymentHistories,
  getPaymentHistoryById,
  getPaymentHistoriesByPayment,
};
