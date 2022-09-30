import ioClient from "socket.io-client";
const ENDPOINT = "ws://localhost:5600/";

// create socket connection without polling
const socket = ioClient(ENDPOINT, {
  transports: ["websocket"],
}).connect();
export default socket;
