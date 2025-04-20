import { Request, Response } from "express";
import httpStatus from "http-status";
import { paginationFields } from "../../../constants/pagination";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { PaymentService } from "./payment.service";
import { IPayment } from "./payment.interface";
import { paymentFilterableFields } from "./payment.constants";

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await PaymentService.createPayment(payload);

  sendResponse<IPayment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment created successfully",
    data: result,
  });
});

const getAllPayments = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, paymentFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await PaymentService.getAllPayments(
    filters,
    paginationOptions
  );

  sendResponse<IPayment[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payments retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await PaymentService.getPaymentById(id);

  sendResponse<IPayment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment retrieved successfully",
    data: result,
  });
});

const updatePayment = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const result = await PaymentService.updatePayment(id, payload);

  sendResponse<IPayment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment updated successfully",
    data: result,
  });
});

const deletePayment = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await PaymentService.deletePayment(id);

  sendResponse<IPayment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment deleted successfully",
    data: result,
  });
});

const getUserPayments = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const paginationOptions = pick(req.query, paginationFields);

  const result = await PaymentService.getUserPayments(
    userId,
    paginationOptions
  );

  sendResponse<IPayment[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User payments retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const PaymentController = {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  getUserPayments,
};
