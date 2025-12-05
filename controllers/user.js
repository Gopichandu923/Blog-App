import * as UserModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY }
  );
};

export const signUp = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide username,email and password." });
  }
  try {
    const usernameCheck = await UserModel.findUserByEmailOrUsername(username);
    const emailCheck = await UserModel.findUserByEmailOrUsername(email);
    if (usernameCheck) {
      return res
        .status(409)
        .json({ message: "User with username already exists" });
    }
    if (emailCheck) {
      return res
        .status(409)
        .json({ message: "User with email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await UserModel.createUser(username, email, hashedPassword);
    const token = generateToken(newUser);
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    console.log("Signup error:", error);
    return res
      .status(500)
      .json({ message: "Server error during registration." });
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }
  try {
    const user = await UserModel.findUserByEmailOrUsername(email);
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password." });
    }
    const token = generateToken(user);
    return res.status(200).json({
      message: "User signed in successfully.",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.log("Signin error:", error);
    res.status(500).json({ message: "Server error during signin." });
  }
};
