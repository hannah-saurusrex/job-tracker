"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();

		const res = await fetch("../api/auth/register.ts", {
			method: "POST",
			body: JSON.stringify({ name, email, password }),
			headers: { "Content-Type": "application/json" },
		});

		if (res.ok) {
			alert("registration successful, please login");
			router.push("/login");
		} else {
			const errorData = await res.json();
			alert(errorData.error)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center">
			<form onSubmit={handleRegister} className="p-6 bg-white rounded shadow-md">
				<h2 className="text-xl font-bold mb-4">Register</h2>
				<input type="text" placeholder="name" className="border p-2 w-full mb-2" value={name} onChange={(e) => (setName(e.target.value))} />
				<input type="email" placeholder="email" className="border p-2 w-full mb-2" value={email} onChange={(e) => setEmail(e.target.value)} />
				<input type="password" placeholder="password" className="border p-2 w-full mb-2" value={password} onChange={(e) => setPassword(e.target.value)} />
				<button className="bg-green-500 text-white py-2 px-4 w-full" type="submit">Register</button>
			</form>
		</div>
	)
}