// app/api/notes/getUserNotes/route.js
import { NextResponse } from "next/server";
import pool from "@/Database/connection";
import { verifyUser } from "@/helper/verifyUser";

export async function GET(req) {
  try {
    const user = await verifyUser(req); // decode firebase token
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await pool.query(
      `SELECT 
          n.id,
          v.video_id,
          v.video_thumbnail,
          n.note_text,
          n.created_at
       FROM notes n
       JOIN videos v ON n.video_id = v.id
       WHERE n.user_id = $1
       ORDER BY v.id, n.created_at DESC`,
      [user.id]
    );

    return NextResponse.json(result.rows, { status: 200 });
  } catch (err) {
    console.error("Error fetching notes:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
