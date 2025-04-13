import { IPackage } from "./package.interface";
import { Package } from "./package.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { Car } from "../car/car.model";

const createPackage = async (payload: IPackage): Promise<IPackage> => {
  // Check if car is available for the selected dates
  const car = await Car.findById(payload.car);
  if (!car || !car.available) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Selected car is not available");
  }

  // Check if car is available for the selected dates
  const isAvailable = await checkCarAvailability(
    payload.car.toString(),
    payload.startDate,
    payload.endDate
  );

  if (!isAvailable) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Car is not available for the selected dates"
    );
  }

  // Set default price if discounted price not provided
  if (!payload.discountedPrice) {
    payload.discountedPrice = payload.basePrice;
  }

  const createdPackage = await Package.create(payload);
  return createdPackage;
};

const checkCarAvailability = async (
  carId: string,
  startDate: Date,
  endDate: Date
): Promise<boolean> => {
  const overlappingBookings = await Package.find({
    car: carId,
    $or: [
      { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
      { startDate: { $gte: startDate, $lte: endDate } },
    ],
    available: true,
  });

  return overlappingBookings.length === 0;
};

const getAllPackages = async (): Promise<IPackage[]> => {
  return Package.find({ available: true })
    .populate("pickupLocation")
    .populate("dropLocation")
    .populate("car");
};

const getPackageById = async (id: string): Promise<IPackage | null> => {
  return Package.findById(id)
    .populate("pickupLocation")
    .populate("dropLocation")
    .populate("car");
};

const updatePackage = async (
  id: string,
  payload: Partial<IPackage>
): Promise<IPackage | null> => {
  const existingPackage = await Package.findById(id);
  if (!existingPackage) {
    throw new ApiError(httpStatus.NOT_FOUND, "Package not found");
  }

  // If dates or car are being updated, check availability
  if (payload.startDate || payload.endDate || payload.car) {
    const carId = payload.car || existingPackage.car.toString();
    const startDate = payload.startDate || existingPackage.startDate;
    const endDate = payload.endDate || existingPackage.endDate;

    const isAvailable = await checkCarAvailability(
      carId.toString(),
      startDate,
      endDate
    );
    if (!isAvailable) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Car is not available for the selected dates"
      );
    }
  }

  const result = await Package.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deletePackage = async (id: string): Promise<IPackage | null> => {
  const result = await Package.findByIdAndDelete(id);
  return result;
};

export const PackageService = {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
};
