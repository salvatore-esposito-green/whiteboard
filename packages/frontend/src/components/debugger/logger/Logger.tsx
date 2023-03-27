import React, { useEffect, useState } from "react";
import styles from "../Debugger.module.scss";
import { Log } from "@types";
import { useSocket } from "../../../AppContext";

function Logger() {
	const socket = useSocket();

	const [log, setLog] = useState<Log[]>([]);

	useEffect(() => {
		socket?.on("log", (data) => {
			setLog((log) => [...log, data]);
		});
	}, [socket]);

	return (
		<div className={styles.Logger}>
			<h1>Logger</h1>
			{log.reverse().map((log, index) => {
				if (Date.now() - log.data > 1000 * 30) return null;

				const time = convertDate(log.data);

				return (
					<div key={index}>
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
