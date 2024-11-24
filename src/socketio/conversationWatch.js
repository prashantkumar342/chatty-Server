import mongoose from "mongoose";
import { onlineUsers } from "./socket.js";
import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messagesModel.js";

const watchConversation = (io) => {
  const connection = mongoose.connection;

  connection.once("open", () => {
    console.log("Connected to MongoDB, watching for changes...");

    // Watch Conversation model
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
            if (
              conversation.senderId &&
              onlineUsers.has(conversation.senderId._id.toString())
            ) {
              io.to(onlineUsers.get(conversation.senderId._id.toString())).emit(
                "conversationUpdate",
                conversation
              );
            }
            if (
              conversation.receiverId &&
              onlineUsers.has(conversation.receiverId._id.toString())
            ) {
              io.to(
                onlineUsers.get(conversation.receiverId._id.toString())
              ).emit("conversationUpdate", conversation);
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

    // Watch Message model
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
            if (
              conversation.senderId &&
              onlineUsers.has(conversation.senderId._id.toString())
            ) {
              io.to(onlineUsers.get(conversation.senderId._id.toString())).emit(
                "conversationUpdate",
                conversation
              );
            }
            if (
              conversation.receiverId &&
              onlineUsers.has(conversation.receiverId._id.toString())
            ) {
              io.to(
                onlineUsers.get(conversation.receiverId._id.toString())
              ).emit("conversationUpdate", conversation);
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
  });
};

export default watchConversation;
