// Socket
import { MutableRefObject } from "react";
import { Socket } from "socket.io-client";

export interface ServerToClientEvents {
	message: (data: { message: string }) => void;
	log: (data: { message: string; data: number }) => void;
	users: (data: User[]) => void;
	canvasImage: (imageUrl: string, userId: string) => void;
	responseJoined: (data: { success: boolean; message: string; data: User }) => void;
}

export interface ClientToServerEvents {
	userJoined: (user: User) => void;
	drawing: (canvasImage: string, user: User) => void;
	logout: (id: string) => void;
	refreshData: () => void;
}

export interface User {
	roomId: string;
	userId: string;
	username: string;
	host: boolean;
	presenter: boolean;
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
}

export interface Toast {
	message: string;
	date: number;
}

export interface Log {
	message: string;
	data: number;
}

export interface AppContextType {
	users: User[];
	setUsers(users: User[]): void;
	user: User;
	setUser(user: User): void;
	elements: Element[];
	setElements(elements: Element[]): void;
	toast: Toast[];
	setToast(toast: Toast[]): void;
	socket: Socket<ServerToClientEvents, ClientToServerEvents>;
	userNo: number;
	setUserNo(userNo: number): void;
}
