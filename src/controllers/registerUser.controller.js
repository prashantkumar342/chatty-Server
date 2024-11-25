import { User as userModel } from "../models/userModel.js";

const registerUser = async (req, res) => {
  const { username, email, password, phone, avatar } = req.body;
  try {
    if (!username || !email || !password || !phone) {
      return res
        .status(400)
        .json({ error: "Bad request: Missing required fields" });
    }
    console.log({ yoLeAvatar: avatar });
    const isUserExists = await userModel.findOne({
      $or: [{ username: username }, { email: email }, { phone: phone }],
    });

    if (isUserExists) {
      return res
        .status(409)
        .json({ error: "Username or email already exists" });
    }

    const newUser = new userModel({
      username: username,
      email: email,
      password: password,
      phone: phone,
      avatar: avatar,
    });

    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error while saving the user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default registerUser;
