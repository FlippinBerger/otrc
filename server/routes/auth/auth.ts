import { FastifyInstance } from "fastify";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

import { IAuthBody, ISimpleReply, User } from "../../types.js";

async function authRoutes(fastify: FastifyInstance, opts: any) {
  fastify.post<{
    Body: IAuthBody;
    Reply: ISimpleReply;
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
      if (request.session === undefined) {
        console.log("request.session is undefined in signup");
      }
      if (request.session.user_id === undefined) {
        console.log("user id is undegined in signup");
      }
      request.session.user_id = id;
      return reply.code(200).send({ user_id: id });
    } catch (e) {
      return reply.code(500).send({ error: e });
    } finally {
      client.release();
    }
  });

  fastify.post<{
    Body: IAuthBody;
    Reply: ISimpleReply;
  }>("/login", opts, async (request, reply) => {
    const { username, password } = request.body;

    console.log(`username: ${username}, password: ${password}`);

    const { flag, user } = await checkPassword(fastify, username, password);
    if (!flag) {
      return reply.code(401).send({ error: "incorrect username or password" });
    }

    const userId = user!.id;
    if (request.session === undefined) {
      console.log("request.session is undefined in login");
    }
    if (request.session.user_id === undefined) {
      console.log("user id is undegined in login");
    }

    console.log("id was set to ", userId);
    request.session.user_id = userId;
    return reply.code(200).send({ user_id: userId });
  });

  fastify.post<{
    Body: IAuthBody;
  }>("/logout", opts, async (request, reply) => {
    try {
      console.log("user id is ", request.session.user_id);
      await request.session.destroy();
      reply.clearCookie("otrcSession", {
        sameSite: "none",
        secure: "auto",
        httpOnly: false,
        partitioned: true,
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
