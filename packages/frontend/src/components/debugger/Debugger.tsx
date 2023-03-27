import styles from "./Debugger.module.scss";
import React from "react";
import StateDebuggerView from "@components/debugger/stateView/StateDebuggerView";
import OnlineUsers from "@components/debugger/onlineUsers/OnlineUsers";
import Logger from "@components/debugger/logger/Logger";

function Debugger() {
	return (
		<>
			<Logger />
			<div className={styles.Container}>
				<div className={styles.home__header}>
					<h3>Environmental variables:</h3>
					<p>
						process.env.PRODUCTION: <b>{process.env.PRODUCTION.toString()}</b>
					</p>
					<p>
						process.env.NAME: <b>{process.env.NAME}</b>
					</p>
					<p>
						process.env.VERSION: <b>{process.env.VERSION}</b>
					</p>
					<p>
						process.env.NGROK_AUTHTOKEN: <b>{process.env.NGROK_AUTHTOKEN}</b>
					</p>
					<p>
						process.env.PORT: <b>{process.env.PORT}</b>
					</p>
					<p>
						process.env.NGROK_HOSTNAME: <b>{process.env.NGROK_HOSTNAME}</b>
					</p>
				</div>
				<StateDebuggerView />
				<OnlineUsers />
			</div>
		</>
	);
}

export default Debugger;
