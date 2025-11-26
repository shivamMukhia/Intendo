  import { fetchVideoById } from '@/helper/fetchVideoById';

  export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return new Response('Missing videoId', { status: 400 });
    }

    try {
      const video = await fetchVideoById(videoId);
      return Response.json(video);
    } catch (err) {
      console.error(err);
      return new Response('Failed to fetch video', { status: 500 });
    }
  }
