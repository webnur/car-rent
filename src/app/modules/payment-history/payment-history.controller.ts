import { Request, Response } from "express";
import httpStatus from "http-status";
import { paginationFields } from "../../../constants/pagination";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { PaymentHistoryService } from "./payment-history.service";

import { IPaymentHistory } from "./payment-history.interface";
import { paymentHistoryFilterableFields } from "./payment-history.constants";

const getAllPaymentHistories = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, paymentHistoryFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await PaymentHistoryService.getAllPaymentHistories(
      filters,
      paginationOptions
    );

    sendResponse<IPaymentHistory[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment histories retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getPaymentHistoryById = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await PaymentHistoryService.getPaymentHistoryById(id);

    sendResponse<IPaymentHistory>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment history retrieved successfully",
      data: result,
    });
  }
);

const getPaymentHistoriesByPayment = catchAsync(
  async (req: Request, res: Response) => {
    const paymentId = req.params.paymentId;
    const paginationOptions = pick(req.query, paginationFields);

    const result = await PaymentHistoryService.getPaymentHistoriesByPayment(
      paymentId,
      paginationOptions
    );

    sendResponse<IPaymentHistory[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment histories retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

export const PaymentHistoryController = {
  getAllPaymentHistories,
  getPaymentHistoryById,
  getPaymentHistoriesByPayment,
};
