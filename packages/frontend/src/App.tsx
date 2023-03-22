import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Board from "@components/board/Board";
import { ClientToServerEvents, ServerToClientEvents, User } from "./types";
import ClientRoom from "@components/clientRoom/ClientRoom";
import Debugger from "@components/debugger/Debugger";
import { useScrollBlock } from "./hooks/useScrollBlock";
import OnlineUsers from "@components/onlineUsers/OnlineUsers";

const server = "https://ideasolutions-server.eu.ngrok.io";
const connectionOptions = {
	forceNew: true,
	reconnection: true,
	timeout: 10000,
	transports: ["websocket"],
};

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(server, connectionOptions);

function App() {
	const [user, setUser] = useState<User | null>(null);
	const [blockScroll, allowScroll] = useScrollBlock();

	const queryParams = new URLSearchParams(window.location.search);
	const isPresenter = !queryParams.get("isPresenter");

	useEffect(() => {
		blockScroll();
	}, []);

	useEffect(() => {
		if (user) {
			socket.emit("userJoined", user);
		}
	}, [user]);

	useEffect(() => {
		setUser({
			roomId: "roomId",
			userId: uuid(),
			username: "test",
			host: true,
			presenter: isPresenter || false,
		});
	}, []);

	return (
		<div className="home">
			{user?.presenter ? (
				<Board socket={socket} user={user} />
			) : (
				<>
					<Debugger />
					<ClientRoom user={user} socket={socket} />
				</>
			)}
		</div>
	);
}

export default App;

function uuid(): string {
	const S4 = () => (1 + Math.random() * 0x10000).toString(16).substring(1);

	return `${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
}
