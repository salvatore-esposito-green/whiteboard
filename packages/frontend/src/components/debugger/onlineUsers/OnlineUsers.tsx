import React, { useEffect, useRef } from "react";
import styles from "./OnlineUsers.module.scss";
import { useUserNo, useUsers } from "src/AppContext";

const OnlineUsers: React.FC = () => {
	const { users } = useUsers();
	const { userNo } = useUserNo();

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
