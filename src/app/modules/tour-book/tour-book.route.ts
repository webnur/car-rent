import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { TourBookValidation } from "./tour-book.validation";
import { TourBookController } from "./tour-book.controller";

const router = express.Router();

router.post(
  "/",
  validateRequest(TourBookValidation.createTourBookZodSchema),
  TourBookController.createTourBook
);

router.get("/", TourBookController.getAllTourBooks);

router.get("/:id", TourBookController.getSingleTourBook);
router.get("/status/:status", TourBookController.getTourBooksByStatus);

router.patch(
  "/:id",
  validateRequest(TourBookValidation.updateTourBookZodSchema),
  TourBookController.updateTourBook
);
router.patch(
  "/:id/status",
  // auth(ENUM_USER_ROLE.ADMIN),
  TourBookController.updateTourBookStatus
);

router.delete("/:id", TourBookController.deleteTourBook);

export const TourBookRoutes = router;
