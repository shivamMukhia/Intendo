"use client";

import { useEffect, useState } from "react";
import { auth } from '@/helper/firebase';
import axios from "axios";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

export default function LikeDislike({ videoId }) {
  const [likesCount, setLikesCount] = useState(0);
  const [userReaction, setUserReaction] = useState(null);
  const [loading, setLoading] = useState(false);

  // const auth = getAuth();

  // Fetch like count + user reaction
  useEffect(() => {
    async function fetchReactions() {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await axios.get(`/api/likeDislike`, {
          params: { video_id: videoId },
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setLikesCount(res.data.likes_count);
        setUserReaction(res.data.user_reaction);
      } catch (err) {
        console.error("Error fetching reactions:", err);
      }
    }
    fetchReactions();
  }, [videoId, auth]);

  // Handle like or dislike
  async function handleReaction(type) {
    if (!auth.currentUser) {
      alert("Please login to react");
      return;
    }
    setLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();

      await axios.post(
        `/api/likeDislike`,
        {
          video_id: videoId,
          reaction_type: type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Optimistic UI update
      if (type === "like") {
        if (userReaction === "like") {
          setLikesCount((prev) => prev - 1);
          setUserReaction(null);
        } else {
          setLikesCount((prev) => prev + (userReaction === "dislike" ? 1 : 1));
          setUserReaction("like");
        }
      } else if (type === "dislike") {
        if (userReaction === "dislike") {
          setUserReaction(null);
        } else {
          if (userReaction === "like") {
            setLikesCount((prev) => prev - 1);
          }
          setUserReaction("dislike");
        }
      }
    } catch (err) {
      console.error("Error updating reaction:", err);
    }
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-4 mt-3">
      {/* Like button */}
      <button
        disabled={loading}
        onClick={() => handleReaction("like")}
        className={`flex items-center -mt-3 gap-2 px-3 py-1 rounded-full border transition ${
          userReaction === "like"
            ? "bg-blue-500 text-white"
            : "bg-gray-100 hover:bg-gray-200"
        }`}
      >
        <FaThumbsUp />
        <span>{likesCount}</span>
      </button>

      {/* Dislike button */}
      <button
        disabled={loading}
        onClick={() => handleReaction("dislike")}
        className={`flex -mt-3 items-center gap-2 px-3  py-1 rounded-full border transition ${
          userReaction === "dislike"
            ? "bg-red-500 text-white"
            : "bg-gray-100 hover:bg-gray-200"
        }`}
      >
        <FaThumbsDown />
      </button>
    </div>
  );
}
