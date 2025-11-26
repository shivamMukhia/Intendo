import { verifyUser } from "@/helper/verifyUser";
import pool from "@/Database/connection";

export async function GET(req) {
  const user = await verifyUser(req);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const result = await pool.query(
    "SELECT hide_feed, edu_only, subs_only FROM user_preferences WHERE user_id = $1",
    [user.id]
  );

  if (result.rows.length === 0) {
    return Response.json({ hide_feed: false, edu_only: false, subs_only: false });
  }

  return Response.json(result.rows[0]);
}

export async function POST(req) {
  const user = await verifyUser(req);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { hide_feed, edu_only, subs_only } = await req.json();

  await pool.query(
    `INSERT INTO user_preferences (user_id, hide_feed, edu_only, subs_only)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id)
     DO UPDATE SET hide_feed = EXCLUDED.hide_feed,
                   edu_only = EXCLUDED.edu_only,
                   subs_only = EXCLUDED.subs_only,
                   updated_at = CURRENT_TIMESTAMP`,
    [user.id, hide_feed, edu_only, subs_only]
  );

  return Response.json({ success: true });
}
