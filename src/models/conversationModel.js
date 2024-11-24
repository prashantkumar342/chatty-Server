import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: false,
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        required: true,
      },
    ],
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Conversation = mongoose.model("Conversation", conversationSchema);
