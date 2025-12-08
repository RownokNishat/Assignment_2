import { Request, Response } from "express";
import { authServices } from "./auth.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.createUser(req.body);
    const { id, name, email, role, phone } = result.rows[0];
    res.status(201).json({
      success: true,
      message: "Customer registered successfully",
      data: { id, name, email, role, phone },
    });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
      errors: err,
    });
  }
};
const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await authServices.loginUser(email, password);
    const { token, user } = result || {};
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          name: user?.name,
          email: user?.email,
          role: user?.role,
          id: user?.id,
          phone: user?.phone,
        },
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      errors: err,
    });
  }
};

export const authController = {
  loginUser,
  createUser,
};
