import pool from "@/Database/connection";
import admin from "@/helper/firebaseAdmin";

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);

    const uid = decoded.uid;
    const email = decoded.email || "";
    // const name = decoded.name || "";

    // Insert user if not exists
    await pool.query(
      `INSERT INTO users (firebase_uid, email)
       VALUES ($1, $2)
       ON CONFLICT (firebase_uid) DO NOTHING`,
      [uid, email]
    );

    return new Response(JSON.stringify({ status: "ok" }), { status: 200 });

  } catch (error) {
    console.error("User registration error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
