import { Message as messageModel } from "../models/messagesModel.js";
import { User as userModel } from "../models/userModel.js";
import { Conversation as conversationModel } from "../models/conversationModel.js";

const handleMessages = (io, socket, decodedToken) => {
  socket.on("sendMessage", async (data) => {
    try {
      const sender = await userModel.findById(decodedToken.userId);
      const recipient = await userModel.findById(data.recipient);

      let conversation = await conversationModel.findOne({
        $or: [
          { senderId: sender._id, receiverId: data.recipient },
          { senderId: data.recipient, receiverId: sender._id },
        ],
      });

      if (!conversation) {
        conversation = new conversationModel({
          senderId: sender._id,
          receiverId: recipient._id,
          lastMessage: null,
          messages: [],
        });
        await conversation.save();
      }

      const newMessage = new messageModel({
        sender: sender._id,
        receiver: data.recipient,
        content: data.message,
        status: "pending",
        conversationId: conversation._id,
        timestamp: Date.now(),
      });

      await newMessage.save();

      conversation.messages.push(newMessage._id);
      conversation.lastMessage = newMessage._id;
      await conversation.save();

      // Send the latest message to both sender and recipient
      const latestMessage = await messageModel
        .findById(newMessage._id)
        .populate("sender", "username avatar")
        .populate("receiver", "username avatar");

      io.to(sender._id.toString()).emit("messageChange", {
        message: latestMessage,
      });

      io.to(recipient._id.toString()).emit("messageChange", {
        message: latestMessage,
      });

      // Emit the updated conversation to both users
      const updatedConversation = await conversationModel
        .findById(conversation._id)
        .populate("senderId", "username avatar")
        .populate("receiverId", "username avatar")
        .populate("lastMessage")
        .exec();

      io.to(sender._id.toString()).emit("conversationChange", {
        operationType: "update",
        fullDocument: updatedConversation,
      });

      io.to(recipient._id.toString()).emit("conversationChange", {
        operationType: "update",
        fullDocument: updatedConversation,
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });
};

export default handleMessages;