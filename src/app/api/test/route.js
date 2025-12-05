import pool from "@/Database/connection";

export async function GET() {
  try {
    const result = await pool.query("SELECT NOW()");
    return Response.json({ connected: true, time: result.rows[0] });
  } catch (err) {
    return Response.json({ connected: false, error: err.message });
  }
}
