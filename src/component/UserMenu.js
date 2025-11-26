
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { signOut } from "firebase/auth";
// import { auth } from "@/helper/firebase";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import ContentTracker from "./contentTracker";

// export default function UserMenu({
// 	currentUser,
// 	hideFeed,
// 	setHideFeed,
// 	eduOnly,
// 	setEduOnly,
// 	subsOnly,
// 	setSubsOnly,
// }) {
// 	const [isHovering, setIsHovering] = useState(false);
// 	const router = useRouter();

// 	const handleLogout = async () => {
// 		await signOut(auth);
// 		setIsHovering(false);
// 		router.push("/");
// 	};

// 	if (!currentUser) {
// 		return (
// 			<button
// 				onClick={() => router.push("/createUser")}
// 				className="bg-black text-white px-4 py-1 rounded text-center hover:bg-gray-800 transition-all"
// 			>
// 				Login
// 			</button>
// 		);
// 	}

// 	return (
// 		<div
// 			className="relative inline-block text-left"
// 			onMouseEnter={() => setIsHovering(true)}
// 			onMouseLeave={() => setIsHovering(false)}
// 		>
// 			<div className="cursor-pointer text-black font-semibold py-4">
// 				{currentUser.displayName || "User"}
// 			</div>

// 			{isHovering && (
// 				<div className="absolute right-0 mt-0 -mr-3 w-72 bg-white border rounded-xl shadow-lg p-4 space-y-4 z-50">
// 					{/* Tracker (separated) */}
// 					<ContentTracker />

// 					{/* Feed Toggles */}
// 					<div className="space-y-3">
// 						<div className="flex items-center justify-between">
// 							<Label htmlFor="hideFeed">Hide Home Feed</Label>
// 							<Switch
// 								id="hideFeed"
// 								checked={hideFeed}
// 								onCheckedChange={setHideFeed}
// 							/>
// 						</div>
// 						<div className="flex items-center justify-between">
// 							<Label htmlFor="eduOnly">Education Only</Label>
// 							<Switch
// 								id="eduOnly"
// 								checked={eduOnly}
// 								onCheckedChange={setEduOnly}
// 							/>
// 						</div>
// 						<div className="flex items-center justify-between">
// 							<Label htmlFor="subsOnly">Subscribed Only</Label>
// 							<Switch
// 								id="subsOnly"
// 								checked={subsOnly}
// 								onCheckedChange={setSubsOnly}
// 							/>
// 						</div>
// 					</div>

// 					{/* Notes */}
// 					<button
// 						onClick={() => router.push("/notes")}
// 						className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-all"
// 					>
// 						Notes
// 					</button>

// 					{/* Logout */}
// 					<button
// 						onClick={handleLogout}
// 						className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all"
// 					>
// 						Logout
// 					</button>
// 				</div>
// 			)}
// 		</div>
// 	);
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/helper/firebase";
import ContentTracker from "./contentTracker";
import FeedPreferenceToggles from "./feedPreferenceToggle";

export default function UserMenu({ currentUser }) {
  const [isHovering, setIsHovering] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    setIsHovering(false);
    router.push("/");
  };

  if (!currentUser) {
    return (
      <button
        onClick={() => router.push("/createUser")}
        className="bg-black text-white px-4 py-1 rounded text-center hover:bg-gray-800 transition-all"
      >
        Login
      </button>
    );
  }

  return (
    <div
      className="relative inline-block text-left"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="cursor-pointer text-black font-semibold py-4">
        {currentUser.displayName || "User"}
      </div>

      {isHovering && (
        <div className="absolute right-0 mt-0 -mr-3 w-72 bg-white border rounded-xl shadow-lg p-4 space-y-4 z-50">
          {/* Tracker */}
          <ContentTracker />

          {/* Feed Toggles (pulled from context, no props needed) */}
          <FeedPreferenceToggles />

          {/* Notes */}
          <button
            onClick={() => router.push("/notes")}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-all"
          >
            Notes
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
