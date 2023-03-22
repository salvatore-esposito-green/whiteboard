import { User } from "./types";

const users: User[] = [];

// Join user to chat
const userJoin = (
	id: string,
	username: string,
	room: string,
	host: boolean,
	presenter: boolean,
) => {
	const user = {
		roomId: room,
		userId: id,
		username,
		host,
		presenter,
	};

	users.push(user);
	return user;
};
// User leaves chat
const userLeave = (id: string): User | undefined => {
	const index = users.findIndex((user) => user.userId === id);

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

module.exports = {
	userJoin,
	userLeave,
	getUsers,
};
