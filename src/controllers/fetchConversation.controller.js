import { Conversation as conversationModel } from "../models/conversationModel.js";

const fetchConversation = async (req, res) => {
  const userId = req.userId;
  try {
    const conversations = await conversationModel
      .find({
        $or: [{ senderId: userId }, { receiverId: userId }],
      })
      .populate("senderId")
      .populate("receiverId")
      .populate("lastMessage")
      .populate("messages");

    // Sort conversations by timestamp (last message timestamp or creation date)
    const sortedConversations = conversations.sort((a, b) => {
      const timestampA = a.lastMessage
        ? new Date(a.lastMessage.timestamp)
        : new Date(a.createdAt);
      const timestampB = b.lastMessage
        ? new Date(b.lastMessage.timestamp)
        : new Date(b.createdAt);
      return timestampB - timestampA;
    });

    return res.status(200).json(sortedConversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return res.status(500).json({ error: "Error fetching conversations" });
  }
};

export default fetchConversation;
