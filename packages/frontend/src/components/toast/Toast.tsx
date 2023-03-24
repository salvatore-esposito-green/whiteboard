import React from "react";
import styles from "./Toast.module.scss";
import { Toast } from "@types";

const DELAY = 5000;

function ToastComponent({
	toast,
	setToast,
}: {
	toast: Toast[];
	setToast: React.Dispatch<React.SetStateAction<Toast[]>>;
}) {
	const renderToasts = () => {
		return toast.map((toast, index) => {
			if (Date.now() - toast.date > DELAY) {
				setToast((toast) => toast.filter((_, i) => i !== index));
				return;
			}

			return (
				<p key={index} dangerouslySetInnerHTML={{ __html: parseBoaldString(toast.message) }} />
			);
		});
	};

	return <div className={styles.Toast}>{renderToasts()}</div>;
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
