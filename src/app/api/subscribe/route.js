// /api/subscription/[channelId]/route.js
import pool from "@/Database/connection";
import admin from "@/helper/firebaseAdmin";

// ✅ Toggle subscription
export async function POST(req) {
  try {
    const { channel_id, channel_name, channel_image } = await req.json();
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return new Response(JSON.stringify({ error: "Login required" }), { status: 401 });
    }

    // Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(token);

    // ✅ Ensure user exists in DB
    const userRes = await pool.query("SELECT id FROM users WHERE firebase_uid=$1", [decoded.uid]);
    let user_id;
    if (userRes.rowCount === 0) {
      const insertUser = await pool.query(
        "INSERT INTO users (firebase_uid, email) VALUES ($1, $2) RETURNING id",
        [decoded.uid, decoded.email || ""]
      );
      user_id = insertUser.rows[0].id;
    } else {
      user_id = userRes.rows[0].id;
    }

    // ✅ Ensure channel exists in DB
    const channelRes = await pool.query("SELECT id FROM channels WHERE firebase_uid=$1", [channel_id]);
    let dbChannelId;
    if (channelRes.rowCount === 0) {
      const insertChannel = await pool.query(
        "INSERT INTO channels (firebase_uid, name, image_url) VALUES ($1, $2, $3) RETURNING id",
        [channel_id, channel_name, channel_image]
      );
      dbChannelId = insertChannel.rows[0].id;
    } else {
      dbChannelId = channelRes.rows[0].id;
    }

    // ✅ Toggle subscription
    const subRes = await pool.query(
      "SELECT * FROM subscriptions WHERE user_id=$1 AND channel_id=$2",
      [user_id, dbChannelId]
    );

    if (subRes.rowCount > 0) {
      // Unsubscribe
      await pool.query("DELETE FROM subscriptions WHERE user_id=$1 AND channel_id=$2", [user_id, dbChannelId]);
      return new Response(JSON.stringify({ status: "unsubscribed" }), { status: 200 });
    } else {
      // Subscribe
      await pool.query("INSERT INTO subscriptions (user_id, channel_id) VALUES ($1, $2)", [user_id, dbChannelId]);
      return new Response(JSON.stringify({ status: "subscribed" }), { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

// ✅ Check subscription status
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const channel_id = searchParams.get("channel_id");
    const token = req.headers.get("authorization")?.split(" ")[1];

    // If user is not logged in → show "subscribe"
    if (!token) {
      return new Response(JSON.stringify({ status: "subscribe" }), { status: 200 });
    }

    // Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(token);

    // ✅ Ensure user exists
    const userRes = await pool.query("SELECT id FROM users WHERE firebase_uid=$1", [decoded.uid]);
    if (userRes.rowCount === 0) {
      return new Response(JSON.stringify({ status: "subscribe" }), { status: 200 });
    }
    const user_id = userRes.rows[0].id;

    // ✅ Get channel
    const channelRes = await pool.query("SELECT id FROM channels WHERE firebase_uid=$1", [channel_id]);
    if (channelRes.rowCount === 0) {
      return new Response(JSON.stringify({ status: "subscribe" }), { status: 200 });
    }
    const dbChannelId = channelRes.rows[0].id;

    // ✅ Check subscription
    const subRes = await pool.query(
      "SELECT 1 FROM subscriptions WHERE user_id=$1 AND channel_id=$2",
      [user_id, dbChannelId]
    );

    if (subRes.rowCount > 0) {
      return new Response(JSON.stringify({ status: "subscribed" }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ status: "subscribe" }), { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
