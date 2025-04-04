import { FastifyInstance } from "fastify";

import authRoutes from "./auth/auth.js";
import userRoutes from "./user/user.js";
import eventRoutes from "./event/event.js";

async function routes(fastify: FastifyInstance, options: any) {
  fastify.register(authRoutes);
  fastify.register(userRoutes);
  fastify.register(eventRoutes);
}

export default routes;
