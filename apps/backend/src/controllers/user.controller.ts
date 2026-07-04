import type { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import { asyncHandler, createError } from "../middleware/errorHandler.js";

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private
export const getAllUsers = asyncHandler(async (_req: Request, res: Response, _next: NextFunction) => {
  const users = await User.find().select("-__v");

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

// @desc    Get single user by ID
// @route   GET /api/v1/users/:id
// @access  Private
export const getUserById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.params.id).select("-__v");

  if (!user) {
    return next(createError("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private
export const updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, role } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(createError("User not found", 404));
  }

  // Update only the fields that are provided
  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;

  await user.save();

  res.status(200).json({
    success: true,
    user,
  });
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private
export const deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(createError("User not found", 404));
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
