import styles from "./Debugger.module.scss";
import React from "react";
import StateDebuggerView from "@components/debugger/stateView/StateDebuggerView";
import { DebuggerProps } from "@types";
import OnlineUsers from "@components/debugger/onlineUsers/OnlineUsers";
import Logger from "@components/debugger/logger/Logger";

function Debugger({ elements, users, toast, userNo, socket }: DebuggerProps) {
	return (
		<>
			<Logger socket={socket} />
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
				</div>
				<StateDebuggerView elements={elements} users={users} toast={toast} />
				<OnlineUsers users={users} userNo={userNo} />
			</div>
		</>
	);
}

export default Debugger;
