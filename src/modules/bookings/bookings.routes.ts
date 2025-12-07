import express, { Request, Response } from "express";
import { bookingsControllers } from "./bookings.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.get("/", auth("admin", "user"), bookingsControllers.getBookings);

router.post("/", auth("admin", "user"), bookingsControllers.createBookings);

router.put(
  "/:bookingId",
  auth("admin", "user"),
  bookingsControllers.updateBookings
);

export const bookingsRoutes = router;
