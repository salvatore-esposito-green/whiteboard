import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "./types";

import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

const http = require("http");
const cors = require("cors");

dotenv.config();

const app: Express = express();
const port = process.env["PORT"] || 5001;

const httpServer = http.createServer(app);
import { Server } from "socket.io";

const { userJoin, getUsers, userLeave } = require("./user");

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
	httpServer,
);

app.use(cors());
app.use((req: Request, res: Response, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get("/", (req: Request, res: Response) => {
	res.send("server");
});

// socket.io
let imageUrl: string;
/**
 * @deprecated
 */
let userRoom: string;
io.on("connection", (socket) => {
	socket.on("userJoined", (data) => {
		const { roomId, username, host, presenter } = data;

		const user = userJoin(socket.id, username, roomId, host, presenter);

		const roomUsers = getUsers("roomId");

		socket.join(user.room);

		socket.emit("message", {
			message: "⚡️[server]: Benvenuto nella stanza",
		});

		socket.broadcast.emit("message", {
			message: `⚡️[server]: ${user.username} Si è unito alla stanza`,
		});

		socket.broadcast.emit("users", roomUsers);

		socket.broadcast.emit("canvasImage", "", user.userId);
	});

	/**
	 *
	 * @param data immagine in base64
	 * @param userId id dell'utente che ha inviato l'immagine
	 */
	socket.on("drawing", (data, userId) => {
		imageUrl = data;

		socket.broadcast.emit("canvasImage", imageUrl, userId);

		socket.broadcast.emit("message", {
			message: `⚡️[server]: ✏️ [drawing]: ${imageUrl}`,
		});
	});

	socket.on("disconnect", () => {
		const userLeaves = userLeave(socket.id);
		const roomUsers = getUsers("roomId");

		if (userLeaves) {
			socket.broadcast.emit("message", {
				message: `${userLeaves.username} Ha lasciato la stanza`,
			});
			socket.broadcast.emit("users", roomUsers);
		}
	});
});

// serve on port

httpServer.listen(port, () =>
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`),
);
