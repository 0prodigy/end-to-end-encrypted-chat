const cors = require("cors");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
// enable cors
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const socket = require("socket.io")(http);

// store user data in memory { user: { user: "user", channel: "channel", publicKey: "publicKey" } }
const user = {};

// create a end-to-end encrypted channel
socket.on("connection", (socket) => {
  console.log("connected");
  socket.on("create", (data) => {
    console.log(data, "creating user and channel");
    user[data.user] = data;
    // check if channel exists
    if (socket.adapter.rooms[data.channel]) {
      // if channel exists, and already have two members, send error
      if (socket.adapter.rooms[data.channel].length === 2) {
        socket.emit("error", "Channel already exists");
        return;
      }
      // if channel exists, check if user is already in the channel
      if (socket.adapter.rooms[data.channel].has(data.user)) {
        // if user is already in the channel, send error
        socket.emit("error", "User already in channel");
      } else {
        // if user is not in the channel, add user to channel
        socket.join(data.channel);
        socket.emit("success", "User added to channel");
        // broadcast to other user in the channel that a new user has joined and send the public key and username
        socket.to(data.channel).emit("newUser", data.publicKey, data.user);
      }
    }
  });
});

// on message broadcast to other user in the channel
socket.on("message", (data) => {
  console.log(data);
  socket.to(data.channel).emit("message", data.message);
});

http.listen(5600, () => {
  console.log("Running on http://localhost:5600");
});
