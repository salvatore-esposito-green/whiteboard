export interface ServerToClientEvents {
	message: (data: { message: string }) => void;
	users: (data: User[]) => void;
	canvasImage: (imageUrl: string, userId: string) => void;
}

export interface ClientToServerEvents {
	userJoined: (user: User) => void;
	drawing: (canvasImage: string, userId: string) => void;
}

export interface InterServerEvents {}
export interface SocketData {}

export interface User {
	roomId: string;
	userId: string;
	username: string;
	host: boolean;
	presenter: boolean;
}
