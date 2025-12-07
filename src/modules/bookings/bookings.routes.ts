import express, { Request, Response } from "express";
import { bookingsControllers } from "./bookings.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.get("/", auth("admin", "customer"), bookingsControllers.getBookings);

router.post("/", auth("admin", "customer"), bookingsControllers.createBookings);

router.put(
  "/:bookingId",
  auth("admin", "customer"),
  bookingsControllers.updateBookings
);

export const bookingsRoutes = router;
