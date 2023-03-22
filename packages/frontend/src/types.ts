// Socket
import { MutableRefObject } from "react";
import { Socket } from "socket.io-client";

export interface ServerToClientEvents {
	message: (data: { message: string }) => void;
	users: (data: User[]) => void;
	canvasImage: (imageUrl: string, userId: string) => void;
}

export interface ClientToServerEvents {
	userJoined: (user: User) => void;
	drawing: (canvasImage: string, userId: string) => void;
}

export interface User {
	roomId: string;
	userId: string;
	username: string;
	host: boolean;
	presenter: boolean;
}

export interface BoardProps {
	socket: Socket<ServerToClientEvents, ClientToServerEvents>;

	user: User;
}

export type Element = {
	offsetX: number;
	offsetY: number;
	path: Array<[number, number]>;
	stroke: string;
	element?: string;
};

export interface CanvasProps {
	canvasRef: MutableRefObject<HTMLCanvasElement | null>;
	ctx: MutableRefObject<CanvasRenderingContext2D>;
	color: string;
	setElements(elements: (prevElements: Element[]) => Element[]): void;
	elements: Element[];
	socket: Socket<ServerToClientEvents, ClientToServerEvents>;
	user: User;
}
