'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
	email: string;
	name?: string;
}

interface AuthContextType {
	user: User | null;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
	checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);

	//check if user is logged in, fetch from api/auth/me
	const checkAuth = async () => {
		try {
			const res = await fetch("/src/app/api/auth/me.ts");
			if (res.ok) {
				const data = await res.json();
				setUser(data.user);
			} else {
				setUser(null);
			}
		} catch (error) {
			console.error("Auth check failed", error);
			setUser(null);
		}
	}

	// login function
	const login = async (email: string, password: string) => {
		const res = await fetch("/src/app/api/auth/login.ts", {
			method: "POST",
			body: JSON.stringify({ email, password }),
			headers: { "Content-Type": "application/json" },
		});
		if (res.ok) {
			await checkAuth(); // refresh user state
		} else {
			const errorData = await res.json();
			alert(errorData.error)
		}
	};

	// logout function
	const logout = async () => {
		await fetch("/src/app/api/auth/logout.ts", { method: "POST" });
		setUser(null);
	};

	useEffect(() => {
		checkAuth();
	}, []);

	return (
		<AuthContext.Provider value={{ user, login, logout, checkAuth }}>
			{children}
		</AuthContext.Provider>
	)
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) throw new Error("useAuth must be used within AuthProvider");
	return context;
}