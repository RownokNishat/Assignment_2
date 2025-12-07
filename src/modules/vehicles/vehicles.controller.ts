import { Request, Response } from "express";
import { vehiclesServices } from "./vehicles.service";

const createVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.createVehicles(req.body);

    res.status(201).json({
      success: true,
      message: "Vehicles created",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getVehicless = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.getVehicless();

    res.status(200).json({
      success: true,
      message: "vehicless retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      datails: err,
    });
  }
};

const getSingleVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.getSingleVehicles(
      req.params.vehicleId!
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Vehicles not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch vehicles" });
  }
};

const updateVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.updateVehicles(
      req.body,
      req.params.vehicleId!
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Vehicles not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update vehicles" });
  }
};

const deleteVehicles = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehiclesServices.getSingleVehicles(
      req.params.vehicleId!
    );
    if (vehicle.rows.length === 0) {
      return res.status(404).json({ error: "Vehicles not found" });
    } else if (vehicle.rows[0].availability_status === "booked") {
      return res.status(400).json({ error: "Cannot delete a booked vehicle" });
    } else {
      const result = await vehiclesServices.deleteVehicles(
        req.params.vehicleId!
      );

      res.json({ success: true, message: "Vehicles deleted", data: null });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete vehicles" });
  }
};

export const vehiclesControllers = {
  createVehicles,
  getVehicless,
  getSingleVehicles,
  updateVehicles,
  deleteVehicles,
};
