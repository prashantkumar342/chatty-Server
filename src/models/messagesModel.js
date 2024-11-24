import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true }, 
    status: { type: String, enum: ["sent", "pending"], default: "pending" },
    timestamp: { type: Date, default: Date.now },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    }, 
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
