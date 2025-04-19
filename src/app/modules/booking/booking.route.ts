import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { BookingController } from "./booking.controller";
import { BookingValidation } from "./booking.validation";
import { ENUM_USER_ROLE } from "../../../enum/user";

const router = express.Router();

router.post(
  "/",
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN),
  validateRequest(BookingValidation.createBookingZodSchema),
  BookingController.createBooking
);

router.get("/", auth(ENUM_USER_ROLE.ADMIN), BookingController.getAllBookings);

router.get(
  "/:id",
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN),
  BookingController.getSingleBooking
);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(BookingValidation.updateBookingZodSchema),
  BookingController.updateBooking
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  BookingController.deleteBooking
);

export const BookingRoutes = router;
