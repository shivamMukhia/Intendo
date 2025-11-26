import pool from "@/Database/connection";
import admin from "@/helper/firebaseAdmin";

// GET - Fetch user's reaction and total likes
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const video_id = searchParams.get("video_id");
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!video_id) {
      return new Response(JSON.stringify({ message: "Video ID required" }), { status: 400 });
    }

    let userReaction = null;

    if (token) {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const firebase_uid = decodedToken.uid;

      const userRes = await pool.query(
        `SELECT id FROM users WHERE firebase_uid = $1`,
        [firebase_uid]
      );
      if (userRes.rows.length) {
        const reactionRes = await pool.query(
          `SELECT reaction_type FROM video_reactions WHERE user_id = $1 AND video_id = $2`,
          [userRes.rows[0].id, video_id]
        );
        if (reactionRes.rows.length) {
          userReaction = reactionRes.rows[0].reaction_type;
        }
      }
    }

    const likesRes = await pool.query(
      `SELECT COUNT(*) AS likes_count FROM video_reactions WHERE video_id = $1 AND reaction_type = 'like'`,
      [video_id]
    );

    return new Response(
      JSON.stringify({
        likes_count: parseInt(likesRes.rows[0].likes_count),
        user_reaction: userReaction
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}

// POST - Toggle reaction
export async function POST(req) {
  try {
    const body = await req.json();
    const { video_id, reaction_type } = body;
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) return new Response(JSON.stringify({ message: "No token provided" }), { status: 401 });
    if (!["like", "dislike"].includes(reaction_type))
      return new Response(JSON.stringify({ message: "Invalid reaction type" }), { status: 400 });

    const decodedToken = await admin.auth().verifyIdToken(token);
    const firebase_uid = decodedToken.uid;

    const userRes = await pool.query(  // find and create user 
      `INSERT INTO users (firebase_uid, email)
       VALUES ($1, $2)
       ON CONFLICT (firebase_uid) DO UPDATE SET email = EXCLUDED.email
       RETURNING id`,
      [firebase_uid, decodedToken.email]
    );
    const user_id = userRes.rows[0].id;

    // Check existing reaction
    const existingRes = await pool.query(
      `SELECT reaction_type FROM video_reactions WHERE user_id = $1 AND video_id = $2`,
      [user_id, video_id]
    );

    if (existingRes.rows.length === 0) {
      // No reaction yet → add
      await pool.query(
        `INSERT INTO video_reactions (user_id, video_id, reaction_type)
         VALUES ($1, $2, $3)`,
        [user_id, video_id, reaction_type]
      );
    } else {
      const existingType = existingRes.rows[0].reaction_type;
      if (existingType === reaction_type) {
        // Same reaction clicked again → remove
        await pool.query(
          `DELETE FROM video_reactions WHERE user_id = $1 AND video_id = $2`,
          [user_id, video_id]
        );
      } else {
        // Different reaction → update
        await pool.query(
          `UPDATE video_reactions SET reaction_type = $1 WHERE user_id = $2 AND video_id = $3`,
          [reaction_type, user_id, video_id]
        );
      }
    }

    return new Response(JSON.stringify({ message: "Reaction updated" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
