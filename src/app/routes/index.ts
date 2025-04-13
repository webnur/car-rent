import express from "express";

import { UserRoutes } from "../modules/users/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { CarRoutes } from "../modules/car/car.route";
import { BookingRoutes } from "../modules/booking/booking.route";
import { PackageRoutes } from "../modules/package/package.route";

const router = express.Router();

const modulesRoutes = [
  {
    path: "/users",
    module: UserRoutes,
  },
  {
    path: "/auth",
    module: AuthRoutes,
  },
  {
    path: "/car",
    module: CarRoutes,
  },
  {
    path: "/booking",
    module: BookingRoutes,
  },
  {
    path: "/package",
    module: PackageRoutes,
  },
];

modulesRoutes.forEach((route) => router.use(route.path, route.module));
export default router;
