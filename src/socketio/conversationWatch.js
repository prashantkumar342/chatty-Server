import mongoose from "mongoose";
import { onlineUsers } from "./socket.js";
import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messagesModel.js";
import { User as userModel } from "../models/userModel.js";

const startConversationWatch = (io) => {
  const connection = mongoose.connection;

  const watchConversation = () => {
    console.log("Setting up conversation watch...");
    const conversationChangeStream = Conversation.watch();

    conversationChangeStream.on("change", async (change) => {
      try {
        if (
          change.operationType === "update" ||
          change.operationType === "insert"
        ) {
          const conversation = await Conversation.findById(
            change.documentKey._id
          )
            .populate("senderId")
            .populate("receiverId")
            .populate("lastMessage")
            .populate("messages");

          if (conversation) {
            const sender = await userModel.findById(conversation.senderId._id);
            const receiver = await userModel.findById(
              conversation.receiverId._id
            );

            if (sender && onlineUsers.has(sender._id.toString())) {
              io.to(sender.socketId).emit("conversationUpdate", conversation);
            }

            if (receiver && onlineUsers.has(receiver._id.toString())) {
              io.to(receiver.socketId).emit("conversationUpdate", conversation);
            }
          } else {
            console.error(
              "Conversation not found for ID:",
              change.documentKey._id
            );
          }
        }
      } catch (error) {
        console.error("Error processing change stream:", error);
      }
    });

    conversationChangeStream.on("error", (error) => {
      console.error("Conversation Change Stream Error:", error);
      setTimeout(watchConversation, 5000); // Retry after 5 seconds
    });
  };

  const watchMessage = () => {
    console.log("Setting up message watch...");
    const messageChangeStream = Message.watch();

    messageChangeStream.on("change", async (change) => {
      try {
        if (
          change.operationType === "update" ||
          change.operationType === "insert"
        ) {
          const conversation = await Conversation.findOne({
            messages: change.documentKey._id,
          })
            .populate("senderId")
            .populate("receiverId")
            .populate("lastMessage")
            .populate("messages");

          if (conversation) {
            const sender = await userModel.findById(conversation.senderId._id);
            const receiver = await userModel.findById(
              conversation.receiverId._id
            );

            if (sender && onlineUsers.has(sender._id.toString())) {
              io.to(sender.socketId).emit("conversationUpdate", conversation);
            }

            if (receiver && onlineUsers.has(receiver._id.toString())) {
              io.to(receiver.socketId).emit("conversationUpdate", conversation);
            }
          } else {
            console.error(
              "Conversation not found for message ID:",
              change.documentKey._id
            );
          }
        }
      } catch (error) {
        console.error("Error processing change stream:", error);
      }
    });

    messageChangeStream.on("error", (error) => {
      console.error("Message Change Stream Error:", error);
      setTimeout(watchMessage, 5000); // Retry after 5 seconds
    });
  };

  connection.once("open", () => {
    console.log("Connected to MongoDB, watching for changes...");
    watchConversation();
    watchMessage();
  });

  connection.on("reconnected", () => {
    console.log("Reconnected to MongoDB, restarting watch...");
    watchConversation();
    watchMessage();
  });

  connection.on("disconnected", () => {
    console.warn("MongoDB disconnected, attempting reconnection...");
  });

  connection.on("error", (error) => {
    console.error("MongoDB connection error:", error);
  });
};

export default startConversationWatch;
