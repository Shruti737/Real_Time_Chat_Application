const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require("./routes/auth")
const socket = require("socket.io")
require('dotenv').config();   // Load environment variables from .env file



// Access the MongoDB connection string from environment variables
const DB = process.env.DB;

if (!DB) {
  console.error('MongoDB URI is not defined in environment variables.');
  process.exit(1); // Exit the process with a failure code
}

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connection Successful");
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err.message);
});

app.use(express.json());
const messageRoutes = require("./routes/messages");
app.use(cors());
// middleware for x-www-form-urlencoded
app.use(express.urlencoded({ extended: true}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

(async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL,{ //process.env: This is an object in Node.js that contains the user environment. It allows you to access environment variables.
          //  useNewUrlParser : true, //use the new MongoDB connection string parser instead of the deprecated one.
          //  useUnifiedTopology: true, // This option enables the use of the new unified topology(System) engine in the MongoDB driver.
            serverSelectionTimeoutMS: 30000 // Mongoose will wait up to 30 seconds to connect to a MongoDB server 
        })
        console.log("Db connection done");

        const server = app.listen(process.env.PORT, () =>
            console.log(`Server started on ${process.env.PORT}`)
          );
      
          const io = socket(server, {  // used to  make connection passing an server port
            cors: { // our severand client both are at the the different port to avoid the cors issue to make use cors
              origin: process.env.ORIGIN,
              credentials: true,
            },
          });
      
          global.onlineUsers = new Map();
          io.on("connection", (socket) => {
            global.chatSocket = socket;
            socket.on("add-user", (userId) => {   // the emit value from client is listen here
              onlineUsers.set(userId, socket.id);
            });
      
            socket.on("send-msg", (data) => { // listen the msg from the client (Chat-container)
             
              const sendUserSocket = onlineUsers.get(data.to);
              if (sendUserSocket) {
                socket.to(sendUserSocket).emit("msg-recieve", data.message); // it send the message to the client
              }
            });
          });
        } catch (err) {
          console.error("Error connecting to MongoDB:", err.message);
        }
})();
