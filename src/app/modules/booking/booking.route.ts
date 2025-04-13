import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { BookingController } from "./booking.controller";
import { BookingValidation } from "./booking.validation";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";

const router = express.Router();

router.post(
  "/",
  auth(),
  validateRequest(BookingValidation.createBookingZodSchema),
  BookingController.createBooking
);

router.get("/", auth(ENUM_USER_ROLE.ADMIN), BookingController.getAllBookings);

router.get("/:id", auth(), BookingController.getSingleBooking);

router.patch(
  "/:id",
  auth(),
  validateRequest(BookingValidation.updateBookingZodSchema),
  BookingController.updateBooking
);

router.delete("/:id", auth(), BookingController.deleteBooking);

export const BookingRoutes = router;
