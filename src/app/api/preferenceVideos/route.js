
import { fetchVideosFromYouTube } from "@/helper/fetchYvideos";
import pool from "@/Database/connection";
import axios from "axios";
import { verifyUser } from "@/helper/verifyUser";
import { attachChannelImages } from "@/helper/attachChannelImage";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const pageToken = searchParams.get("pageToken") || "";
  console.log("the pageToken", pageToken);

  const user = await verifyUser(req);
  if (!user) return new Response("Unauthorized", { status: 401 });

  // 1. Fetch user preferences
  const prefRes = await pool.query(
    "SELECT edu_only, subs_only FROM user_preferences WHERE user_id=$1",
    [user.id]
  );
  const { edu_only, subs_only } = prefRes.rows[0] || {};
  console.log("edu_only, subs_only", edu_only, subs_only);

  // 2. Fetch subscribed channels if needed
  let subs = [];
  if (subs_only) {
    const subsRes = await pool.query(
      `SELECT c.firebase_uid
       FROM subscriptions s
       JOIN channels c ON s.channel_id = c.id
       WHERE s.user_id = $1`,
      [user.id]
    );
    subs = subsRes.rows.map((r) => r.firebase_uid);
    console.log("User subscribed channels:", subs);
  }

  try {
    let videos = [];
    let nextPageToken = null;

    if (subs_only) {
      // ✅ Optimized: use uploads playlist instead of search
      // (pagination supported per channel)
      for (const chId of subs) {
        // Step 1: Get uploads playlist ID
        const channelRes = await axios.get(
          "https://www.googleapis.com/youtube/v3/channels",
          {
            params: {
              part: "contentDetails",
              id: chId,
              key: process.env.YOUTUBE_API_KEY,
            },
          }
        );

        const uploadsPlaylistId =
          channelRes.data.items[0]?.contentDetails?.relatedPlaylists?.uploads;

        if (!uploadsPlaylistId) continue;

        // Step 2: Fetch videos from uploads playlist
        const playlistRes = await axios.get(
          "https://www.googleapis.com/youtube/v3/playlistItems",
          {
            params: {
              part: "snippet,contentDetails",
              playlistId: uploadsPlaylistId,
              maxResults: 5, // adjust as needed
              key: process.env.YOUTUBE_API_KEY,
              pageToken, // ✅ pagination
            },
          }
        );

        nextPageToken = playlistRes.data.nextPageToken || null;

        const videoIds = playlistRes.data.items
          .map((v) => v.contentDetails.videoId)
          .join(",");

        if (videoIds) {
          // Step 3: Get video statistics
          const detailsRes = await axios.get(
            "https://www.googleapis.com/youtube/v3/videos",
            {
              params: {
                part:"snippet,contentDetails,statistics", // include contentDetails ✅
                id: videoIds,
                key: process.env.YOUTUBE_API_KEY,
              },
            }
          );
          videos.push(...detailsRes.data.items);
          videos= await attachChannelImages(videos)
        }
      }

      // Filter education if both toggles are ON
      if (edu_only) {
        videos = videos.filter((v) => v.snippet.categoryId === "27");
      }
    } else if (edu_only) {
      // Hybrid approach for education-only
      const { videos: fetchedVideos, nextPageToken: token } =
        await fetchVideosFromYouTube(pageToken, true);
      videos = fetchedVideos;
      nextPageToken = token;
    } else {
      // Default: most popular
      const { videos: fetchedVideos, nextPageToken: token } =
        await fetchVideosFromYouTube(pageToken);
      videos = fetchedVideos;
      nextPageToken = token;
    }

    return Response.json({ videos, nextPageToken });
  } catch (error) {
    console.error(
      "Error fetching videos:",
      error.response?.data || error.stack || error
    );
    return new Response("Failed to fetch videos", { status: 500 });
  }
}
