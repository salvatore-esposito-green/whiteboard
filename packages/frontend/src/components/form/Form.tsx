import React, { useCallback, useState } from "react";
import styles from "./Form.module.scss";

const Form: React.FC = () => {
	const queryParams = new URLSearchParams(window.location.search);
	const isPresenter = !queryParams.get("isPresenter");

	const [username, setUsername] = useState<string>("");

	const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setUsername(e.target.value);
	};

	const handleSubmitForm = useCallback(() => {
		if (username.trim() === "") return;

		/**
		 * TODO: In the future, we will need to handle the case where a user joins the specific room
		 */
		const user = {
			roomId: "roomId",
			userId: uuid(),
			username: username,
			host: true,
			presenter: isPresenter || false,
		};

		sessionStorage.setItem("user", JSON.stringify(user));
	}, [username, isPresenter]);

	return (
		<form className={styles.form} onSubmit={() => handleSubmitForm()}>
			<h1>Inserisci il tuo username</h1>
			<input
				type="text"
				placeholder={"username"}
				value={username}
				onChange={handleChangeUsername}
			/>
			<button type={"submit"}>Invia</button>
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
