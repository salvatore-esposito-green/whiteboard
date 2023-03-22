import styles from "./Debugger.module.scss";
import React from "react";

function Debugger() {
	return (
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
	);
}

export default Debugger;
