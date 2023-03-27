import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./ClientRoom.module.scss";
import ToastComponent from "@components/toast/Toast";
import Debugger from "@components/debugger/Debugger";
import { useSocket, useToast } from "../../AppContext";

const ClientRoom = () => {
	const [imageArr, setImageArr] = useState([]);

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

	const handleFilterClick = (userId: string) => {};

	const imagesHtml = useCallback(() => {
		return Object.keys(imageArr).map((userId, index) => {
			if (!imageArr[userId]) return;

			return (
				<div
					key={userId.toString()}
					className={styles.client__image}
					onClick={() => handleFilterClick(userId)}
				>
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

			<Debugger />
			<ToastComponent />

			<div className={"container-images"}>{containerImages.current}</div>
		</>
	);
};

export default ClientRoom;
