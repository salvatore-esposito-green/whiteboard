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

export interface InterServerEvents {}
export interface SocketData {}

export interface User {
	id: string;
	userId: string;
	username: string;
	roomId: string;
	host: boolean;
	presenter: boolean;
}

export interface LastMessage {
	socketId: string;
	date: number;
}
