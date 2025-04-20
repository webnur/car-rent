import express from "express";
import auth from "../../middlewares/auth";
import { PaymentHistoryController } from "./payment-history.controller";
import { ENUM_USER_ROLE } from "../../../enum/user";

const router = express.Router();

router.get(
  "/",
  auth(ENUM_USER_ROLE.ADMIN),
  PaymentHistoryController.getAllPaymentHistories
);

router.get(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  PaymentHistoryController.getPaymentHistoryById
);

router.get(
  "/payment/:paymentId",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  PaymentHistoryController.getPaymentHistoriesByPayment
);

export const PaymentHistoryRoutes = router;
