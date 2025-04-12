import { IDParam, IUserReply, IUsersReply } from "../../types.js";
import { FastifyInstance } from "fastify";

async function userRoutes(fastify: FastifyInstance, opts: any) {
  fastify.get<{
    Params: IDParam;
    Reply: IUserReply;
  }>("/users/:id", opts, async (request, reply) => {
    const { id } = request.params;
    const client = await fastify.pg.connect();

    try {
      const res = await client.query("SELECT * FROM users WHERE id = $1", [id]);

      if (res.rowCount == null || res.rowCount < 1) {
        return reply.code(404).send({ error: "not found" });
      }

      return res.rows[0];
    } catch (e) {
      return reply.code(500).send({ error: e });
    } finally {
      client.release();
    }
  });

  fastify.get<{
    Params: IDParam;
    Reply: IUsersReply;
  }>("/users", opts, async (request, reply) => {
    const client = await fastify.pg.connect();

    try {
      const res = await client.query("SELECT * FROM users");

      if (res.rowCount == null || res.rowCount < 1) {
        return reply.code(404).send({ error: "not found" });
      }

      return reply.code(200).send(res.rows);
    } catch (e) {
      return reply.code(500).send({ error: e });
    } finally {
      client.release();
    }
  });

  //TODO: Update for profile picture
  interface IUserUpdate {
    username?: string;
    bio?: string;
  }

  fastify.patch<{
    Params: IDParam;
    Body: IUserUpdate;
  }>("/users/:id", { onRequest: [fastify.jwtAuth] }, async (request, reply) => {
    const { id } = request.params;
    const userId = request.user;
    const { username, bio } = request.body;

    if (!userId || userId !== id) {
      return reply.code(401).send({ error: "you can't edit a different user" });
    }

    if (!username && !bio) {
      return reply
        .code(403)
        .send({ error: "need to send either username or bio to change" });
    }

    let query = "UPDATE users SET ";
    let count = 0;
    let values = [];
    if (username) {
      query += `username = $${count + 1},`;
      count++;
      values.push(username);
    }

    if (bio) {
      if (count > 0) {
        query += " ";
      }
      query += `bio = $${count + 1},`;
      values.push(bio);
      count++;
    }

    query += ` WHERE id = $${count + 1}`;
    values.push(id);

    const client = await fastify.pg.connect();
    try {
      const res = await client.query(query, values);

      if (res.rowCount == null || res.rowCount < 1) {
        return reply.code(404).send({ error: "not found" });
      }

      return reply.code(200).send();
    } catch (e) {
      return reply.code(500).send({ error: e });
    } finally {
      client.release();
    }
  });
}

export default userRoutes;
