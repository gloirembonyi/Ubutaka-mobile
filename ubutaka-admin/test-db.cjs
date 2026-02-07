const { Client } = require('pg');
const url = "postgresql://neondb_owner:npg_mxModG72jPUC@ep-steep-pine-ah5w4ufc-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function test() {
  const client = new Client({ 
    connectionString: url,
    connectionTimeoutMillis: 5000,
  });
  try {
    console.log("Attempting to connect to:", url.split('@')[1]);
    await client.connect();
    console.log("Connected successfully!");
    const res = await client.query('SELECT NOW()');
    console.log("Query result:", res.rows[0]);
    await client.end();
  } catch (err) {
    console.error("Connection failed:", err.stack);
  }
}

test();
