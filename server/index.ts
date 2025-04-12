import Fastify from "fastify";
import cors from "@fastify/cors";
import { config } from "@dotenvx/dotenvx";

import routes from "./routes/routes.js";
import dbPlugin from "./db/index.js";

import jwtPlugin from "./routes/auth/jwt.js";
import fastifyCookie from "@fastify/cookie";

config();

declare module "fastify" {
  interface FastifyInstance {
    jwtAuth: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<undefined>;
  }
  interface FastifyRequest {
    user?: number;
  }
}

const fastify = Fastify({
  logger: true,
  trustProxy: true,
});

const isProd = process.env.NODE_ENV === "production";
const origin = isProd ? "https://web-83246393578.us-central1.run.app" : true;

await fastify.register(cors, {
  origin: origin,
  methods: ["GET", "PATCH", "POST", "PUT"],
  credentials: true,
});

fastify.register(fastifyCookie);

// setup up postgres connection
// add my custom plugins
fastify.register(jwtPlugin);
fastify.register(dbPlugin);
fastify.register(routes);

// run server
const start = async () => {
  const IS_CLOUD_RUN = process.env.K_SERVICE !== undefined;

  const port = process.env.PORT || 3000;
  const host = IS_CLOUD_RUN ? "0.0.0.0" : undefined;

  try {
    const address = await fastify.listen({ port: port as number, host });
    console.log(`Listening on ${address}`);
  } catch (err) {
    fastify.log.error(err);
    console.log("Unable to run fastify app:", err);
    process.exit(1);
  }
};

start();
