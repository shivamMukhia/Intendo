
import { verifyUser } from "@/helper/verifyUser";
import pool from "@/Database/connection";

export async function POST(req) {
  try {
    const user = await verifyUser(req);
    if (!user) return new Response("Unauthorized", { status: 401 });

    const { videoId, category, watchTime } = await req.json();
    console.log("📩 Incoming data:", { videoId, category, watchTime });

    if (!videoId || !category || watchTime == null) {
      return new Response("Missing data", { status: 400 });
    }

    // ✅ Insert or update total watch time
    const result = await pool.query(
      `INSERT INTO watch_tracker (user_id, video_id, category, watch_time_seconds)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, video_id)
       DO UPDATE SET 
         watch_time_seconds = watch_tracker.watch_time_seconds + EXCLUDED.watch_time_seconds,
         category = EXCLUDED.category
       RETURNING *;`,
      [user.id, videoId, category, watchTime]
    );

    console.log("✅ Updated tracker row:", result.rows[0]);

    return new Response("Watch time logged", { status: 200 });
  } catch (err) {
    console.error("❌ Server error:", err);
    return new Response("Failed", { status: 500 });
  }
}
