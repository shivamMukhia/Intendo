"use client";

import { useEffect, useState } from "react";
import { auth } from "@/helper/firebase";
import axios from "axios";
import { useSubscriptions } from "@/context/subscriptionContext";

export default function SubscribeButton({ channelId, channelName, channelImage }) {
  const [loading, setLoading] = useState(true);
  const { channels, subscribeChannel, unsubscribeChannel } = useSubscriptions();

  // 🔹 subscription status comes from context
  const subscribed = channels.some((c) => c.firebase_uid === channelId);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setLoading(false);
          return;
        }
        const token = await user.getIdToken();
        const res = await axios.get(`/api/subscribe?channel_id=${channelId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.status === "subscribed") {
          subscribeChannel({
            firebase_uid: channelId,
            name: channelName,
            image_url: channelImage,
          });
        } else {
          unsubscribeChannel(channelId);
        }
      } catch (err) {
        console.error("Error checking subscription:", err);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [channelId, channelName, channelImage, subscribeChannel, unsubscribeChannel]);

  const toggleSubscribe = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Please log in to subscribe.");
        return;
      }
      const token = await user.getIdToken();
      const res = await axios.post(
        "/api/subscribe",
        { channel_id: channelId, channel_name: channelName, channel_image: channelImage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status === "subscribed") {
        subscribeChannel({
          firebase_uid: channelId,
          name: channelName,
          image_url: channelImage,
        });
      } else {
        unsubscribeChannel(channelId);
      }
    } catch (err) {
      console.error("Error toggling subscription:", err);
    }
  };

  if (loading) {
    return (
      <button
        className="px-4 py-2 rounded-2xl bg-gray-200 text-gray-600 text-sm font-medium"
        disabled
      >
        ...
      </button>
    );
  }

  return (
    <button
      onClick={toggleSubscribe}
      className={`px-4 py-2 rounded-2xl font-semibold transition ${
        subscribed
          ? "bg-gray-200 text-black hover:bg-gray-300"
          : "bg-red-600 text-white hover:bg-red-700"
      }`}
    >
      {subscribed ? "Subscribed" : "Subscribe"}
    </button>
  );
}
