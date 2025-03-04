"use client"

import { useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { login } = useAuth();
	const router = useRouter();
	
	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		await login(email, password);
		router.push('/dashboard') // redirect to dashboard after login
	}

	return (
		<div className="min-h-screen flex items-center justify-center">
			<form onSubmit={handleLogin} className="p-6 bg-white rounded shadow-md">
				<h2 className="text-xl font-bold mb-4">Login</h2>
				<input type="email" placeholder="email" className="border p-2 w-full mb-2" value={email} onChange={(e) => setEmail(e.target.value)} />
				<input type="password" placeholder="password" className="border p-2 w-full mb-2" value={password} onChange={(e) => setPassword(e.target.value)} />
				<button className="bg-blue-500 text-white py-2 px-4 w-full" type="submit">Login</button>
			</form>
		</div>
	)
}