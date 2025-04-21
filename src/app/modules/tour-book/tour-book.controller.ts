import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import { FileUploadHelper } from "../../../helpers/FileUploadHelper";
import { TourBookService } from "./tour-book.service";
import sendResponse from "../../../shared/sendResponse";
import { ITourBook, ITourBookStatus } from "./tour-book.interface";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { tourBookFilterableFields } from "./tour-book.constants";

const createTourBook = catchAsync(async (req: Request, res: Response) => {
  const { ...tourBookData } = req.body;

  // If you need file upload functionality for tour books
  if (req.file) {
    const uploadedFile = await FileUploadHelper.uploadToCloudinary(req.file);
    if (!uploadedFile) {
      throw new Error("Failed to upload file to Cloudinary");
    }
    tourBookData.image = uploadedFile.secure_url; // or whatever field you want to store
  }

  const result = await TourBookService.createTourBook(tourBookData);

  sendResponse<ITourBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "TourBook created successfully",
    data: result,
  });
});

const getAllTourBooks = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, tourBookFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await TourBookService.getAllTourBooks(
    filters,
    paginationOptions
  );

  sendResponse<ITourBook[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "TourBooks retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleTourBook = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TourBookService.getSingleTourBook(id);

  sendResponse<ITourBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "TourBook retrieved successfully",
    data: result,
  });
});

const updateTourBook = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body;
  const result = await TourBookService.updateTourBook(id, updatedData);

  sendResponse<ITourBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "TourBook updated successfully",
    data: result,
  });
});

const deleteTourBook = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TourBookService.deleteTourBook(id);

  sendResponse<ITourBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "TourBook deleted successfully",
    data: result,
  });
});

const updateTourBookStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await TourBookService.updateTourBookStatus(id, status);

  sendResponse<ITourBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "TourBook status updated successfully",
    data: result,
  });
});

const getTourBooksByStatus = catchAsync(async (req: Request, res: Response) => {
  const { status } = req.params;
  const paginationOptions = pick(req.query, paginationFields);

  const result = await TourBookService.getTourBooksByStatus(
    status as ITourBookStatus,
    paginationOptions
  );

  sendResponse<ITourBook[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `TourBooks with status ${status} retrieved successfully`,
    meta: result.meta,
    data: result.data,
  });
});

export const TourBookController = {
  createTourBook,
  getAllTourBooks,
  getSingleTourBook,
  updateTourBook,
  deleteTourBook,
  updateTourBookStatus,
  getTourBooksByStatus,
};
