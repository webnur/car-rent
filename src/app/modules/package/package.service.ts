import { IPackage } from "./package.interface";
import { Package } from "./package.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

const createPackage = async (payload: IPackage): Promise<IPackage> => {
  const createdPackage = await Package.create(payload);
  return createdPackage;
};

const getAllPackages = async (): Promise<IPackage[]> => {
  return Package.find()
    .populate("pickupLocation")
    .populate("dropLocation")
    .populate("carPricing.car")
    .populate("createdBy");
};

const getPackageById = async (id: string): Promise<IPackage | null> => {
  return Package.findById(id)
    .populate("pickupLocation")
    .populate("dropLocation")
    .populate("carPricing.car")
    .populate("createdBy");
};

const updatePackage = async (
  id: string,
  payload: Partial<IPackage>
): Promise<IPackage | null> => {
  const existingPackage = await Package.findById(id);
  if (!existingPackage) {
    throw new ApiError(httpStatus.NOT_FOUND, "Package not found");
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
