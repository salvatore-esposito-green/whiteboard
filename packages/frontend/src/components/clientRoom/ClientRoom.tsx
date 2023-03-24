import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./ClientRoom.module.scss";
import { ClientRoomProps, Toast, User } from "@types";
import OnlineUsers from "@components/debugger/onlineUsers/OnlineUsers";
import ToastComponent from "@components/toast/Toast";
import Debugger from "@components/debugger/Debugger";

const ClientRoom = ({ socket, elements }: ClientRoomProps) => {
	const [userNo, setUserNo] = useState(0);
	const [users, setUsers] = useState<User[]>([]);
	const [imageArr, setImageArr] = useState([]);
	const [toast, setToast] = useState<Toast[]>([]);

	const containerImages = useRef(null);

	useEffect(() => {
		socket.on("message", (data) => {
			const date = Date.now();
			setToast((toast) => [...toast, { message: data.message, date }]);
		});
	}, []);

	useEffect(() => {
		socket.on("users", (data) => {
			setUsers(data);
			setUserNo(data.length);
		});
	}, []);

	useEffect(() => {
		/**
		 * @description When the server sends a canvas image, update the imageArr[]
		 */
		socket.on("canvasImage", (data, userId) => {
			if (userId) {
				// Set imageArr to include the new image with userId as key
				setImageArr((imageArr) => ({ ...imageArr, [userId]: data }));
			}
		});
	}, []);

	const imagesHtml = useCallback(() => {
		return Object.keys(imageArr).map((userId, index) => {
			if (!imageArr[userId]) return;

			return (
				<div key={userId.toString()} className={styles.client__image}>
					<img src={imageArr[userId]} alt={userId} />
				</div>
			);
		});
	}, [imageArr]);

	useEffect(() => {
		containerImages.current = imagesHtml();
		return () => {
			cancelAnimationFrame(containerImages.current);
		};
	}, [imageArr]);

	return (
		<>
			<h1 className={styles.h1}>@whiteboard app</h1>
			<span className={styles.claim}>🖋️ let's draw together</span>

			<Debugger elements={elements} users={users} toast={toast} userNo={userNo} socket={socket} />
			{toast.length > 0 ? <ToastComponent toast={toast} setToast={setToast} /> : null}

			{containerImages.current}
		</>
	);
};

export default ClientRoom;
