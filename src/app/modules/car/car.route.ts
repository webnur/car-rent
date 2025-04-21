import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CarController } from "./car.controller";
import { CarValidation } from "./car.validation";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";

const router = express.Router();

router.post(
  "/create",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(CarValidation.createCarZodSchema),
  CarController.createCar
);

router.get("/", CarController.getAllCars);
router.get("/:id", CarController.getSingleCar);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(CarValidation.updateCarZodSchema),
  CarController.updateCar
);

router.delete("/:id", auth(ENUM_USER_ROLE.ADMIN), CarController.deleteCar);

export const CarRoutes = router;
