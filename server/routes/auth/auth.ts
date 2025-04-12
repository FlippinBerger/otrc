import { FastifyInstance } from "fastify";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

import { IAuthBody, ISimpleReply, User } from "../../types.js";
import { createJWT } from "./jwt.js";

const cookieName = "refreshToken";
const IS_PROD = process.env.NODE_ENV === "production";
console.log("node env is", process.env.NODE_ENV);

async function authRoutes(fastify: FastifyInstance, opts: any) {
  fastify.post<{
    Body: IAuthBody;
  }>("/signup", opts, async (request, reply) => {
    const { username, email, password } = request.body;

    if (!username || !password || !email) {
      return reply.code(400).send({
        error: "Need to send username, pass, and email when registering",
      });
    }

    const hashRes = hashPass(password);
    const [salt, hashedPass] = hashRes.split(":");

    const client = await fastify.pg.connect();
    try {
      const { rows } = await client.query(
        "INSERT INTO users (username, password, salt, email, admin) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [username, hashedPass, salt, email, true],
      );
      const id = rows[0].id;
      const accessToken = createJWT({ user_id: id });

      // set the refreshToken to be used to replenish accessToken on expiration
      // or browser refresh
      const refreshToken = createJWT({ user_id: id }, "365 days");
      reply.setCookie(cookieName, refreshToken, {
        httpOnly: true,
        secure: "auto",
        partitioned: IS_PROD ? true : undefined,
        sameSite: IS_PROD ? "none" : "lax",
      });

      await client.query(
        "INSERT INTO user_tokens (user_id, token) VALUES ($1, $2)",
        [id, refreshToken],
      );

      return reply.code(200).send({ user_id: id, token: accessToken });
    } catch (e) {
      return reply.code(500).send({ error: e });
    } finally {
      client.release();
    }
  });

  fastify.post<{
    Body: IAuthBody;
  }>("/login", opts, async (request, reply) => {
    const { username, password } = request.body;

    const { flag, user } = await checkPassword(fastify, username, password);
    if (!flag) {
      return reply.code(401).send({ error: "incorrect username or password" });
    }

    const userId = user!.id;

    const accessToken = createJWT({ user_id: userId });

    // set the refreshToken to be used to replenish accessToken on expiration
    // or browser refresh
    const refreshToken = createJWT({ user_id: userId }, "365 days");
    reply.setCookie(cookieName, refreshToken, {
      httpOnly: true,
      secure: "auto",
      partitioned: IS_PROD ? true : undefined,
      sameSite: IS_PROD ? "none" : "lax",
    });
    const client = await fastify.pg.connect();
    try {
      await client.query(
        "INSERT INTO user_tokens (user_id, token) VALUES ($1, $2)",
        [userId, refreshToken],
      );

      return reply.code(200).send({ user_id: userId, token: accessToken });
    } catch (e) {
      console.log("unable to add row to user_tokens:", e);
      return reply.code(500).send({ error: e });
    } finally {
      client.release();
    }
  });

  fastify.post<{
    Body: IAuthBody;
  }>("/logout", opts, async (request, reply) => {
    try {
      const client = await fastify.pg.connect();
      const refreshToken = request.cookies[cookieName];
      if (!refreshToken) {
        console.log("no refresh token to clear");
        return reply.code(200).send();
      }
      await client.query("DELETE FROM user_tokens where token = $1", [
        refreshToken,
      ]);

      reply.clearCookie(cookieName, {
        secure: "auto",
        httpOnly: true,
        partitioned: IS_PROD ? true : undefined,
        sameSite: IS_PROD ? "none" : "lax",
      });
      return reply.code(200).send();
    } catch (e) {
      console.log("unable to log out");
      return reply.code(500).send(e);
    }
  });

  const hashPass = (pass: string): string => {
    const salt = randomBytes(16).toString("hex");
    const hashedPass = scryptSync(pass, salt, 64).toString("hex");

    return salt + ":" + hashedPass;
  };

  const verifyPass = (pass: string, hash: string, salt: string): boolean => {
    const hashBuf = Buffer.from(hash, "hex");
    const hashedPass = scryptSync(pass, salt, 64);

    return timingSafeEqual(hashBuf, hashedPass);
  };

  interface IPasswordCheck {
    user?: User;
    flag: boolean;
  }

  const checkPassword = async (
    fastify: FastifyInstance,
    username: string,
    password: string,
  ): Promise<IPasswordCheck> => {
    const client = await fastify.pg.connect();
    try {
      const res = await client.query(
        "SELECT * from users WHERE username = $1",
        [username],
      );
      if (res.rowCount !== null && res.rowCount < 1) {
        return { flag: false };
      }

      const user: User = res.rows[0];
      const flag = verifyPass(password, user.password, user.salt);

      if (flag) {
        return { flag: flag, user: user };
      } else {
        return { flag: false };
      }
    } catch (e) {
      console.log("failed checking password", e);
      return { flag: false };
    } finally {
      client.release();
    }
  };
}

export default authRoutes;
