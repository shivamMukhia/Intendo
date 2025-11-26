import { fetchVideosFromYouTube } from "@/helper/fetchYvideos";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const pageToken = searchParams.get('pageToken') || '';

  try {
    const data = await fetchVideosFromYouTube(pageToken);

    return Response.json({
      videos: data.videos,
      nextPageToken: data.nextPageToken,
    });
  } catch (error) {
    console.error('Error fetching YouTube data:', error);
    return new Response('Failed to fetch videos', { status: 500 });
  }
}
