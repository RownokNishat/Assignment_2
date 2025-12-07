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
        if (total_price <= 0) {
          return res.status(400).json({
            success: false,
            message: "Invalid rent dates",
          });
        }

        const result = await bookingsServices.createBookings(req.body);

        res.status(201).json({
          success: true,
          message: "Booking created successfully",
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
      errors: err,
    });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    if (req.user?.role === "user") {
      const userWiseResult = await bookingsServices.getUserWiseBookings(
        req.user.id as string
      );
      const data = userWiseResult.rows.map((row) => ({
        id: row.id,
        customer_id: row.customer_id,
        vehicle_id: row.vehicle_id,
        rent_start_date: row.rent_start_date,
        rent_end_date: row.rent_end_date,
        total_price: row.total_price,
        status: row.status,

        vehicle: {
          vehicle_name: row.vehicle_name,
          registration_number: row.registration_number,
          type: row.type,
        },
      }));
      return res.status(200).json({
        success: true,
        message: "Your bookings retrieved successfully",
        data: data,
      });
    } else {
      const result = await bookingsServices.getAllBookings();
      const data = result.rows.map((row) => ({
        id: row.id,
        customer_id: row.customer_id,
        vehicle_id: row.vehicle_id,
        rent_start_date: row.rent_start_date,
        rent_end_date: row.rent_end_date,
        total_price: row.total_price,
        status: row.status,
        customer: {
          name: row.customer_name,
          email: row.customer_email,
        },
        vehicle: {
          vehicle_name: row.vehicle_name,
          registration_number: row.registration_number,
        },
      }));
      res.status(200).json({
        success: true,
        message: "Bookings retrieved successfully",
        data: data,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      errors: err,
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
        message: "Booking marked as returned. Vehicle is now available",
        data: {
          ...updateResult.rows[0],
          vehicle: {
            availability_status: "available",
          },
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to update vehicles",
      errors: err,
    });
  }
};

export const bookingsControllers = {
  createBookings,
  getBookings,
  updateBookings,
};
