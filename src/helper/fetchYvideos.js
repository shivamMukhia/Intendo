

// earlier i was geeting so much error because youtube search api do not work with videoCategory ==27
// but now it work with query : education



import axios from "axios";
import { attachChannelImages } from "./attachChannelImage";
export async function fetchVideosFromYouTube(pageToken = "", eduOnly = false) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const maxResults = 12;

  try {
    let videos = [];
    let nextPageToken = null;

    if (eduOnly) {
      // 🔹 Search for "education" videos
      const searchRes = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            part: "snippet",
            type: "video",
            q: "education",
            regionCode: "IN",
            maxResults,
            key: apiKey,
            pageToken,
            order: "date",
          },
        }
      );

      nextPageToken = searchRes.data.nextPageToken || null;
      const videoIds = searchRes.data.items.map((v) => v.id.videoId).join(",");

      if (videoIds) {
        const detailsRes = await axios.get(
          "https://www.googleapis.com/youtube/v3/videos",
          {
            params: {
              part: "snippet,statistics",
              id: videoIds,
              key: apiKey,
            },
          }
        );
        videos = detailsRes.data.items;
      }
    } else {
      // 🔹 Most popular
      const videoRes = await axios.get(
        "https://www.googleapis.com/youtube/v3/videos",
        {
          params: {
            part: "snippet,statistics",
            chart: "mostPopular",
            regionCode: "IN",
            maxResults,
            key: apiKey,
            pageToken,
          },
        }
      );

      videos = videoRes.data.items;
      nextPageToken = videoRes.data.nextPageToken || null;
    }

    // ✅ Attach channel thumbnails via helper
    videos = await attachChannelImages(videos);

    return { videos, nextPageToken };
  } catch (err) {
    console.error("YouTube API error:", err.response?.data || err.message);
    throw err;
  }
}
