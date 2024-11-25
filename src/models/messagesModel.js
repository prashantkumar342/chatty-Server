import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the User model
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the User model
      required: true,
    },
    content: {
      type: String, // The actual message content
      required: true,
    },
    status: {
      type: String, // Status of the message
      enum: ["sent", "pending"],
      default: "pending",
    },
    timestamp: {
      type: Date, // Timestamp when the message was created
      default: Date.now,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation", // References the Conversation model
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

export const Message = mongoose.model("Message", messageSchema);
