'use client';

import { useRef, useEffect } from "react";
import YouTube from "react-youtube";
import axios from "axios";
import { auth } from "@/helper/firebase";

export default function VideoPlayer({ videoId, title, category }) {
  const watchTime = useRef(0);             // total time accumulated before each submit
  const lastPlayTime = useRef(null);       // timestamp when video started playing
  const timeoutRef = useRef(null);         // ref for 30s timer
  const sentInitial30s = useRef(false);    // flag → did we already send the first 30s?

  // 🔹 function to submit accumulated watch time
  const submitWatchTime = async () => {
    if (lastPlayTime.current) {
      // add time since last play
      const diff = (Date.now() - lastPlayTime.current) / 1000;
      watchTime.current += diff;
      lastPlayTime.current = Date.now();
    }

    if (watchTime.current <= 0) return; // nothing to send

    try {
      const token = await auth.currentUser.getIdToken();
      await axios.post(
        "/api/tracker",
        {
          videoId,
          category,
          watchTime: Math.round(watchTime.current),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Watch time submitted:", watchTime.current);
      watchTime.current = 0; // reset after successful submit
    } catch (err) {
      console.error("❌ Failed to log watch time:", err.response?.data || err);
    }
  };

  // 🔹 handles YouTube player state changes
  const onStateChange = async (event) => {
    // ▶️ video starts playing
    if (event.data === window.YT.PlayerState.PLAYING) {
      lastPlayTime.current = Date.now();

      // Start a one-time 30s timer (only once per video session)
      if (!sentInitial30s.current) {
        timeoutRef.current = setTimeout(async () => {
          await submitWatchTime();
          sentInitial30s.current = true;  // mark as sent
          timeoutRef.current = null;
        }, 30000);
      }
    } 

    // ⏸️ video paused
    else if (event.data === window.YT.PlayerState.PAUSED && lastPlayTime.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;

      const diff = (Date.now() - lastPlayTime.current) / 1000;
      watchTime.current += diff;
      lastPlayTime.current = null;

      // ✅ Only submit if 30s milestone already passed
      if (sentInitial30s.current) {
        await submitWatchTime();
      } else {
        watchTime.current = 0; // discard if < 30s
      }
    } 

    // ⏹️ video ended
    else if (event.data === window.YT.PlayerState.ENDED && lastPlayTime.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;

      const diff = (Date.now() - lastPlayTime.current) / 1000;
      watchTime.current += diff;
      lastPlayTime.current = null;

      // ✅ Only submit if 30s milestone already passed
      if (sentInitial30s.current) {
        await submitWatchTime();
      } else {
        watchTime.current = 0; // discard if < 30s
      }
    }
  };

  // 🔹 cleanup when component unmounts
  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);

      // ✅ flush watch time only if 30s milestone reached
      if (sentInitial30s.current) {
        submitWatchTime();
      }
    };
  }, []);

  return (
    <div className="aspect-video mb-4">
      <YouTube
        videoId={videoId}
        opts={{
          width: "100%",
          height: "100%",
          playerVars: {
            controls: 1,
            modestbranding: 1,
            rel: 0,
            iv_load_policy: 3,
            showinfo: 0,
          },
        }}
        onStateChange={onStateChange}
        className="w-full h-full rounded-xl overflow-hidden"
        title={title}
      />
    </div>
  );
}
