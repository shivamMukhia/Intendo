// /app/api/subscriptions/get/route.js (App Router)
import pool from "@/Database/connection";
import admin from "@/helper/firebaseAdmin";

export async function GET(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return new Response(JSON.stringify({ error: "Login required" }), { status: 401 });
    }

    // Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(token);

    // Get user_id from DB
    const userRes = await pool.query(
      `SELECT id FROM users WHERE firebase_uid = $1`,
      [decoded.uid]
    );

    if (userRes.rows.length === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    const userId = userRes.rows[0].id;

    // Fetch subscribed channels
    const subsRes = await pool.query(
      `SELECT c.id,c.firebase_uid, c.name, c.image_url
       FROM subscriptions s
       JOIN channels c ON s.channel_id = c.id
       WHERE s.user_id = $1`,
      [userId]
    );

    return new Response(JSON.stringify(subsRes.rows), { status: 200 });
  } catch (err) {
    console.error("Error fetching subscriptions:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
