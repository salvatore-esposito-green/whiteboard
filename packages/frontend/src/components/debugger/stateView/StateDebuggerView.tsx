import React from "react";
import ReactJson from "react-json-view";
import styles from "../Debugger.module.scss";
import { useElements, useToast, useUsers } from "../../../AppContext";

function StateDebuggerView() {
	const { elements } = useElements();
	const { users } = useUsers();
	const { toast } = useToast();

	return (
		<div className={styles.State}>
			<h3 style={{ color: "white" }}>State:</h3>

			<ReactJson
				collapsed={true}
				src={{ toast, elements, users }}
				theme={{
					base00: "#525252",
					base01: "white",
					base02: "white",
					base03: "white",
					base04: "orange",
					base05: "white",
					base06: "white",
					base07: "white",
					base08: "white",
					base09: "white",
					base0A: "white",
					base0B: "white",
					base0C: "white",
					base0D: "white",
					base0E: "white",
					base0F: "white",
				}}
			/>
		</div>
	);
}

export default StateDebuggerView;
