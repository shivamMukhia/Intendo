

"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import Image from "next/image";
import Sidebar from "./sidebar";
import SearchBar from "./searchBar";
import { auth } from "@/helper/firebase";
import { onAuthStateChanged } from "firebase/auth";
import UserMenu from "./UserMenu";

export default function Navbar() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [currentUser, setCurrentUser] = useState(null);


	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user || null);
		});
		return () => unsubscribe();
	}, []);

	return (
		<>
			<nav className="w-full flex items-center justify-between px-4 py-2 bg-white shadow-md sticky top-0 z-50 h-12">
				{/* Left Section */}
				<div className="flex items-center gap-4">
					<Menu
						className="w-6 h-6 cursor-pointer"
						onClick={() => setSidebarOpen(!sidebarOpen)}
					/>
					<div className="flex items-center gap-1">
						<Image
							src="/intendo.png"
							alt="intendo image"
							width={30}
							height={30}
						/>
						<span className="text-xl font-bold text-black">Intendo</span>
					</div>
				</div>

				<SearchBar />

				{/* Right Section (separate component) */}
				<div className="relative">
					<UserMenu
						currentUser={currentUser}
					/>
				</div>
			</nav>

			<Sidebar isOpen={sidebarOpen} />
		</>
	);
}
