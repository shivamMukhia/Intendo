"use client";

import { Home, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { auth } from "@/helper/firebase";
import axios from "axios";
import { useSubscriptions } from "@/context/subscriptionContext";

export default function Sidebar({ isOpen }) {
  const pathname = usePathname();
  const { user, channels, loading, unsubscribeChannel } = useSubscriptions();

  const handleUnsubscribe = async (ch) => {
    if (!auth.currentUser) return;
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await axios.post(
        "/api/subscribe",
        {
          channel_id: ch.firebase_uid,
          channel_name: ch.name,
          channel_image: ch.image_url,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status === "unsubscribed") {
        unsubscribeChannel(ch.firebase_uid);
      }
    } catch (err) {
      console.error("Error unsubscribing:", err);
    }
  };

  return (
    <div
      className={`fixed top-14 left-0 h-[calc(100%-56px)] w-64 bg-white shadow-md z-40 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4 flex flex-col gap-6">
        {/* Home */}
        <Link
          href="/"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors
            ${
              pathname === "/"
                ? "bg-gray-200 font-semibold text-black"
                : "text-gray-700 hover:bg-gray-100"
            }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>

        {/* Subscriptions */}
        <div>
          <div className="text-sm font-semibold text-gray-500 mb-2">
            Subscriptions
          </div>

          {loading ? (
            <p className="text-gray-500 text-sm">Loading...</p>
          ) : !user ? (
            <p className="text-gray-500 text-sm">
              Login to see your subscriptions
            </p>
          ) : channels.length === 0 ? (
            <p className="text-gray-500 text-sm">No subscriptions yet</p>
          ) : (
            <div className="flex flex-col gap-4">
              {channels.map((ch) => (
                <div
                  key={ch.firebase_uid}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={ch.image_url || "/default-avatar.png"}
                      alt={ch.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="text-sm">{ch.name}</span>
                  </div>
                  <button
                    onClick={() => handleUnsubscribe(ch)}
                    className="text-xs text-gray-500 hover:text-red-700"
                    title="Unsubscribe"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}