import React, { useEffect, useState } from "react";
import styles from "../Debugger.module.scss";
import { Socket } from "socket.io-client";
import { ClientToServerEvents, Log, ServerToClientEvents } from "@types";

function Logger({ socket }: { socket: Socket<ServerToClientEvents, ClientToServerEvents> }) {
	const [log, setLog] = useState<Log[]>([]);

	useEffect(() => {
		socket.on("log", (data) => {
			setLog((log) => [...log, data]);
		});
	}, []);

	return (
		<div className={styles.Logger}>
			<h1>Logger</h1>
			{log.map((log, index) => {
				const time = convertDate(log.data);

				return (
					<div key={log.data}>
						<p>
							{JSON.stringify(log.message, null, 2)} | <b>{time}</b>
						</p>
					</div>
				);
			})}
		</div>
	);
}

export default Logger;

function convertDate(date: number) {
	const dateObject = new Date(date);
	const hours = dateObject.getHours();
	const minutes = dateObject.getMinutes();
	const seconds = dateObject.getSeconds();
	return `${hours}:${minutes}:${seconds}`;
}
