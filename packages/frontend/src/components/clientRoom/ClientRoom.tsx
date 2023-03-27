import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./ClientRoom.module.scss";
import ToastComponent from "@components/toast/Toast";
import Debugger from "@components/debugger/Debugger";
import { useSocket } from "../../AppContext";

const ClientRoom = () => {
	const [imageArr, setImageArr] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);

	const socket = useSocket();

	const containerImages = useRef(null);

	useEffect(() => {
		/**
		 * @description When the server sends a canvas image, update the imageArr[]
		 */
		socket?.on("canvasImage", (data, userId) => {
			if (userId) {
				// Set imageArr to include the new image with userId as key
				setImageArr((imageArr) => ({ ...imageArr, [userId]: data }));
			}
		});
	}, [socket]);

	useEffect(() => {
		socket?.emit("refreshData");
	}, [socket]);

	const imagesHtml = useCallback(
		(selectedUser) => {
			return Object.keys(imageArr).map((userId, index) => {
				if (!imageArr[userId]) return;

				return (
					<div
						key={userId.toString()}
						className={`${styles.client__image} ${
							selectedUser ? (selectedUser === userId ? styles.selected : styles.unselected) : ""
						}`}
					>
						<img src={imageArr[userId]} alt={userId} />
					</div>
				);
			});
		},
		[imageArr, selectedUser],
	);

	useEffect(() => {
		containerImages.current = imagesHtml(selectedUser);
		return () => {
			cancelAnimationFrame(containerImages.current);
		};
	}, [imageArr, selectedUser]);

	return (
		<>
			<h1 className={styles.h1}>@whiteboard app</h1>
			<span className={styles.claim}>🖋️ let's draw together</span>

			<Debugger setSelectedUser={setSelectedUser} />
			<ToastComponent />

			<div className={"container-images"}>{containerImages.current}</div>
		</>
	);
};

export default ClientRoom;
