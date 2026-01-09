import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import userRoute from "./routes/user.route.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import updateProfileRoute from "./routes/updateProfile.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";
const app = express();
const server = http.createServer(app);

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
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);
app.use("/uploads", express.static("uploads"));
app.use("/api/profile", updateProfileRoute);
app.use(notFound);
app.use(errorHandler);

connectDB();

const PORT = process.env.PORT || 4000;
const serverListen = server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = new Server(serverListen, {
  cors: {
    pingTimeout: 60000,
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});
