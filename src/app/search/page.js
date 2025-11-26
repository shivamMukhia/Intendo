
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import SearchResultCard from "@/component/searchResultCard";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if (!query) return;

    const fetchVideos = async () => {
      try {
        const res = await axios.get(`/api/search?q=${query}`);
        setVideos(res.data);
      } catch (err) {
        console.error("Search fetch error", err);
      }
    };

    fetchVideos();
  }, [query]);

  return (
    <div className="p-4 flex flex-col gap-4">
      {videos.map((video) => (
        <SearchResultCard key={video.id.videoId} video={video} />
      ))}
    </div>
  );
}
