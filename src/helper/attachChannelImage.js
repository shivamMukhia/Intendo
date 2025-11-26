import axios from "axios";

export async function attachChannelImages(videos) {
  const apiKey=process.env.YOUTUBE_API_KEY;
  if (!videos || videos.length === 0) return videos;

  const channelIds = [...new Set(videos.map((v) => v.snippet.channelId))];
  if (channelIds.length === 0) return videos;

  const channelRes = await axios.get(
    "https://www.googleapis.com/youtube/v3/channels",
    {
      params: {
        part: "snippet",
        id: channelIds.join(","),
        key: apiKey,
      },
    }
  );

  const channelMap = {};
  channelRes.data.items.forEach((ch) => {
    channelMap[ch.id] = ch.snippet.thumbnails.default.url;
  });

  return videos.map((v) => ({
    ...v,
    snippet: {
      ...v.snippet,
      channelImage: channelMap[v.snippet.channelId] || null,
    },
  }));
}
