import React, { useEffect, useRef } from "react";
import { User } from "@types";
import styles from "./OnlineUsers.module.scss";

const OnlineUsers: React.FC<{ users: User[]; userNo: number }> = ({ users, userNo }) => {
	const listRef = useRef<HTMLUListElement | null>(null);

	useEffect(() => {
		// 👇 Scroll to the last element in the list
		listRef.current?.lastElementChild?.scrollIntoView();
	}, [users]);

	return (
		<div className={styles.Box__Users}>
			<h2>Online Users {userNo ? <span>{userNo}</span> : null}</h2>
			<ul ref={listRef}>
				{users.map((user) => (
					<li key={user.userId}>
						<p>
							<span></span> <i>{user.username}</i>
						</p>
					</li>
				))}
			</ul>
		</div>
	);
};

export default OnlineUsers;
