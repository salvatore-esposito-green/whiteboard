import React, { useEffect, useMemo, useState } from "react";
import { io, Socket } from "socket.io-client";
import Board from "@components/board/Board";
import { ClientToServerEvents, Element, ServerToClientEvents, Toast, User } from "./types";
import ClientRoom from "@components/clientRoom/ClientRoom";
import { useScrollBlock } from "./hooks/useScrollBlock";
import Form from "@components/form/Form";
import { AppContextProvider, useSocket, useUser, useUserNo, useUsers } from "./AppContext";
import Loader from "@components/loader/Loader";

const hostname = process.env["NGROK_HOSTNAME"];
const serverPort = process.env["PORT"];
const serverUrl = `${hostname}`;

const connectionOptions = {
	forceNew: true,
	reconnection: true,
	timeout: 10000,
	transports: ["websocket"],
};

let socket: Socket<ServerToClientEvents, ClientToServerEvents>;

function App() {
	const { user } = useUser();
	const { setUsers } = useUsers();
	const { setUserNo } = useUserNo();
	const socket = useSocket();

	const [blockScroll, allowScroll] = useScrollBlock();

	/**
	 * Block scroll when user is presenter or when user draws on mobile
	 */
	useEffect(() => {
		blockScroll();
	}, []);

	useEffect(() => {
		socket?.on("users", (data) => {
			setUsers(data);
			setUserNo(data.length);
		});
	}, [socket]);

	useEffect(() => {
		if (user) {
			sessionStorage.setItem("user", JSON.stringify(user));
		}
	}, [user]);

	if (!user) {
		return <Form />;
	}

	return <div className="home">{user?.presenter ? <Board /> : <ClientRoom />}</div>;
}

export default App;

export function AppContext({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(JSON.parse(sessionStorage.getItem("user")));
	const [elements, setElements] = useState<Element[] | []>([]);
	const [users, setUsers] = useState<User[]>([]);
	const [userNo, setUserNo] = useState(0);
	const [toast, setToast] = useState<Toast[]>([]);
	const [isConnected, setIsConnected] = useState(socket?.connected);

	useEffect(() => {
		function onConnect() {
			setIsConnected(true);
		}

		function onDisconnect() {
			setIsConnected(false);
		}

		socket = io(serverUrl, connectionOptions);

		socket?.on("connect", onConnect);
		socket?.on("disconnect", onDisconnect);

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
		};
	}, [socket]);

	useEffect(() => {
		console.log("isConnected", isConnected);
		console.log("serverUrl", serverUrl);
	}, [isConnected]);

	const contextValue = useMemo(
		() => ({
			user,
			setUser,
			elements,
			setElements,
			users,
			setUsers,
			userNo,
			setUserNo,
			socket,
			toast,
			setToast,
		}),
		[
			user,
			setUser,
			elements,
			setElements,
			users,
			setUsers,
			userNo,
			setUserNo,
			socket,
			toast,
			setToast,
		],
	);

	return (
		<AppContextProvider value={contextValue}>
			{!isConnected ? <Loader /> : null}
			{children}
		</AppContextProvider>
	);
}
