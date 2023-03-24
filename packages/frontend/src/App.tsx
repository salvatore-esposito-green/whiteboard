import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Board from "@components/board/Board";
import { ClientToServerEvents, Element, ServerToClientEvents, User } from "./types";
import ClientRoom from "@components/clientRoom/ClientRoom";
import { useScrollBlock } from "./hooks/useScrollBlock";
import Form from "@components/form/Form";

const server = process.env["NGROK_SERVER"];
const connectionOptions = {
	forceNew: true,
	reconnection: true,
	timeout: 10000,
	transports: ["websocket"],
};

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(server, connectionOptions);

function App() {
	const [user, setUser] = useState<User | null>(JSON.parse(sessionStorage.getItem("user")));
	const [elements, setElements] = useState<Element[] | []>([]);

	const [blockScroll, allowScroll] = useScrollBlock();

	/**
	 * Block scroll when user is presenter or when user draws on mobile
	 */
	useEffect(() => {
		blockScroll();
	}, []);

	/**
	 * @name userJoined
	 * @description When a user joins the room, add them to the online users list
	 */
	useEffect(() => {
		if (user) {
			socket.emit("userJoined", user);
		}
	}, [user]);

	if (!user) {
		return <Form />;
	}

	return (
		<div className="home">
			{user?.presenter ? (
				<Board
					socket={socket}
					user={user}
					setUser={setUser}
					elements={elements}
					setElements={setElements}
				/>
			) : (
				<ClientRoom socket={socket} elements={elements} />
			)}
		</div>
	);
}

export default App;
