// helper/verifyUser.js
import admin from "@/helper/firebaseAdmin";
import pool from "@/Database/connection";

export async function verifyUser(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  const decodedToken = await admin.auth().verifyIdToken(token);

  const { rows } = await pool.query(
    `SELECT id FROM users WHERE firebase_uid = $1`,
    [decodedToken.uid]
  );

  if (rows.length === 0) return null;
  return { id: rows[0].id, firebaseUid: decodedToken.uid };
}
