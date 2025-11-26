
import axios from 'axios';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return Response.json({ error: "Missing query" }, { status: 400 });
  }

  try {
    const { data } = await axios.get(
      `https://www.googleapis.com/youtube/v3/search`,
      {
        params: {
          part: "snippet",
          q: query,
          type: "video",
          maxResults: 20,
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    return Response.json(data.items);
  } catch (error) {
    console.error(error.message);
    return Response.json({ error: "Failed to fetch search results" }, { status: 500 });
  }
}
