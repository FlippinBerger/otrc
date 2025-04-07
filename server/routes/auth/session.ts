import { FastifyInstance, Session } from "fastify";
import fp from "fastify-plugin";
import {
  fastifySession,
  SessionStore as FSessionStore,
} from "@fastify/session";
import { fastifyCookie } from "@fastify/cookie";

// Extend fastify.session with your custom type.
declare module "fastify" {
  interface Session {
    user_id?: number;
  }
}

// custom SessionStore to store session info in the db
class SessionStore implements FSessionStore {
  fastify: FastifyInstance;

  constructor(f: FastifyInstance) {
    this.fastify = f;
  }

  // TODO: implement the custom session store
  set(sessionId: string, session: Session, callback: (err?: any) => void) {}
  get(
    sessionId: string,
    callback: (err: any, result?: Session | null) => void,
  ) {}
  destroy(sessionId: string, callback: (err?: any) => void) {}
}

// transforms miliseconds to 100 days
const HUNDRED_DAYS = 1000 * 60 * 60 * 24 * 100;

async function sessionPlugin(fastify: FastifyInstance, options: any) {
  const secret = process.env.SESSION_SECRET!;

  fastify.register(fastifyCookie);
  fastify.register(fastifySession, {
    secret: secret,
    cookieName: "otrcSession",
    cookie: {
      httpOnly: false,
      maxAge: HUNDRED_DAYS,
      secure: "auto",
    },
    //store: new SessionStore(fastify),
  });
}

export default fp(sessionPlugin);
