// app/api/notes/getNotes/[videoId]/route.js
import { NextResponse } from "next/server";
import pool from "@/Database/connection";
import { verifyUser } from "@/helper/verifyUser";

export async function GET(req, { params }) {
  try {
    const { videoId } = params;
    const user = await verifyUser(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // join notes with videos to get all details
    const result = await pool.query(
      `SELECT notes.id, notes.note_text, notes.created_at,
              videos.video_id, videos.video_thumbnail
       FROM notes
       JOIN videos ON notes.video_id = videos.id
       WHERE notes.user_id = $1 AND videos.video_id = $2
       ORDER BY notes.created_at DESC`,
      [user.id, videoId]
    );

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
