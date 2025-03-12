'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
	email: string;
}

interface AuthContextType {
	user: User | null;
	token: string | null;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null); // store token in state
	const router = useRouter();

	//check if user is logged in, fetch from api/auth/me
	const checkAuth = async () => {
		try {
			const res = await fetch("/api/auth/me");
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
		const res = await fetch("/api/auth/login", {
			method: "POST",
			body: JSON.stringify({ email, password }),
			headers: { "Content-Type": "application/json" },
		});

		if (res.ok) {
			const data = await res.json();
			setUser(data.user);
			setToken(data.token); // store token in context
			localStorage.setItem("token", data.token); // persist across page reloads
			router.push("/dashboard");
		} else {
			const errorData = await res.json();
			alert(errorData.error)
		}
	};

	// logout function
	const logout = async () => {
		await fetch("/api/auth/logout", { method: "POST" });
		setUser(null);
		setToken(null); // clear token on logout
		localStorage.removeItem("token");
		router.push("/login");
	};

	// on mount, check auth and restore token if available
	useEffect(() => {
		checkAuth();

		const storedToken = localStorage.getItem("token"); // optional reload token on refresh
		if (storedToken) {
			setToken(storedToken);
		}
	}, []);

	return (
		<AuthContext.Provider value={{ user, token, login, logout }}>
			{children}
		</AuthContext.Provider>
	)
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined || !context) {
		throw new Error("useAuth must be used within AuthProvider");
	} 
	return context;
}