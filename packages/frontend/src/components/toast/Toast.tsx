import React, { useCallback, useEffect, useRef } from "react";
import styles from "./Toast.module.scss";
import { useSocket, useToast } from "../../AppContext";

const DELAY = 1000;

function ToastComponent() {
	const socket = useSocket();
	const { toast, setToast } = useToast();

	const toastHTML = useRef([]);

	useEffect(() => {
		socket?.on("message", (data) => {
			const date = Date.now();
			setToast((toast) => [...toast, { message: data.message, date }]);
		});
	}, [socket]);

	const filterToasts = useCallback(() => {
		toast.forEach((toast, index) => {
			if (Date.now() - toast.date > DELAY) {
				setToast((toast) => toast.filter((_, i) => i !== index));
			}
		});
	}, [toast]);

	const renderToasts = useCallback(() => {
		toastHTML.current = toast
			.reverse()
			.filter((_, i) => i < 5)
			.map((toast, index) => {
				return (
					<div key={index} className={styles.Toast}>
						<p dangerouslySetInnerHTML={{ __html: parseBoaldString(toast.message) }} />
					</div>
				);
			});
	}, [toast]);

	useEffect(() => {
		filterToasts();
		renderToasts();
	}, [toast]);

	if (toast.length < 1) {
		return null;
	}

	return <div className={styles.ContainerToast}>{toastHTML.current}</div>;
}

export default ToastComponent;

function parseBoaldString(message: string): string {
	const substr = message.split("**");

	if (substr.length > 1) {
		const boldString = substr[1];
		return message.replace(`**${boldString}**`, boldString.bold());
	}

	return message;
}
