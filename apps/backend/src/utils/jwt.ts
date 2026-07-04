import jwt from "jsonwebtoken";
import env from "../config/env.js";
import type { Types } from "mongoose";

export const signToken = (userId: Types.ObjectId | string): string => {
  return jwt.sign({ id: userId.toString() }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
};

export const verifyToken = (token: string): { id: string } | null => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
    return decoded;
  } catch {
    return null;
  }
};
