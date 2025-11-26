

import axios from "axios";

export async function fetchVideoById(videoId) {
  const apiKey = process.env.YOUTUBE_API_KEY;

  // 1. Fetch video details
  const videoUrl = "https://www.googleapis.com/youtube/v3/videos";
  const videoParams = {
    part: "snippet,statistics",
    id: videoId,
    key: apiKey,
  };

  const videoRes = await axios.get(videoUrl, { params: videoParams });
  const video = videoRes.data.items[0];

  if (!video) return null;

  // 2. Fetch channel details for thumbnail
  const channelUrl = "https://www.googleapis.com/youtube/v3/channels";
  const channelParams = {
    part: "snippet",
    id: video.snippet.channelId,
    key: apiKey,
  };

  const channelRes = await axios.get(channelUrl, { params: channelParams });
  const channel = channelRes.data.items[0];

  // 3. Attach channel thumbnail to video object
  return {
    ...video,
    snippet: {
      ...video.snippet,
      channelThumbnailUrl: channel?.snippet?.thumbnails?.default?.url || null,
    },
  };
}
