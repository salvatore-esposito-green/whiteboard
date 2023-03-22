import React from "react";
import { User } from "@types";
import styles from "./OnlineUsers.module.scss";

const OnlineUsers: React.FC<{ users: User[] }> = ({ users }) => {
	/**
	 * TODO: Add a list of userNames
	 * 1) Create a form to add a username
	 * 2) Add a button to submit the form
	 */
	return (
		<div className={styles.OnlineUsers}>
			<h2>Online Users</h2>
			<ul>
				{users.map((user) => (
					<li key={user.userId}>{user.userId}</li>
				))}
			</ul>
		</div>
	);
};

export default OnlineUsers;
