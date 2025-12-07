import { Router } from "express";
import { vehiclesControllers } from "./vehicles.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", auth("admin"), vehiclesControllers.createVehicles);

router.get("/", vehiclesControllers.getVehicless);

router.get("/:vehicleId", vehiclesControllers.getSingleVehicles);

router.put("/:vehicleId", auth("admin"), vehiclesControllers.updateVehicles);

router.delete("/:vehicleId", auth("admin"), vehiclesControllers.deleteVehicles);

export const vehiclesRoutes = router;
