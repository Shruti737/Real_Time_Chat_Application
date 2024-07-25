const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require("./routes/auth");
const socket = require("socket.io");
require('dotenv').config(); // Load environment variables from .env file

const PORT = process.env.PORT || 5000;

// Access the MongoDB connection string from environment variables
const DB = process.env.DB;

if (!DB) {
  console.error('MongoDB URI is not defined in environment variables.');
  process.exit(1); // Exit the process with a failure code
}

// Connect to MongoDB
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000 // Mongoose will wait up to 30 seconds to connect to a MongoDB server
}).then(() => {
  console.log("MongoDB connection successful");
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err.message);
});

app.use(express.json());
app.use(cors()); // Use CORS middleware
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/messages", require("./routes/messages"));

// Start the server and socket.io
const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

const io = socket(server, {
  cors: {
    origin: process.env.ORIGIN,
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;

  socket.on("add-user", (userId) => {
    global.onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = global.onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data.message); // Send the message to the recipient
    }
  });
});
