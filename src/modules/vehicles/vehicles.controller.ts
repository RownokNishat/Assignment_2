import { Request, Response } from "express";
import { vehiclesServices } from "./vehicles.service";

const createVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.createVehicles(req.body);

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      errors: err,
    });
  }
};

const getVehicless = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.getVehicless();

    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No vehicles found",
        data: [],
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicles retrieved successfully",
        data: result.rows,
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

const getSingleVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.getSingleVehicles(
      req.params.vehicleId!
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });
    }
    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle",
      errors: err,
    });
  }
};

const updateVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.updateVehicles(
      req.body,
      req.params.vehicleId!
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to update vehicle",
      errors: err,
    });
  }
};

const deleteVehicles = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehiclesServices.getSingleVehicles(
      req.params.vehicleId!
    );
    if (vehicle.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });
    } else if (vehicle.rows[0].availability_status === "booked") {
      return res
        .status(400)
        .json({ success: false, message: "Cannot delete a booked vehicle" });
    } else {
      const result = await vehiclesServices.deleteVehicles(
        req.params.vehicleId!
      );

      res.json({ success: true, message: "Vehicle deleted successfully" });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to delete vehicle",
        errors: err,
      });
  }
};

export const vehiclesControllers = {
  createVehicles,
  getVehicless,
  getSingleVehicles,
  updateVehicles,
  deleteVehicles,
};
