import express from "express";
import registerUser from "../controllers/registerUser.controller.js";
import loginUser from "../controllers/loginUser.controller.js";
import authentication from "../middlewares/authentication.middleware.js";
import fetchUsers from "../controllers/fetchUsers.controller.js";
import userData from "../controllers/userData.controller.js";
import fetchConversation from "../controllers/fetchConversation.controller.js";
import fetchOneUser from "../controllers/fetchOneUser.controller.js";

const router = express.Router();

router.post("/user/register", registerUser);
router.post("/user/login", loginUser);
router.get("/fetch/users", authentication, fetchUsers);
router.post("/fetch/userData", authentication, userData);
router.get("/fetch/conversations", authentication, fetchConversation);
router.post("/fetch/recipient", authentication, fetchOneUser);

router.post("/authenticate/account", authentication, (req, res) => {
  res.status(200).json({ authentication: "success", userID: req.userId });
});

export default router;
