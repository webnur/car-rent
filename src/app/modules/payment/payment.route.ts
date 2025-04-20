import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { PaymentController } from "./payment.controller";

import { ENUM_USER_ROLE } from "../../../enum/user";
import { PaymentValidation } from "./payment.validation";

const router = express.Router();

router.post(
  "/",
  validateRequest(PaymentValidation.createPaymentZodSchema),
  PaymentController.createPayment
);

router.post(
  "/stripe-webhook",
  express.raw({ type: "application/json" }), // Important for signature verification
  PaymentController.handleStripeWebhook
);
router.get(
  "/verify/:paymentId",
  auth(ENUM_USER_ROLE.USER),
  PaymentController.verifyPayment
);

router.get("/", auth(ENUM_USER_ROLE.ADMIN), PaymentController.getAllPayments);

router.get(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  PaymentController.getPaymentById
);

router.get(
  "/user/:userId",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  PaymentController.getUserPayments
);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(PaymentValidation.updatePaymentZodSchema),
  PaymentController.updatePayment
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  PaymentController.deletePayment
);

export const PaymentRoutes = router;
