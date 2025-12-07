import { pool } from "../../config/db";

// Record<string, unkown> = {key: value}
const createBookings = async (payload: Record<string, unknown>) => {
  const {
    customer_id,
    vehicle_id,
    rent_start_date,
    rent_end_date,
    total_price,
  } = payload;
  const status = "active";
  const result = await pool.query(
    `INSERT INTO Bookings( customer_id,
    vehicle_id,
    rent_start_date,
    rent_end_date,
    status, total_price) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      status,
      total_price,
    ]
  );

  return result;
};

const getAllBookings = async () => {
  const result = await pool.query(`SELECT * FROM Bookings`);
  return result;
};
const getUserWiseBookings = async (customer_id: string) => {
  const result = await pool.query(
    `SELECT * FROM Bookings WHERE customer_id=$1`,
    [customer_id]
  );
  return result;
};
const getBookingData = async (id: string) => {
  const result = await pool.query(`SELECT * FROM Bookings WHERE id=$1`, [id]);
  return result;
};

const updateBookings = async (payload: Record<string, unknown>, id: string) => {
  const { status } = payload;
  const result = await pool.query(
    "UPDATE Bookings SET status=$1 WHERE id=$2 RETURNING *",
    [status, id]
  );
  return result;
};

export const bookingsServices = {
  createBookings,
  getAllBookings,
  getUserWiseBookings,
  updateBookings,
  getBookingData,
};
