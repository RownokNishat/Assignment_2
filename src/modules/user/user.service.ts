import { pool } from "../../config/db";

const getUser = async () => {
  const result = await pool.query(`SELECT * FROM Users`);
  return result;
};

const getSingleuser = async (id: string) => {
  const result = await pool.query(`SELECT * FROM Users WHERE id = $1`, [id]);

  return result;
};

const updateUser = async (payload: Record<string, unknown>, id: string) => {
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

  const query = `UPDATE Users SET ${updates.join(
    ", "
  )} WHERE id=$${paramCount} RETURNING *`;
  const result = await pool.query(query, values);
  return result;
};
const getAllBookingsByUser = async (userId: string) => {
  const result = await pool.query(
    `SELECT * FROM Bookings WHERE customer_id = $1`,
    [userId]
  );
  return result;
};
const deleteUser = async (id: string) => {
  const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);

  return result;
};

export const userServices = {
  getUser,
  getSingleuser,
  updateUser,
  deleteUser,
  getAllBookingsByUser,
};
