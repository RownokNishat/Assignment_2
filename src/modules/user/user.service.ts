import { pool } from "../../config/db";

const getUser = async () => {
  const result = await pool.query(`SELECT * FROM Users`);
  return result;
};

const getSingleuser = async (id: string) => {
  const result = await pool.query(`SELECT * FROM Users WHERE id = $1`, [id]);

  return result;
};

const updateUser = async (name: string, email: string, id: string) => {
  const result = await pool.query(
    `UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`,
    [name, email, id]
  );

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
