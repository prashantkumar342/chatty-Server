import { User as userModel } from "../models/userModel.js";
import { onlineUsers } from "./socket.js";

const onDisconnect = async (io, socket, decodedToken) => {
  const onlineUser = await userModel.findById(decodedToken.userId);
  socket.on("disconnect", async () => {
    await userModel.findByIdAndUpdate(decodedToken.userId, {
      socketId: "",
      status: "offline",
    });
    io.emit("onStatus", { user: onlineUser.username, onlineStatus: "offline" });
    console.log(`${onlineUser.username} is offline`);
  });
};

export default onDisconnect;
