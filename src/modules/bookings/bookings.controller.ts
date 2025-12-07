import { Request, Response } from "express";
import { bookingsServices } from "./bookings.service";
import { vehiclesServices } from "../vehicles/vehicles.service";

const createBookings = async (req: Request, res: Response) => {
  try {
    const vechicle_data = await vehiclesServices.getSingleVehicles(
      req.body.vehicle_id
    );
    if (vechicle_data.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    } else {
      const { rent_start_date, rent_end_date, vehicle_id, customer_id } =
        req.body;
      const veData = vechicle_data.rows[0];
      console.log(rent_end_date, rent_start_date, veData);
      if (
        rent_end_date > rent_start_date &&
        veData.availability_status === "available"
      ) {
        const total_price =
          ((new Date(rent_end_date).getTime() -
            new Date(rent_start_date).getTime()) /
            (1000 * 3600 * 24)) *
          veData.daily_rent_price;

        req.body.total_price = total_price;
        console.log("Total Price: ", total_price);
        const result = await bookingsServices.createBookings(req.body);

        res.status(201).json({
          success: true,
          message: "Bookingscreated",
          data: result.rows[0],
        });
        await vehiclesServices.updateVehicles(
          { availability_status: "booked" },
          vehicle_id
        );
      } else {
        res.status(400).json({
          success: false,
          message: "Invalid rent dates or Vehicle is not available",
        });
      }
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    if (req.user?.role === "user") {
      const userWiseResult = await bookingsServices.getUserWiseBookings(
        req.user.id as string
      );
      return res.status(200).json({
        success: true,
        message: "vehicless retrieved successfully",
        data: userWiseResult.rows,
      });
    } else {
      const result = await bookingsServices.getAllBookings();
      res.status(200).json({
        success: true,
        message: "vehicless retrieved successfully",
        data: result.rows,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      datails: err,
    });
  }
};

const updateBookings = async (req: Request, res: Response) => {
  try {
    const status = req.body.status;
    console.log("Status:", status);
    if (status && status === "cancelled") {
      const result = await bookingsServices.getBookingData(
        req.params.bookingId!
      );

      const bookingData = result.rows[0];
      const rentStart = new Date(bookingData.rent_start_date);
      const todayDate = new Date();
      if (rentStart > todayDate) {
        const updateResult = await bookingsServices.updateBookings(
          req.body,
          req.params.bookingId!
        );
        await vehiclesServices.updateVehicles(
          { availability_status: "available" },
          bookingData.vehicle_id
        );
        return res.status(200).json({
          success: true,
          message: "Booking cancelled successfully",
          data: updateResult.rows[0],
        });
      }
    }
    if (status && status === "returned" && req.user?.role === "admin") {
      const result = await bookingsServices.getBookingData(
        req.params.bookingId!
      );

      const bookingData = result.rows[0];
      const updateResult = await bookingsServices.updateBookings(
        req.body,
        req.params.bookingId!
      );
      await vehiclesServices.updateVehicles(
        { availability_status: "available" },
        bookingData.vehicle_id
      );
      return res.status(200).json({
        success: true,
        message: "Vehicle returned successfully",
        data: updateResult.rows[0],
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update vehicles" });
  }
};

export const bookingsControllers = {
  createBookings,
  getBookings,
  updateBookings,
};
