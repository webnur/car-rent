import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { PackageController } from "./package.controller";

import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";
import { PackageValidation } from "./package.validation";

const router = express.Router();

router.post(
  "/",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(PackageValidation.createPackageZodSchema),
  PackageController.createPackage
);

router.get("/", PackageController.getAllPackages);
router.get("/:id", PackageController.getPackageById);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(PackageValidation.updatePackageZodSchema),
  PackageController.updatePackage
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  PackageController.deletePackage
);

export const PackageRoutes = router;
