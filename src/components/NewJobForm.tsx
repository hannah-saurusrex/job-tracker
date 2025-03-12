"use client";

import React, { useState } from 'react';
import { useAuth } from "@/context/AuthContext";

interface NewJobFormProps {
	onJobAdded: () => void; // callback to refresh jobs list
}

export default function NewJobForm({ onJobAdded } : NewJobFormProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [newJob, setNewJob] = useState({
		company: "",
		title: "",
		status: "",
		date: new Date().toISOString().split("T")[0],
		notes: "",
	})
	const { token } = useAuth();

	const handleCreateJob = async () => {
		if (!token) {
			alert("no token found. please login in again");
			return;
		}
		
		const res = await fetch("/api/jobs/create", {
			method: "POST",
			headers: { 
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`, 
			},
			body: JSON.stringify(newJob),
		});

		if (res.ok) {
			setIsOpen(false);
			setNewJob({
				company: "",
				title: "",
				status: "",
				date: new Date().toISOString().split("T")[0],
				notes: "",
			});
			onJobAdded(); // trigger to refresh list
		} else {
			const error = await res.json();
			alert(`failed to add job error: ${error}`)
		}
	}


	return (
		<div className="mb-4">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="bg-green-500 text-white px-4 py-2 rounded-md"
			>
				{isOpen ? "Cancel" : "Add New Job"}
			</button>

		{isOpen && (
			<div className="mt-4 p-4 border rounded shadow space-y-2">
				<input 
					type="text"
					placeholder="company"
					className="border p-2 w-full text-black"
					value={newJob.company}
					onChange={(e) => setNewJob({...newJob, company: e.target.value})} 
				/>
				<input 
					type="text"
					placeholder="job title"
					className="border p-2 w-full text-black"
					value={newJob.title}
					onChange={(e) => setNewJob({...newJob, title: e.target.value})} 
				/>
				<select 
					className="border p-2 w-full text-black"
					value={newJob.status}
					onChange={(e) => setNewJob({...newJob, status: e.target.value})}
				>
					<option value="applied">Applied</option>
					<option value="interviewed">Interviewed</option>
					<option value="rejected">Rejected</option>
					<option value="offer">OFFER</option>
				</select>
				<input 
					type="date"
					className="border p-2 w-full text-black"
					value={newJob.date}
					onChange={(e) => setNewJob({...newJob, date: e.target.value})} 
				/>
				<textarea
					placeholder="notes (optional)"
					className="border p-2 w-full text-black"
					value={newJob.notes}
					onChange={(e) => setNewJob({...newJob, notes: e.target.value})} 
				/>
				<button
					className="bg-blue-500 text-white px-4 py-2"
					onClick={handleCreateJob}
				>
					Save job
				</button>
			</div>
		)}
		</div>
	)
}
