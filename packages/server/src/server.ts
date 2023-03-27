import {
	ClientToServerEvents,
	InterServerEvents,
	LastMessage,
	ServerToClientEvents,
	SocketData,
} from "./types";

import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
const { userJoin, getUsers, userLeave, getUser } = require("./user");

const http = require("http");
const cors = require("cors");

dotenv.config();

const app: Express = express();
const port = process.env["PORT"] || 5001;
const httpServer = http.createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
	httpServer,
);

const DELAY: number = 5000;

app.use(cors());

app.use((req: Request, res: Response, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get("/", (req: Request, res: Response) => {
	res.send("Express + TypeScript Server is running.");
});

let imageUrl: string;
let lastMessage: LastMessage[] = [];

/**
 * @deprecated
 * TODO: In the future, the user will be able to join multiple rooms
 */
let userRoom: string;

/**
 * Socket.io
 * @see https://socket.io/docs/v4/index.html
 */
io.on("connection", (socket) => {
	socket.broadcast.emit("log", {
		message: `EventName: connection - Success: true ${socket.id}`,
		data: Date.now(),
	});

	socket.on("userJoined", (data) => {
		const { roomId, username, host, presenter, userId } = data;

		const roomUsers = getUsers("roomId");

		// if userName is already taken, return
		const isUserNameExist = roomUsers.find(
			(user) => user.username.toLowerCase() === username.toLowerCase().trim(),
		);

		if (isUserNameExist) {
			socket.broadcast.emit("log", {
				message: `EventName: userJoined - Success: false - Payload: Username già esistente (${username})`,
				data: Date.now(),
			});

			socket.emit("responseJoined", {
				success: false,
				data: null,
				message: "Username già esistente",
			});

			return;
		}

		const user = userJoin({ id: socket.id, userId, username, roomId, host, presenter });

		socket.join(user.roomId);

		socket.emit("message", {
			message: "⚡️Benvenuto nella stanza",
		});

		socket.broadcast.emit("message", {
			message: `⚡️**${user.username}** Si è unito alla stanza`,
		});

		socket.emit("responseJoined", {
			success: true,
			data: user,
			message: "",
		});
	});

	/**
	 *
	 * @param data immagine in base64
	 * @param userId id dell'utente che ha inviato l'immagine
	 */
	socket.on("drawing", (data, user) => {
		imageUrl = data;
		const { id, userId, username } = user;

		socket.broadcast.emit("canvasImage", imageUrl, userId);

		socket.broadcast.emit("log", {
			message: `EventName: canvasImage - UserId: ${userId} - Payload: ${JSON.stringify(
				imageUrl,
			).slice(0, 100)}`,
			data: Date.now(),
		});

		if (!imageUrl) return;

		/**
		 * @description Emits a message only if the last message was sent more than 5 seconds ago
		 * 1) Check if the user has already sent a message
		 * 2) If the user has already sent a message, check if the last message was sent more than 5 seconds ago
		 */
		const lastMessageIndex = lastMessage.findIndex((message) => message.socketId === id);

		if (lastMessageIndex !== -1) {
			if (Date.now() - lastMessage[lastMessageIndex].date > DELAY) {
				lastMessage[lastMessageIndex].date = Date.now();

				socket.broadcast.emit("message", {
					message: `✏️ **${username}** Sta disegnando...`,
				});

				return;
			}
			return;
		}

		lastMessage.push({
			socketId: id,
			date: Date.now(),
		});

		socket.broadcast.emit("message", {
			message: `✏️ **${username}** Sta disegnando...`,
		});

		const roomUsers = getUsers("roomId");

		socket.broadcast.emit("users", roomUsers);

		socket.broadcast.emit("log", {
			message: `EventName: refreshData - Users: ${JSON.stringify(roomUsers)}`,
			data: Date.now(),
		});
	});

	socket.on("disconnect", () => {
		const userLeaves = userLeave(socket.id);
		const roomUsers = getUsers("roomId");

		if (userLeaves) {
			socket.broadcast.emit("message", {
				message: `🚪 **${userLeaves.username}** Ha lasciato la stanza`,
			});
			socket.broadcast.emit("users", roomUsers);

			socket.broadcast.emit("log", {
				message: `EventName: disconnect - Username: ${userLeaves.username}`,
				data: Date.now(),
			});
		}
	});

	socket.on("logout", (userId) => {
		const { id } = getUser(userId);

		const userLeaves = userLeave(id);

		const roomUsers = getUsers("roomId");

		if (userLeaves) {
			socket.broadcast.emit("message", {
				message: `🚪 **${userLeaves.username}** Ha lasciato la stanza`,
			});

			socket.broadcast.emit("users", roomUsers);

			socket.broadcast.emit("log", {
				message: `EventName: logout - Username: ${userLeaves.username}`,
				data: Date.now(),
			});
		}
	});

	socket.on("refreshData", () => {
		const roomUsers = getUsers("roomId");

		socket.broadcast.emit("users", roomUsers);

		socket.broadcast.emit("log", {
			message: `EventName: refreshData - Users: ${JSON.stringify(roomUsers)}`,
			data: Date.now(),
		});
	});
});

httpServer.listen(port, () => console.log(`⚡️Server is running at http://localhost:${port}`));
