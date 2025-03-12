"use client";

import {PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend, LineChart, Line } from 'recharts';

interface Job {
	id: string,
	company: string,
	title: string,
	status: string,
	date: string,
}

interface JobAnalyticsProps {
	jobs: Job[];
}

export default function JobAnalytics({ jobs }: JobAnalyticsProps) {
	if (!jobs.length) return <p className="text-gray-500">No data available.</p>

	// job status breakdown Pie Chart
	const statusCounts = jobs.reduce((acc, job) => {
		acc[job.status] = (acc[job.status] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);

	const pieData = Object.keys(statusCounts).map((status) => ({
		name: status.charAt(0).toUpperCase() + status.slice(1),
		value: statusCounts[status],
	}));

	const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff6b6b"];

	//Applications over time Line Chart
	const applicationsByDate = jobs.reduce((acc, job) => {
		const date = new Date(job.date).toISOString().split("T")[0];
		acc[date] = (acc[date] || 0) +1;
		return acc;
	}, {} as Record<string, number>);

	const lineData = Object.keys(applicationsByDate).map((date) => ({
		date,
		application: applicationsByDate[date],
	}));

	// applicatoins by company, bar chart
	const companyCounts = jobs.reduce((acc, job) => {
		acc[job.company] = (acc[job.company] || 0) +1;
		return acc;
	}, {} as Record<string, number>);

	const barData = Object.keys(companyCounts).map((company) => ({
		company,
		applications: companyCounts[company],
	}))

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
			{/* pie chart job status breakdown */}
			<div className="bg-white p-4 shadow rounded-lg">
				<h2 className="text-lg font-semibold text-gray-700 mb-2">Job Status Breakdown</h2>
				<ResponsiveContainer width="100%" height={300}>
					<PieChart>
						<Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
							{pieData.map((_, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
					</PieChart>
				</ResponsiveContainer>
			</div>

			{/* line chart for apps over time */}
			<div className="bg-white p-4 shadow rounded-lg">
				<h2 className="text-lg font-semibold text-gray-700 mb-2">Applications Over Time</h2>
				<ResponsiveContainer width="100%" height={300}>
					<LineChart data={lineData}>
						<XAxis dataKey="date" />
						<YAxis />
						<Tooltip />
						<Legend />
						<Line type="monotone" dataKey="applications" stroke="#8884d8" strokeWidth={2} />
					</LineChart>
				</ResponsiveContainer>
			</div>

			{/* bar chart - apps by company */}
			<div className="bg-white p-4 shadow rounded-lg">
				<h2 className="text-lg font-semibold text-gray-700 mb-2">Applications by Company</h2>
				<ResponsiveContainer width="100%" height={300}>
							<BarChart data={barData}>
								<XAxis dataKey="company" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Bar dataKey="applications" fill="#82ca9d" />
							</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	)

}