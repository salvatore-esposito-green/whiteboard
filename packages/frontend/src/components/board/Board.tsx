import React, { useEffect, useRef, useState } from "react";
import Canvas from "@components/canvas/Canvas";
import { BoardProps, Element } from "../../types";

function Board({ socket, user }: BoardProps) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const ctx = useRef<CanvasRenderingContext2D | null>(null);

	const [color, setRandomColor] = useState<string>("#000000");
	const [elements, setElements] = useState<Element[]>([]);

	useEffect(() => {
		const randomColor = generateRandomColor();
		setRandomColor(randomColor);
	}, []);

	return (
		<Canvas
			socket={socket}
			canvasRef={canvasRef}
			ctx={ctx}
			color={color}
			setElements={setElements}
			elements={elements}
			user={user}
		/>
	);
}

export default Board;

function generateRandomColor() {
	const maxVal = 0xffffff; // 16777215
	let randomNumber = Math.random() * maxVal;
	randomNumber = Math.floor(randomNumber);
	const randomString = randomNumber.toString(16);
	const randColor = randomString.padStart(6, "0");
	return `#${randColor.toUpperCase()}`;
}
