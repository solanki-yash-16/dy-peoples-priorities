import type { Request, Response, NextFunction } from "express";
import type { IUser } from "../models/User.js";
import User from "../models/User.js";
import { verifyToken } from "../utils/jwt.js";
import { createError } from "./errorHandler.js";

// Extend Express Request object to include user
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(createError("Not authorized to access this route", 401));
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return next(createError("Not authorized to access this route", 401));
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(createError("The user belonging to this token does no longer exist.", 401));
    }

    req.user = user;
    next();
  } catch {
    next(createError("Not authorized to access this route", 401));
  }
};
