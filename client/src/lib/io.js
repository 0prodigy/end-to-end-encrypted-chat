import ioClient from "socket.io-client";
const ENDPOINT = "http://localhost:5500";

const socket = ioClient(ENDPOINT);

export const io = socket;
