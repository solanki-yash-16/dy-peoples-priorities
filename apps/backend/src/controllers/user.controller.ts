import type { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import { asyncHandler, createError } from "../middleware/errorHandler.js";

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private
export const getAllUsers = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const { page = 1, limit = 10, sort = '-createdAt', role, search } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = {};
  if (role) query.role = String(role);
  if (search) {
    query.$or = [
      { name: { $regex: String(search), $options: "i" } },
      { email: { $regex: String(search), $options: "i" } },
    ];
  }

  const users = await User.find(query)
    .sort(String(sort))
    .skip(skip)
    .limit(Number(limit))
    .select("-__v");

  const total = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
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
