import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import fastifyPostgres from "@fastify/postgres";
import fs from "fs";

async function dbPlugin(fastify: FastifyInstance, options: any) {
  const connString = process.env.DB_URL || "postgres://chris@localhost/otrc";

  console.log("connString is", connString);
  await fastify.register(fastifyPostgres, {
    connectionString: connString,
  });

  // setup db
  const sql = fs.readFileSync("./db/init.sql").toString();

  const client = await fastify.pg.connect();
  try {
    await client.query(sql);
  } catch (e) {
    console.log("unable to get sql up and running", e);
  } finally {
    // Release the client immediately after query resolves, or upon error
    client.release();
  }
}

export default fp(dbPlugin);
