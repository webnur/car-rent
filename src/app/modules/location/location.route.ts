import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { LocationController } from "./location.controller";
import { LocationValidation } from "./location.validation";

const router = express.Router();

router.post(
  "/create",
  validateRequest(LocationValidation.createLocationZodSchema),
  LocationController.createLocation
);

router.get("/:id", LocationController.getSingleLocation);

router.get("/", LocationController.getAllLocations);

router.patch(
  "/:id",
  validateRequest(LocationValidation.updateLocationZodSchema),
  LocationController.updateLocation
);

router.delete("/:id", LocationController.deleteLocation);

export const LocationRoutes = router;
