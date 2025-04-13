import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { CarService } from "./car.service";
import { ICar } from "./car.interface";
import pick from "../../../shared/pick";
import { carFilterableFields } from "./car.constants";
import { paginationFields } from "../../../constants/pagination";

const createCar = catchAsync(async (req: Request, res: Response) => {
  const { ...carData } = req.body;
  const result = await CarService.createCar(carData);

  sendResponse<ICar>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Car created successfully",
    data: result,
  });
});

const getAllCars = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, carFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await CarService.getAllCars(filters, paginationOptions);

  sendResponse<ICar[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cars retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleCar = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CarService.getSingleCar(id);

  sendResponse<ICar>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Car retrieved successfully",
    data: result,
  });
});

const updateCar = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body;
  const result = await CarService.updateCar(id, updatedData);

  sendResponse<ICar>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Car updated successfully",
    data: result,
  });
});

const deleteCar = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CarService.deleteCar(id);

  sendResponse<ICar>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Car deleted successfully",
    data: result,
  });
});

export const CarController = {
  createCar,
  getAllCars,
  getSingleCar,
  updateCar,
  deleteCar,
};
