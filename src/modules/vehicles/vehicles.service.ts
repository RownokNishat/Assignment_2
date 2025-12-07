import { pool } from "../../config/db";

// Record<string, unkown> = {key: value}
const createVehicles = async (payload: Record<string, unknown>) => {
  const { vechicle_name, type, registration_number, daily_rent_price } =
    payload;
  const availability_status = "available";
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
  const updates: string[] = [];
  const values: unknown[] = [];
  let paramCount = 1;

  // Dynamically build SET clause based on payload fields
  for (const [key, value] of Object.entries(payload)) {
    updates.push(`${key}=$${paramCount}`);
    values.push(value);
    paramCount++;
  }

  values.push(id); // Add id as the last parameter for WHERE clause

  const query = `UPDATE Vehicles SET ${updates.join(
    ", "
  )} WHERE id=$${paramCount} RETURNING *`;
  const result = await pool.query(query, values);
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
