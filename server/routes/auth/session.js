import fp from "fastify-plugin";
import { fastifySession, } from "@fastify/session";
import { fastifyCookie } from "@fastify/cookie";
// custom SessionStore to store session info in the db
class SessionStore {
    constructor(f) {
        this.fastify = f;
    }
    // TODO: implement the custom session store
    set(sessionId, session, callback) { }
    get(sessionId, callback) { }
    destroy(sessionId, callback) { }
}
// transforms miliseconds to 100 days
const HUNDRED_DAYS = 1000 * 60 * 60 * 24 * 100;
async function sessionPlugin(fastify, options) {
    fastify.register(fastifyCookie);
    fastify.register(fastifySession, {
        secret: "blah secret message times eighteenhundred and forty 3",
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
