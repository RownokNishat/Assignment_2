import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const createUser = async (payload: Record<string, unknown>) => {
  const { name, email, phone, role, password } = payload;
  if (!password || (password as string).length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }
  const hashedPass = await bcrypt.hash(password as string, 10);
  const normalizedEmail = (email as string).toLowerCase();
  const result = await pool.query(
    `INSERT INTO Users(name, role, email,phone, password) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [name, role, normalizedEmail, phone, hashedPass]
  );

  return result;
};
const loginUser = async (email: string, password: string) => {
  console.log({ email });
  const normalizedEmail = email.toLowerCase();
  const result = await pool.query(`SELECT * FROM Users WHERE email=$1`, [
    normalizedEmail,
  ]);

  console.log({ result });
  if (result.rows.length === 0) {
    return null;
  }
  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);

  console.log({ match, user });
  if (!match) {
    return false;
  }

  const token = jwt.sign(
    { name: user.name, email: user.email, role: user.role, id: user.id },
    config.jwtSecret as string,
    {
      expiresIn: "7d",
    }
  );
  console.log({ token });

  return { token, user };
};

export const authServices = {
  loginUser,
  createUser,
};
