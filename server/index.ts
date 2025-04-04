import Fastify from "fastify";
import fastifyPostgres from "@fastify/postgres";
import cors from "@fastify/cors";

import routes from "./routes/routes.js";
import sessionPlugin from "./routes/auth/session.js";
import dbPlugin from "./db/index.js";

const fastify = Fastify({
  logger: true,
});

await fastify.register(cors, {
  origin: true,
  credentials: true,
});

// setup up postgres connection
fastify.register(fastifyPostgres, {
  connectionString: "postgres://chris@localhost/otrc",
});
// add my custom plugins
fastify.register(dbPlugin);
fastify.register(sessionPlugin);
fastify.register(routes);
// run server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
