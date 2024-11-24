import { User as userModel } from "../models/userModel.js";
import { Message as messageModel } from "../models/messagesModel.js";
import { onlineUsers } from "./socket.js";

const onConnection = async (io, socket, decodedToken) => {
  const onlineUser = await userModel.findById(decodedToken.userId);
  onlineUsers.set(decodedToken.userId, socket.id);

  await userModel.findByIdAndUpdate(decodedToken.userId, {
    socketId: socket.id,
    status: "online",
  });
  io.emit("onStatus", { user: onlineUser.username, onlineStatus: "online" });
  console.log(`${onlineUser.username} is online`);

  // Retrieve all messages with status "pending"
  const pendingMessages = await messageModel.find({ status: "pending" });

  // Check if the recipient is online and emit the message
  for (const message of pendingMessages) {
    const recipientSocketId = onlineUsers.get(message.receiver.toString());
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveMessage", {
        sender: message.sender,
        message: message.content,
        timestamp: message.timestamp,
      });
      await messageModel.findByIdAndUpdate(message._id, {
        status: "sent",
      });
    }
  }
};

export default onConnection;
