import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CarController } from "./car.controller";
import { CarValidation } from "./car.validation";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";
import { FileUploadHelper } from "../../../helpers/FileUploadHelper";

const router = express.Router();

// router.post(
//   "/",
//   auth(ENUM_USER_ROLE.ADMIN),
//   FileUploadHelper.upload.single("file"),

//   // validateRequest(CarValidation.createCarZodSchema),
//   // CarController.createCar
//   (req: Request, res: Response, next: NextFunction) => {
//     req.body = CarValidation.createCarZodSchema.parse(
//       JSON.parse(req.body.data)
//     );
//     return CarController.createCar(req, res, next);
//   }
// );

router.post(
  "/create",
  auth(ENUM_USER_ROLE.ADMIN),
  FileUploadHelper.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    // No Zod validation
    return CarController.createCar(req, res, next);
  }
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
