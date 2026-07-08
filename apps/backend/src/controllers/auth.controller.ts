import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import { asyncHandler, createError } from "../middleware/errorHandler.js";
import { sendEmail } from "../services/email.service.js";

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, role } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(createError("User already exists", 409));
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  if (user) {
    const token = signToken(user._id);

    // Send token in cookie as well
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      token,
      user,
    });
  } else {
    next(createError("Invalid user data", 400));
  }
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createError("Please provide an email and password", 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return next(createError("Invalid credentials", 401));
  }

  const token = signToken(user._id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    success: true,
    token,
    user,
  });
});

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

// @desc    Log user out / clear cookie
// @route   POST /api/v1/auth/logout
// @access  Private
export const logout = asyncHandler(async (_req: Request, res: Response, _next: NextFunction) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(createError("There is no user with that email", 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url pointing to the FRONTEND, not the backend API
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  const htmlMessage = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #f4f4f5;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
          overflow: hidden;
        }
        .header {
          background-color: #18181b;
          padding: 32px 40px;
          text-align: center;
        }
        .header h1 {
          color: #ffffff;
          font-size: 24px;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.02em;
        }
        .content {
          padding: 40px;
          color: #3f3f46;
          line-height: 1.6;
        }
        .content p {
          margin-bottom: 24px;
          font-size: 16px;
        }
        .btn-container {
          text-align: center;
          margin: 32px 0;
        }
        .btn {
          display: inline-block;
          background-color: #2563eb;
          color: #ffffff !important;
          font-weight: 600;
          font-size: 16px;
          text-decoration: none;
          padding: 14px 32px;
          border-radius: 8px;
          transition: background-color 0.2s;
        }
        .btn:hover {
          background-color: #1d4ed8;
        }
        .footer {
          background-color: #fafafa;
          padding: 24px 40px;
          text-align: center;
          border-top: 1px solid #e4e4e7;
        }
        .footer p {
          color: #a1a1aa;
          font-size: 14px;
          margin: 0;
        }
        .sub-text {
          font-size: 14px;
          color: #71717a;
          word-break: break-all;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>People's Priorities</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>We received a request to reset the password for your account. If you didn't make this request, you can safely ignore this email.</p>
          <div class="btn-container">
            <a href="${resetUrl}" class="btn">Reset Password</a>
          </div>
          <p class="sub-text">Or copy and paste this link into your browser:<br><a href="${resetUrl}" style="color: #2563eb;">${resetUrl}</a></p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} People's Priorities. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset Your Password - People's Priorities",
      message,
      html: htmlMessage,
    });

    res.status(200).json({ success: true, data: "Email sent" });
  } catch {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(createError("Email could not be sent", 500));
  }
});

// @desc    Reset password
// @route   POST /api/v1/auth/reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return next(createError("Please provide token and newPassword", 400));
  }

  // Get hashed token
  const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(createError("Invalid or expired token", 400));
  }

  // Set new password
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const jwtToken = signToken(user._id);

  res.status(200).json({
    success: true,
    token: jwtToken,
  });
});
