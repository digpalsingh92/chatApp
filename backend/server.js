import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import chatSocket from "./socket/chat.socket.js";
import connectDB from "./config/db.js";
import userRoute from "./routes/user.route.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import updateProfileRoute from "./routes/updateProfile.route.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.get("/", (req, res) => {
  res.json({ message: "Chat Server is running!" });
});

app.use("/api/user", userRoute);
app.use("/uploads", express.static("uploads"));
app.use("/api/profile", updateProfileRoute);
app.use(notFound);
app.use(errorHandler);

chatSocket(io);

connectDB();

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
