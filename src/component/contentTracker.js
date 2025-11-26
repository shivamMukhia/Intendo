"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { auth } from "@/helper/firebase"; // if using Firebase auth

export default function ContentTracker() {
	const [trackerData, setTrackerData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const COLORS = {
		education: "#4CAF50",
		entertainment: "#FF5722",
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				// ✅ get user token from Firebase (if you use Firebase auth)
				const token = await auth.currentUser?.getIdToken();

				const res = await axios.get("/api/tracker/stats", {
					headers: {
						Authorization: `Bearer ${token}`, // send token for backend to extract user id
					},
					// If your backend expects query param instead of JWT:
					// params: { userId: auth.currentUser?.uid }
				});

				const withColors = res.data.map((item) => ({
					name:
						item.category.charAt(0).toUpperCase() +
						item.category.slice(1),
					value: item.percentage,
					color: COLORS[item.category.toLowerCase()] || "#8884d8",
				}));

				setTrackerData(withColors);
			} catch (err) {
				console.error(err);
				setError("Failed to load content stats");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) {
		return <p className="text-sm text-gray-500">Loading tracker...</p>;
	}

	if (error) {
		return <p className="text-sm text-red-500">{error}</p>;
	}

	if (trackerData.length === 0) {
		return <p className="text-sm text-gray-500">No watch data yet.</p>;
	}

	return (
		<div className="flex flex-col items-center">
			<h3 className="text-md font-semibold mb-2">Content Tracker</h3>

			{/* Pie Chart */}
			<ResponsiveContainer width={120} height={120}>
				<PieChart>
					<Pie
						data={trackerData}
						innerRadius={35}
						outerRadius={55}
						dataKey="value"
						paddingAngle={2}
					>
						{trackerData.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={entry.color} />
						))}
					</Pie>
				</PieChart>
			</ResponsiveContainer>

			{/* Legend */}
			<div className="flex gap-4 mt-2 text-sm">
				{trackerData.map((item, index) => (
					<span key={index} className="flex items-center gap-1">
						<span
							className="w-2 h-2 rounded-full"
							style={{ backgroundColor: item.color }}
						></span>
						{item.name} {item.value}%
					</span>
				))}
			</div>
		</div>
	);
}
