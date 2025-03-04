"use client"

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
	const { user, logout } = useAuth();
	const router = useRouter();

	const handleLogout = async () => {
		await logout();
		router.push("/login");
	}

	useEffect(() => {
		if (!user) {
			router.push("/login");
		}
	}, [user])

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold">Welcome, {user?.email}</h1>
			<button onClick={handleLogout} className="mt-4 bg-red-500 text-white px-4 py-2">Logout</button>
		</div>
	)
}