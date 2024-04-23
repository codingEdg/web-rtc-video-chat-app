const express = require("express");
const app = express();
const cors = require("cors");
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    // origin: "http://localhost:3000",
    origin: "*",
    methods: ["GET", "POST"],
  },
});
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("<h1>Server is running !!!</h1>");
});

io.on("connection", (socket) => {
  // give socket id to frontend
  socket.emit("me", socket.id);

  // socket.on("message", (data) => {
  //   console.log(data);
  //   io.emit("message", data);
  // });

  socket.on("disconnect", (data) => {
    console.log(data);
    socket.broadcast.emit("Call ended");
  });

  socket.on("calluser", ({ userToCall, signalData, from, name }) => {
    if (!(userToCall && signalData && from && name))
      throw "usertocall signaldata from name are required";
    io.to(userToCall).emit("calluser", { signal: signalData, from, name });
  });

  socket.on("answercall", (data) => {
    if (!data) throw "data is required";
    io.to(data.to).emit("call accepted", data?.signal);
  });
});

server.listen(PORT, () => console.log(`Server in running on Port : ${PORT}`));
