import { Request, Response } from "express";
import { userServices } from "./user.service";

const getUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUser();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      errors: err,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  // console.log(req.params.id);
  try {
    const result = await userServices.getSingleuser(
      req.params.userId as string
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: result.rows[0],
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

const updateUser = async (req: Request, res: Response) => {
  try {
    console.log(req.user);
    const reqUser = req.user;
    if (reqUser?.role == "admin") {
      const { name, email } = req.body;
      const result = await userServices.updateUser(
        name,
        email,
        req.params.userId!
      );

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "User updated successfully",
          data: result.rows[0],
        });
      }
    } else if (reqUser?.role == "user" && reqUser?.id == req.params.userId) {
      const { name, email } = req.body;
      const result = await userServices.updateUser(
        name,
        email,
        req.params.userId!
      );

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "User updated successfully",
          data: result.rows[0],
        });
      }
    } else {
      res.status(403).json({
        success: false,
        message: "You are not authorized to update this user",
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

const deleteUser = async (req: Request, res: Response) => {
  // console.log(req.params.id);
  try {
    if (req.user?.role === "admin") {
      const userBookingData = await userServices.getAllBookingsByUser(
        req.params.userId!
      );
      let activeBookings = 0;
      if (userBookingData?.rows.length > 0) {
        userBookingData.rows.forEach((booking: any) => {
          if (booking.status === "active") {
            activeBookings += 1;
          }
        });
        if (activeBookings > 0) {
          return res.status(400).json({
            success: false,
            message: "Cannot delete user with active bookings",
          });
        } else {
          const result = await userServices.deleteUser(req.params.userId!);
          if (result.rowCount === 0) {
            res.status(404).json({
              success: false,
              message: "User not found",
            });
          } else {
            res.status(200).json({
              success: true,
              message: "User deleted successfully",
            });
          }
        }
      } else {
        const result = await userServices.deleteUser(req.params.userId!);
        if (result.rowCount === 0) {
          res.status(404).json({
            success: false,
            message: "User not found",
          });
        } else {
          res.status(200).json({
            success: true,
            message: "User deleted successfully",
          });
        }
      }
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      errors: err,
    });
  }
};

export const userControllers = {
  getUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
