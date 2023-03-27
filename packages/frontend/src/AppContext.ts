import { createContext, useCallback, useContext, useMemo } from "react";
import { AppContextType } from "@types";
export const AppContext = createContext<AppContextType>(null);

export const AppContextProvider = AppContext.Provider;
export const AppContextConsumer = AppContext.Consumer;

export function useAppContext() {
	return useContext(AppContext);
}

export function useSocket() {
	const appCtx = useAppContext();

	const socket = useMemo(() => {
		return appCtx.socket;
	}, [appCtx.socket]);

	return socket;
}

export function useUser() {
	const appCtx = useAppContext();

	const user = useMemo(() => {
		return appCtx.user;
	}, [appCtx.user]);

	const setUser = useCallback(
		(user) => {
			return appCtx.setUser(user);
		},
		[appCtx.setUser],
	);

	return { user, setUser };
}

export function useElements() {
	const appCtx = useAppContext();

	const elements = useMemo(() => {
		return appCtx.elements;
	}, [appCtx.elements]);

	const setElements = useCallback(
		(users) => {
			return appCtx.setElements(users);
		},
		[appCtx.setElements],
	);

	return { elements, setElements };
}

export function useUsers() {
	const appCtx = useAppContext();

	const users = useMemo(() => {
		return appCtx.users;
	}, [appCtx.users]);

	const setUsers = useCallback(
		(elements) => {
			return appCtx.setUsers(elements);
		},
		[appCtx.setUsers],
	);

	return { users, setUsers };
}

export function useUserNo() {
	const appCtx = useAppContext();

	const userNo = useMemo(() => {
		return appCtx.userNo;
	}, [appCtx.userNo]);

	const setUserNo = useCallback(
		(userNo) => {
			return appCtx.setUserNo(userNo);
		},
		[appCtx.setUserNo],
	);

	return { userNo, setUserNo };
}

export function useToast() {
	const appCtx = useAppContext();

	const toast = useMemo(() => {
		return appCtx.toast;
	}, [appCtx.toast]);

	const setToast = useCallback(
		(toast) => {
			return appCtx.setToast(toast);
		},
		[appCtx.setToast],
	);

	return { toast, setToast };
}
