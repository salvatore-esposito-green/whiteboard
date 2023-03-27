import React from "react";
import * as ReactDOMClient from "react-dom/client";
import App, { AppContext } from "./App";

const container = document.getElementById("root");

const root = ReactDOMClient.createRoot(container);

root.render(
	<AppContext>
		<App />
	</AppContext>,
);
