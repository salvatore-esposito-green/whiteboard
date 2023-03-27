import React, { useCallback, useEffect, useState } from "react";
import styles from "./Form.module.scss";
import { useSocket, useUser } from "../../AppContext";

const Form: React.FC = () => {
	const queryParams = new URLSearchParams(window.location.search);
	const isPresenter = !queryParams.get("isPresenter");

	const { setUser } = useUser();
	const socket = useSocket();

	const [username, setUsername] = useState<string>("");
	const [error, setError] = useState<string>("");

	const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setUsername(e.target.value);
	};

	const handleSubmitForm = useCallback(
		(e) => {
			e.preventDefault();

			setError("");
			if (username.trim() === "") return;

			/**
			 * TODO: In the future, we will need to handle the case where a user joins the specific room
			 */
			const user = {
				roomId: "roomId",
				userId: uuid(),
				username: username.trim(),
				host: true,
				presenter: isPresenter || false,
			};

			/**
			 * @name userJoined
			 * @description When a user joins the room, add them to the online users list
			 */
			socket?.emit("userJoined", user);
		},
		[socket, username, isPresenter],
	);

	useEffect(() => {
		socket?.on("responseJoined", (response) => {
			if (response.success) {
				setUser(response.data);
			} else {
				setError(response.message);
			}
		});
	}, [socket, setUser, setError]);

	return (
		<form className={styles.form} onSubmit={(e) => handleSubmitForm(e)}>
			<h1>Inserisci il tuo username</h1>
			<input
				type="text"
				placeholder={"username"}
				value={username}
				onChange={handleChangeUsername}
			/>
			<button type={"submit"}>Invia</button>
			{error ? <span className={styles.error}>{error}</span> : null}
		</form>
	);
};

export default Form;

/**
 * @name uuid
 * @description Generate a unique id
 */
function uuid(): string {
	const S4 = () => (1 + Math.random() * 0x10000).toString(16).substring(1);

	return `${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
}
