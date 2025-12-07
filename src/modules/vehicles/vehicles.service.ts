import { pool } from "../../config/db";

// Record<string, unkown> = {key: value}
const createVehicles = async (payload: Record<string, unknown>) => {
  const {
    vechicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;
  const result = await pool.query(
    `INSERT INTO Vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [
      vechicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return result;
};

const getVehicless = async () => {
  const result = await pool.query(`SELECT * FROM Vehicles`);
  return result;
};

const getSingleVehicles = async (id: string) => {
  const result = await pool.query("SELECT * FROM Vehicles WHERE id = $1", [id]);
  return result;
};

const updateVehicles = async (payload: Record<string, unknown>, id: string) => {
  const { daily_rent_price, availability_status } = payload;
  const result = await pool.query(
    "UPDATE Vehicles SET daily_rent_price=$1, availability_status=$2 WHERE id=$3 RETURNING *",
    [daily_rent_price, availability_status, id]
  );
  return result;
};

const deleteVehicles = async (id: string) => {
  const result = await pool.query(
    "DELETE FROM Vehicles WHERE id=$1 RETURNING *",
    [id]
  );
  return result;
};

export const vehiclesServices = {
  createVehicles,
  getVehicless,
  getSingleVehicles,
  updateVehicles,
  deleteVehicles,
};
