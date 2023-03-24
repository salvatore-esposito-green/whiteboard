import React from "react";
import ReactJson from "react-json-view";
import { StateDebuggerViewProps } from "@types";
import styles from "../Debugger.module.scss";

function StateDebuggerView({ toast, elements, users }: StateDebuggerViewProps) {
	return (
		<div className={styles.State}>
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
