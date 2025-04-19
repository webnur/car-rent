import { Request, Response } from "express";
import httpStatus from "http-status";
import { paginationFields } from "../../../constants/pagination";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { PackageService } from "./package.service";
import { packageFilterableFields } from "./package.constants";
import { IPackage } from "./package.interface";

const createPackage = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await PackageService.createPackage(payload);

  sendResponse<IPackage>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Package created successfully",
    data: result,
  });
});

const getAllPackages = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, packageFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await PackageService.getAllPackages(
    filters,
    paginationOptions
  );

  sendResponse<IPackage[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Packages retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getPackageById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await PackageService.getPackageById(id);

  sendResponse<IPackage>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Package retrieved successfully",
    data: result,
  });
});

const updatePackage = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const result = await PackageService.updatePackage(id, payload);

  sendResponse<IPackage>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Package updated successfully",
    data: result,
  });
});

const deletePackage = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await PackageService.deletePackage(id);

  sendResponse<IPackage>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Package deleted successfully",
    data: result,
  });
});

export const PackageController = {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
};
