import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { findUserById } from "../models/userModel.js";

dotenv.config();

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization token is missing" });
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ message: 'Token format is "Bearer <token>".' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userExist = await findUserById(decoded.id);
    if (!userExist) {
      return res
        .status(401)
        .json({ message: "User associated with this token no longer exists." });
    }
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired,Please sign in again." });
    }
    console.log(error);
    return res.status(500).json({ message: "Invalid token." });
  }
};
