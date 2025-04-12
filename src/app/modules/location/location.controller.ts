import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { LocationService } from "./location.service";
import { ILocation } from "./location.interface";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { locationFilterableFields } from "./location.constants";

const createLocation = catchAsync(async (req: Request, res: Response) => {
  const { ...locationData } = req.body;
  const result = await LocationService.createLocation(locationData);

  sendResponse<ILocation>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Location created successfully",
    data: result,
  });
});

const getSingleLocation = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await LocationService.getSingleLocation(id);

  sendResponse<ILocation>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Location fetched successfully",
    data: result,
  });
});

const getAllLocations = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, locationFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await LocationService.getAllLocations(
    filters,
    paginationOptions
  );

  sendResponse<ILocation[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Locations fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateLocation = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body;
  const result = await LocationService.updateLocation(id, updatedData);

  sendResponse<ILocation>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Location updated successfully",
    data: result,
  });
});

const deleteLocation = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await LocationService.deleteLocation(id);

  sendResponse<ILocation>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Location deleted successfully",
    data: result,
  });
});

export const LocationController = {
  createLocation,
  getSingleLocation,
  getAllLocations,
  updateLocation,
  deleteLocation,
};
