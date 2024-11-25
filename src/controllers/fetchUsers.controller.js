import { User as userModel } from "../models/userModel.js";

const fetchUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    return res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export default fetchUsers;
