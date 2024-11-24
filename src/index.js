import express from "express";
import http from "http";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import routes from "./routes/routes.js";
import connectDb from "./configs/connect.db.js";
import socketIoServer from "./socketio/socket.js";

const app = express();
const PORT = process.env.PORT || 8990;
const dburl = process.env.DBURL;
connectDb(dburl);
const httpServer = http.createServer(app);

socketIoServer(httpServer);

dotenv.config({ path: "../.env" });
app.use(cookieParser());
app.use(cors({ origin: process.env.APP_URL, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/v1", routes);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
