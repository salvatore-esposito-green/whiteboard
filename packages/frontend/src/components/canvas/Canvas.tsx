import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { CanvasProps } from "@types";
import rough from "roughjs/bundled/rough.cjs";
import _ from "lodash";

/**
 * @description Check if the event is a touch event or a mouse event
 * @param e
 */
function isTouchEvent(e: React.TouchEvent | React.MouseEvent): e is React.TouchEvent {
	return e && "touches" in e;
}

function isMouseEvent(e: React.TouchEvent | React.MouseEvent): e is React.MouseEvent {
	return e && "screenX" in e;
}

function Canvas({ canvasRef, ctx, color, setElements, elements, socket, user }: CanvasProps) {
	const [isDrawing, setIsDrawing] = useState(false);

	const clearCanvasDebounced = useRef(_.debounce(clearCanvas, 5000));

	/**
	 * @description When the component mounts, set the canvas height and width to the window height and width
	 * The canvas is scaled by 2 to ensure that the lines are smooth
	 * Set also the line cap and line join to round
	 */
	useEffect(() => {
		const canvas = canvasRef.current;

		canvas.height = window.innerHeight * 2;
		canvas.width = window.innerWidth * 2;
		canvas.style.width = `${window.innerWidth}px`;
		canvas.style.height = `${window.innerHeight}px`;

		const context = canvas.getContext("2d");

		context.scale(2, 2);
		context.lineCap = "round";
		context.lineJoin = "round";
		context.strokeStyle = color;
		context.lineWidth = 5;

		ctx.current = context;
	}, []);

	/**
	 * @description When the color changes, update the context color
	 */
	useEffect(() => {
		ctx.current.strokeStyle = color;
	}, [color]);

	const handleMouseDown = (e: React.MouseEvent) => {
		if (isMouseEvent(e)) {
			const { offsetX, offsetY } = e.nativeEvent;

			setElements((prevElements) => [
				...prevElements,
				{
					offsetX,
					offsetY,
					path: [[offsetX, offsetY]],
					stroke: color,
				},
			]);

			setIsDrawing(true);
		}
	};

	const handleTouchStart = (e: React.TouchEvent) => {
		if (isTouchEvent(e)) {
			const clientX = e.touches[0].clientX;
			const clientY = e.touches[0].clientY;

			setElements((prevElements) => [
				...prevElements,
				{
					offsetX: clientX,
					offsetY: clientY,
					path: [[clientX, clientY]],
					stroke: color,
				},
			]);

			setIsDrawing(true);
		}
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		if (isTouchEvent(e)) {
			const clientX = e.touches[0].clientX;
			const clientY = e.touches[0].clientY;

			setElements((prevElements) =>
				prevElements.map((ele, index) =>
					index === elements.length - 1
						? {
								offsetX: ele.offsetX,
								offsetY: ele.offsetY,
								path: [...ele.path, [clientX, clientY]],
								stroke: ele.stroke,
								element: ele.element,
						  }
						: ele,
				),
			);
		}
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!isDrawing) {
			return;
		}

		if (isMouseEvent(e)) {
			const { offsetX, offsetY } = e.nativeEvent;

			setElements((prevElements) =>
				prevElements.map((ele, index) =>
					index === elements.length - 1
						? {
								offsetX: ele.offsetX,
								offsetY: ele.offsetY,
								path: [...ele.path, [offsetX, offsetY]],
								stroke: ele.stroke,
								element: ele.element,
						  }
						: ele,
				),
			);
		}
	};

	const stopDrawing = () => {
		setIsDrawing(false);
	};

	useLayoutEffect(() => {
		const roughCanvas = rough.canvas(canvasRef.current);

		if (elements.length > 0) {
			ctx.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
		}

		elements.forEach((ele, i) => {
			roughCanvas.curve(ele.path, {
				stroke: ele.stroke,
				roughness: 0.5,
				strokeWidth: 5,
				bowing: 0.01,
			});
		});

		const canvasImage = canvasRef.current.toDataURL();

		/**
		 * @name drawing
		 * @description Emits the drawing to the server with the user id
		 */
		if (elements.length > 0) {
			socket.emit("drawing", canvasImage, user);
		}
	}, [elements]);

	function clearCanvas() {
		if (isDrawing) return;

		ctx.current.clearRect(0, 0, canvasRef.current?.width, canvasRef.current?.height);

		setElements((prevElements) => []);
		socket.emit("drawing", null, user);
	}

	useEffect(() => {
		/**
		 * @description When the user stops drawing, emit the drawing to the server and delete the elements
		 */
		if (!isDrawing) {
			clearCanvasDebounced.current();
		}
	}, [isDrawing]);

	return (
		<div
			style={{ height: "100%" }}
			onMouseMove={handleMouseMove}
			onMouseDown={handleMouseDown}
			onTouchMove={handleTouchMove}
			onTouchStart={handleTouchStart}
			onMouseUp={stopDrawing}
			onTouchEnd={stopDrawing}
		>
			<canvas ref={canvasRef} />
		</div>
	);
}

export default Canvas;
