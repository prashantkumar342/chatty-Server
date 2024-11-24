import { User as userModel } from "../models/userModel.js";

const userData = async (req, res) => {
  const user = req.body.user;
  try {
    const userData = await userModel.findOne({ username: user });
    return res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ error: error.message, errorDetails: error });
  }
};
export default userData;
