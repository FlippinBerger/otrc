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

      console.log("we'rein the plugin");
      console.log("auth header", authHeader);

      if (authHeader) {
        const payload = parseJWT(authHeader.split("Bearer: ")[1]);
        console.log(`payload in the plugin is ${payload}`);
        if (payload.exp < now || !payload) {
          refresh = true;
        } else {
          console.log(`adding ${payload.user_id} to the request`);
          request.user = payload.user_id;
        }
      }

      if (!authHeader || refresh) {
        console.log("in refresh");
        const refreshToken = request.cookies["refreshToken"];
        console.log("refreshToken", refreshToken);
        if (!refreshToken) {
          console.log("no refresh token");
          return reply.status(401).send();
        }

        const payload = parseJWT(refreshToken);
        console.log("refresh payload", payload);
        if (payload.exp < now) {
          console.log("refresh expired");
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
  console.log("decoding the jwt");
  return decode(token);
}
