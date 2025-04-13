import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PackageService } from "./package.service";
import { IPackage } from "./package.interface";
import pick from "../../../shared/pick";
import { packageFilterableFields } from "./package.constants";

const createPackage = catchAsync(async (req: Request, res: Response) => {
  const { ...packageData } = req.body;
  packageData.createdBy = req.user?._id; // Set the admin who created the package

  const result = await PackageService.createPackage(packageData);

  sendResponse<IPackage>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Package created successfully",
    data: result,
  });
});

const getAllPackages = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, packageFilterableFields);
  const result = await PackageService.getAllPackages();

  sendResponse<IPackage[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Packages retrieved successfully",
    data: result,
  });
});

const getPackageById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PackageService.getPackageById(id);

  sendResponse<IPackage>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Package retrieved successfully",
    data: result,
  });
});

const updatePackage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body;
  const result = await PackageService.updatePackage(id, updatedData);

  sendResponse<IPackage>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Package updated successfully",
    data: result,
  });
});

const deletePackage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
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
