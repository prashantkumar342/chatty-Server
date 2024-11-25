import { User as userModel } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json({ error: "bad request" });
    }
    const isUserExists = await userModel.findOne({ username: username });
    if (!isUserExists) {
      return res
        .status(404)
        .json({ error: "username not found for this name" });
    }
    const isPassMatch = await bcrypt.compare(password, isUserExists.password);
    if (!isPassMatch) {
      return res.status(409).json({ error: "creds invalid" });
    }
    const refreshToken = await jwt.sign(
      {
        userId: isUserExists._id,
        username: isUserExists.username,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "2d" }
    );
    return res
      .status(200)
      .cookie("refToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure in production
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict", // Adjust for cross-domain if needed
        path: "/", // Ensure the cookie is accessible throughout the app
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .json({ success: "successfully loggedIn" });

  } catch (error) {
    return res.status(500).json({
      error: "error while logging in username",
      details: error.message,
    });
  }
};

export default loginUser;
