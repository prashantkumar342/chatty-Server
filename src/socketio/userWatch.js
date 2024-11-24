import { User as userModel } from "../models/userModel.js";

const watchUser = async (io) => {
  const pipeline = [
    {
      $match: {
        $or: [
          { "updateDescription.updatedFields.status": { $exists: true } },
          { "updateDescription.updatedFields.username": { $exists: true } },
          { "updateDescription.updatedFields.avatar": { $exists: true } },
        ],
      },
    },
  ];

  const changeStream = userModel.watch(pipeline);

  changeStream.on("change", async (change) => {
    if (change.operationType === "update") {
      const userId = change.documentKey._id;
      const updatedFields = change.updateDescription.updatedFields;

      const user = await userModel.findById(userId);

      io.emit("onStatus", {
        user: user.username,
        onlineStatus: updatedFields.status || "unknown",
        avatar: updatedFields.avatar || user.avatar, 
      });
    }
  });
};

export default watchUser;
