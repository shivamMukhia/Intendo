import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "streamTube",
  password: "shivam",
  port: 5432,
});

export default pool;
