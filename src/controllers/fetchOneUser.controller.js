import { User as userModel } from "../models/userModel.js";

const fetchOneUser = async (req, res) => {
  const recipientId = req.body.recipient;
  try {
    const user = await userModel.findById(recipientId);
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export default fetchOneUser;
