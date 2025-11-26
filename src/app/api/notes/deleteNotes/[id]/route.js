// app/api/notes/[id]/route.js
import { NextResponse } from "next/server";
import pool from "@/Database/connection";
import { verifyUser } from "@/helper/verifyUser";

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const user = await verifyUser(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    const userId = user.id

    // ensure user can only delete their own notes
    await pool.query(
      "DELETE FROM notes WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
