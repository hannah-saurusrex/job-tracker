"use client"

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import NewJobForm from '@/components/NewJobForm';
import JobAnalytics from '@/components/JobAnalytics';

interface Job {
	id: string,
	company: string,
	title: string,
	status: string,
	date: string,
	notes?: string,
}

export default function DashboardPage() {
	const { user, logout } = useAuth();
	const router = useRouter();
	const [jobs, setJobs] = useState<Job[]>([]);
	const [editJob, setEditJob] = useState<Partial<Job> | null>(null);

	const fetchJobs = async () => {
		const res = await fetch("/api/jobs/list");
		if (res.ok) {
			const data = await res.json();
			setJobs(data)
			console.log('test', setJobs(data))
		}
	}

	const deleteJob = async (id: string) => {
		const res = await fetch("/api/jobs/delete", {
			method: "DELETE",
			body: JSON.stringify({ id }),
			headers: { "Content-Type": "application/json" },
		});

		if (res.ok) {
			setJobs(jobs.filter((job) => job.id !== id));
		} else {
			alert("failed to delete job")
		}
	}

	const saveEdit = async () => {
		if (!editJob?.id) return;

		const res = await fetch("/api/jobs/update", {
			method: "PUT",
			body: JSON.stringify(editJob),
			headers: { "Content-Type": "application/json" },
		});

		if (res.ok) {
			setEditJob(null);
			fetchJobs(); // refetch list
			console.log('feth', fetchJobs())
		} else {
			alert("failed to update job")
		}
	}

	const handleLogout = async () => {
		await logout();
		router.push("/login");
	}

	useEffect(() => {
		if (!user) {
			router.push("/login");
		}
		if (user) {
			fetchJobs()
		}
	}, [user, router])

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold">Welcome, {user?.email}</h1>
			<button 
				onClick={handleLogout} 
				className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
			>
				Logout
			</button>
			
			<h2 className="mt-6 mb-1 text-xl font-semibold">My Job Applications</h2>

			<NewJobForm onJobAdded={fetchJobs} />

			{/* job analytics */}
			<JobAnalytics jobs={jobs} />
			
			<div className="mt-4 space-y-4">
				{jobs.map((job) => (
					<div key={job.id} className="p-4 border rounded shadow">
						{editJob?.id === job.id ? (
							// edit mode, inline form
							<div className="space-y-2">
								<input 
									type="text"
									placeholder="Job title"
									value={editJob.title ?? ""}
									onChange={(e) => setEditJob({...editJob, title: e.target.value })}
									className="border p-2 w-full text-black" 
								/>
								<input 
									type="text"
									placeholder="company"
									value={editJob.company ?? ""}
									onChange={(e) => setEditJob({...editJob, company: e.target.value})}
									className="border p-2 w-full text-black" 
								/>
								<select
									value={editJob.status ?? "applied"}
									onChange={(e) => setEditJob({...editJob, status: e.target.value})}
									className="border p-2 w-full text-black">
										<option value="applied">Applied</option>
										<option value="interivewed">Interviewed</option>
										<option value="rejected">Rejected</option>
										<option value="offer">OFFER</option>
								</select>
								<textarea
									value={editJob.notes ?? ""}
									onChange={(e) => setEditJob({...editJob, notes: e.target.value})}
									placeholder="Notes (optional)"
									className="border p-2 w-full text-black"
								/>
								<div className="flex space-x-2">
									<button 
										className="bg-gree-500 text-white px-4 py-2"
										onClick={saveEdit}>
											Save
									</button>
									<button 
										className="bg-gree-500 text-white px-4 py-2"
										onClick={() => setEditJob(null)}>
											Cancel
									</button>
								</div>
							</div>
						) : (
							// Read-only mode
							<div>
								<h3 className="font-bold">{job.title} @ {job.company}</h3>
								<p>Status: <span className="text-red-500">{job.status}</span></p>
								<p>Date: {new Date(job.date).toLocaleDateString()}</p>
								{job.notes && <p>Notes: {job.notes}</p>}

								<div className="mt-2 flex space-x-2">
									<button 
										className="bg-blue-500 text-white px-4 py-2 rounded-md"
										onClick={() => setEditJob(job)}>
											Edit
									</button>
									<button 
										className="bg-red-500 text-white px-4 py-2 rounded-md"
										onClick={() => deleteJob(job.id)}>
											Delete
									</button>
								</div>
							</div>
						)}
					
					</div>
				))}
			</div>
		</div>
	)
}