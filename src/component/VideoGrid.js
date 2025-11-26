
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import VideoCard from '@/component/videoCard';
import { useSubscriptions } from '@/context/subscriptionContext'; // ✅ import your context

export default function VideoGrid() {
  const [videos, setVideos] = useState([]);
  const [nextPageToken, setNextPageToken] = useState('');
  const [loading, setLoading] = useState(false);
  const observerRef = useRef();

  // 🔹 Get logged-in user from context
  const { user } = useSubscriptions();

  // Fetch Videos
  const loadVideos = useCallback(async () => {
    if (loading || !user) return; // only run if logged in
    setLoading(true);

    try {
      // ✅ Get Firebase ID Token from context user
      const token = await user.getIdToken();

      const res = await axios.get(`/api/preferenceVideos?pageToken=${nextPageToken}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  console.log(res);
      setVideos((prev) => [...prev, ...res.data.videos]);
      setNextPageToken(res.data.nextPageToken);
    } catch (err) {
      console.error('Failed to load videos:', err);
    }

    setLoading(false);
  }, [nextPageToken, loading, user]);

  // Initial Fetch when user is ready
  useEffect(() => {
    if (user) {
      loadVideos();
    }
  }, [user]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextPageToken) {
          loadVideos();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [loadVideos, nextPageToken]);

  return (
    <main className="p-4 bg-gray-100 min-h-screen">
      
      {user &&  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video, index) => (
            <VideoCard
              key={`${video.id}-${index}`}
              videoId={video.id}
              thumbnail={video.snippet.thumbnails.medium.url}
              title={video.snippet.title}
              channelImage={video.snippet.channelImage}
              channelName={video.snippet.channelTitle}
              views={`${parseInt(video.statistics.viewCount).toLocaleString()} views`}
              timestamp={new Date(video.snippet.publishedAt).toDateString()}
            />
          ))}
        </div>
      }

      {/* Loading Indicator */}
      {loading && <p className="text-center mt-4">Loading...</p>}

      {/* Observer Target */}
      <div ref={observerRef} className="h-10" />
    </main>
  );
}
