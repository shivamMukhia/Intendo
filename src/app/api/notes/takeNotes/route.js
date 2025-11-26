/** @format */

// app/api/notes/takeNotes/route.js
import { NextResponse } from "next/server";
import pool from "@/Database/connection"; // your Postgres connection pool
import { verifyUser } from "@/helper/verifyUser"; // helper to decode Firebase token

export async function POST(req) {
	try {
		const { videoId, videoThumbnail, noteText } = await req.json();
		const user = await verifyUser(req);

		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// ensure video exists
		let video = await pool.query("SELECT id FROM videos WHERE video_id = $1", [
			videoId,
		]);

		if (video.rows.length === 0) {
			video = await pool.query(
				`INSERT INTO videos (video_id, video_thumbnail)
     VALUES ($1, $2) RETURNING id`,
				[videoId, videoThumbnail]
			);
		}

		const videoDbId = video.rows[0].id;

		const insert = await pool.query(
			`INSERT INTO notes (user_id, video_id, note_text)
   VALUES ($1, $2, $3) RETURNING *`,
			[user.id, videoDbId, noteText]
		);

		return NextResponse.json(insert.rows[0]);
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
