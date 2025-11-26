// /api/tracker/stats/route.js
import { verifyUser } from "@/helper/verifyUser";
import pool from "@/Database/connection";

export async function GET(req) {
  const user = await verifyUser(req);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const result = await pool.query(
    `SELECT category, SUM(watch_time_seconds)::int as total_time
     FROM watch_tracker
     WHERE user_id = $1
     GROUP BY category`,
    [user.id]
  );

  const total = result.rows.reduce((acc, row) => acc + row.total_time, 0);

  const formatted = result.rows.map((row) => ({
    category: row.category,
    percentage: total > 0 ? Math.round((row.total_time / total) * 100) : 0,
  }));

  return Response.json(formatted);
}
