import { User as userModel } from "../models/userModel.js";
import { onlineUsers } from "../socketio/socket.js"

const logoutUser = async (req, res) => {
  try {
    const userId = req.userId;

    await userModel.findByIdAndUpdate(userId, { status: "offline" });
    if (onlineUsers.has(userId)) {
      onlineUsers.delete(userId);
    }

    res
      .status(200)
      .clearCookie("refToken")
      .json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: "Logout failed", details: error.message });
  }
};

export default logoutUser;
