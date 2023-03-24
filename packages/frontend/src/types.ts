// Socket
import { MutableRefObject } from "react";
import { Socket } from "socket.io-client";

export interface ServerToClientEvents {
	message: (data: { message: string }) => void;
	log: (data: { message: string; data: number }) => void;
	users: (data: User[]) => void;
	canvasImage: (imageUrl: string, userId: string) => void;
}

export interface ClientToServerEvents {
	userJoined: (user: User) => void;
	drawing: (canvasImage: string, user: User) => void;
	logout: (id: string) => void;
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

	setUser(user: User): void;

	elements: Element[];

	setElements(elements: (prevElements: Element[]) => Element[]): void;
}

export interface ClientRoomProps {
	socket: Socket<ServerToClientEvents, ClientToServerEvents>;

	elements: Element[];
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

export interface Toast {
	message: string;
	date: number;
}

export interface StateDebuggerViewProps {
	elements: Element[];
	users: User[];
	toast: Toast[];
}

export interface Log {
	message: string;
	data: number;
}

export interface DebuggerProps {
	elements: Element[];
	users: User[];
	toast: Toast[];
	socket: Socket<ServerToClientEvents, ClientToServerEvents>;
	userNo: number;
}
