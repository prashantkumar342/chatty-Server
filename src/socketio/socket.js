import { Server } from "socket.io";
import onConnection from "./onConnection.js";
import onDisconnect from "./onDisconnect.js";
import handleMessages from "./messages.js";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import watchConversation from "./conversationWatch.js";
export const onlineUsers = new Map();

const socketIoServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.APP_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    if (!cookies.refToken) {
      console.error("No cookies found, disconnecting socket .");
      socket.disconnect(true);
      return;
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(cookies.refToken, process.env.JWT_SECRET_KEY);
    } catch (error) {
      console.error("JWT verification failed:", error.message);
      socket.disconnect(true);
      return;
    }

    onConnection(io, socket, decodedToken);
    onDisconnect(io, socket, decodedToken);
    handleMessages(io, socket, decodedToken);
    watchConversation(io);
  });
};

export default socketIoServer;
