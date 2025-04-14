import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import fp from "fastify-plugin";
import jwt from "fast-jwt";

async function jwtPlugin(fastify: FastifyInstance, opts: any) {
  fastify.decorateRequest("user", undefined);

  fastify.decorate(
    "jwtAuth",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const authHeader = request.headers.authorization;
      const now = Date.now() / 1000;

      let refresh = false;

      if (authHeader) {
        const token = authHeader.split("Bearer: ")[1];

        if (!!token) {
          const payload = parseJWT(token);
          if (payload.exp < now || !payload) {
            refresh = true;
          } else {
            request.user = payload.user_id;
          }
        } else {
          refresh = true;
        }
      } else {
        refresh = true;
      }

      if (!authHeader || refresh) {
        const refreshToken = request.cookies["refreshToken"];
        if (!refreshToken) {
          return reply.status(401).send();
        }

        const payload = parseJWT(refreshToken);
        if (payload.exp < now) {
          return reply.status(401).send();
        }

        if (!payload.user_id) {
          return reply.status(401).send();
        }

        request.user = payload.user_id;
      }
    },
  );
}

export default fp(jwtPlugin);

export function createJWT(payload: object, expires?: string): string {
  const signSync = jwt.createSigner({
    key: process.env.JWT_SIGN_KEY || "hello secret",
    expiresIn: expires || "30 days",
  });

  // change payload here if we want to set expiration times
  const token = signSync(payload);

  return token;
}

export function parseJWT(token: string) {
  const decode = jwt.createDecoder();
  return decode(token);
}
