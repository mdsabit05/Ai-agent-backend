// mongo db se structure define kar rhe hai

import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  userId: String,
  message: String,
  reply: String,
}, {
  timestamps: true
});

export const Chat = mongoose.model("Chat", chatSchema);