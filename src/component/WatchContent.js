"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import VideoPlayer from "@/component/videoPlayer";
import RelatedVideos from "@/component/RelatedVideos";
import TakeNotesSection from "@/component/TakeNotesSection";
import SubscribeButton from "@/component/subscribe";
import LikeDislike from "@/component/likeDislike";
import Navbar from "@/component/navbar";
import { useSubscriptions } from "@/context/subscriptionContext";

export default function WatchContent() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("v");

  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const { user } = useSubscriptions();

  useEffect(() => {
    if (!videoId) return;

    const fetchData = async () => {
      try {
        const videoRes = await axios.get(`/api/singleVideo?videoId=${videoId}`);
        setVideo(videoRes.data);

        const relatedRes = await axios.get(`/api/videos`);
        setRelatedVideos(relatedRes.data.videos);
      } catch (err) {
        console.error("Error fetching video data", err);
      }
    };

    fetchData();
  }, [videoId]);

  if (!video) return <p className="p-4">Loading...</p>;

  const category =
    video.snippet.categoryId === "27" ? "education" : "entertainment";

  return (
    <>
      <Navbar />
      <div className="flex flex-col lg:flex-row p-4 gap-6">
        <div className="flex-1">
          <VideoPlayer
            videoId={videoId}
            title={video.snippet.title}
            category={category}
          />

          <h1 className="text-xl font-semibold mb-2">{video.snippet.title}</h1>

          {/* CHANNEL + LIKE BUTTONS */}
          <div className="flex items-start justify-between flex-wrap">
            <div className="flex items-center gap-3">
              <img
                src={video.snippet.channelThumbnailUrl || "/default-avatar.png"}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium">{video.snippet.channelTitle}</p>
                <p className="text-gray-500 text-sm">
                  {parseInt(video.statistics.viewCount).toLocaleString()} views
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-2 lg:mt-0 -translate-x-4">
              <SubscribeButton
                channelId={video.snippet.channelId}
                channelName={video.snippet.channelTitle}
                channelImage={
                  video.snippet.channelThumbnailUrl || "/default-avatar.png"
                }
              />
              <LikeDislike videoId={videoId} />
            </div>
          </div>

          {/* Comments Placeholder */}
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-2">Comments</h2>
            <div className="text-gray-500">Comments coming soon...</div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[360px]">
          {user ? (
            <TakeNotesSection
              videoId={videoId}
              videoThumbnail={
                video.snippet?.thumbnails?.high?.url ||
                video.snippet?.thumbnails?.medium?.url
              }
            />
          ) : (
            <RelatedVideos videos={relatedVideos} />
          )}
        </div>
      </div>
    </>
  );
}
