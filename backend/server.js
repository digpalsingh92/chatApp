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
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
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
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  },
});

// Store active users
const activeUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected to socket:", socket.id);

  // User setup - join their personal room
  socket.on("setup", (userId) => {
    if (!userId) return;
    
    socket.join(userId);
    activeUsers.set(userId, socket.id);
    console.log("User joined room:", userId);
    socket.emit("connected");
  });

  // Join a specific chat room
  socket.on("join chat", (chatId) => {
    if (!chatId) return;
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat: ${chatId}`);
  });

  // Leave a chat room
  socket.on("leave chat", (chatId) => {
    if (!chatId) return;
    socket.leave(chatId);
    console.log(`User ${socket.id} left chat: ${chatId}`);
  });

  // Handle new message
  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;

    if (!chat || !chat.users) {
      console.log("Chat or users not defined");
      return;
    }

    // Emit to the chat room (all users in the chat will receive it)
    io.to(chat._id).emit("message received", newMessageReceived);
  });

  // Handle typing indicator
  socket.on("typing", (data) => {
    socket.in(data.chatId).emit("typing", data);
  });

  socket.on("stop typing", (data) => {
    socket.in(data.chatId).emit("stop typing", data);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Remove from active users
    for (const [userId, socketId] of activeUsers.entries()) {
      if (socketId === socket.id) {
        activeUsers.delete(userId);
        break;
      }
    }
  });
});

