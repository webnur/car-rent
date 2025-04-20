import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { OrderController } from "./order.controller";
import { OrderValidation } from "./order.validation";
import { ENUM_USER_ROLE } from "../../../enum/user";

const router = express.Router();

router.post(
  "/",
  validateRequest(OrderValidation.createOrderZodSchema),
  OrderController.createOrder
);

router.get("/", auth(ENUM_USER_ROLE.ADMIN), OrderController.getAllOrders);

router.get(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  OrderController.getOrderById
);

router.get(
  "/user/:userId",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  OrderController.getUserOrders
);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(OrderValidation.updateOrderZodSchema),
  OrderController.updateOrder
);

router.delete("/:id", auth(ENUM_USER_ROLE.ADMIN), OrderController.deleteOrder);

export const OrderRoutes = router;
