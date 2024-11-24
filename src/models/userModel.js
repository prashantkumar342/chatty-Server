import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { type } from "os";

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone:{type:Number,required:true},
    conversation: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation"
    }],
    socketId: { type: String, default: "" },
    status: { type: String, default: "offline" },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    return next();
  }
});

// Create and export the User model
export const User = mongoose.model("User", userSchema);
