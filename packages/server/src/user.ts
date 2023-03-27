import { User } from "./types";

const users: User[] = [];

// Join user to chat
const userJoin = (user: User) => {
	users.push(user);
	return user;
};

// User leaves chat
const userLeave = (socketId: string): User | undefined => {
	const index = users.findIndex((user) => user.id === socketId);

	if (index !== -1) {
		return users.splice(index, 1)[0];
	}

	return undefined;
};

// get users
const getUsers = (room: string): User[] => {
	const RoomUsers: User[] = [];

	users.map((user) => {
		if (user.roomId === room) {
			RoomUsers.push(user);
		}
	});

	return RoomUsers;
};

const getUser = (userId: string): User => {
	const user = users.find((user) => user.userId === userId);
	if (!user) {
		return undefined;
	}
	return user;
};

module.exports = {
	userJoin,
	userLeave,
	getUsers,
	getUser,
};
