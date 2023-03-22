import React, { useEffect, useState } from "react";
import styles from "./ClientRoom.module.scss";
import { BoardProps, User } from "@types";
import OnlineUsers from "@components/onlineUsers/OnlineUsers";

const ClientRoom = ({ socket, user }: BoardProps) => {
	const [userNo, setUserNo] = useState(0);
	const [users, setUsers] = useState<User[]>([]);

	const [imageArr, setImageArr] = useState([]);

	useEffect(() => {
		socket.on("message", (data) => {
			console.log(data.message);
		});
	}, []);

	useEffect(() => {
		socket.on("users", (data) => {
			setUsers(data); // potrei voler mostrare tutti gli utenti collegati?
			setUserNo(data.length);
		});
	}, []);

	useEffect(() => {
		/**
		 * @description When the server sends a canvas image, update the imageArr[]
		 */
		socket.on("canvasImage", (data, userId) => {
			if (data && userId) {
				// set imageArr to include the new image with userId as key
				setImageArr((imageArr) => ({ ...imageArr, [userId]: data }));
			}
		});
	}, []);

	const renderImages = () => {
		return Object.keys(imageArr).map((userId, index) => {
			return (
				<div className={styles.client__image}>
					<img key={userId} src={imageArr[userId]} alt={userId} />
				</div>
			);
		});
	};

	return (
		<>
			<OnlineUsers users={users} />

			<h1>@whiteboard app - Users online: {userNo}</h1>

			{renderImages()}
		</>
	);
};

export default ClientRoom;
