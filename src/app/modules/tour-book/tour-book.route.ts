import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { TourBookValidation } from "./tour-book.validation";
import { TourBookController } from "./tour-book.controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";

const router = express.Router();

router.post(
  "/",
  // validateRequest(TourBookValidation.createTourBookZodSchema),
  TourBookController.createTourBook
);

router.get(
  "/tour",
  auth(ENUM_USER_ROLE.ADMIN),
  TourBookController.getAllTourBooks
);

router.get(
  "/tour/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  TourBookController.getSingleTourBook
);
router.get(
  "/status/:status",
  auth(ENUM_USER_ROLE.ADMIN),
  TourBookController.getTourBooksByStatus
);

router.patch(
  "/tour/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(TourBookValidation.updateTourBookZodSchema),
  TourBookController.updateTourBook
);
router.patch(
  "/:id/status",
  auth(ENUM_USER_ROLE.ADMIN),
  TourBookController.updateTourBookStatus
);

router.delete("/tour/:id", TourBookController.deleteTourBook);

export const TourBookRoutes = router;
