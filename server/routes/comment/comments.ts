import { Comment, IDParam } from "../../types.js";

import { FastifyInstance } from "fastify";

async function commentRoutes(fastify: FastifyInstance, opts: any) {
  fastify.get<{
    Params: IDParam;
  }>("/comments/:id", opts, async (request, reply) => {
    const { id } = request.params;
    const client = await fastify.pg.connect();

    try {
      const res = await client.query(
        "SELECT * FROM comments WHERE id = $1 AND deleted_at IS NULL",
        [id],
      );

      if (res.rowCount == null || res.rowCount < 1) {
        return reply.code(404).send({ error: "comment not found" });
      }

      return res.rows[0];
    } catch (e) {
      return reply.code(500).send({ error: e });
    } finally {
      client.release();
    }
  });

  interface ICommentUpdate {
    message: string;
  }

  fastify.put<{
    Params: IDParam;
    Body: ICommentUpdate;
  }>(
    "/comments/:id",
    { onRequest: [fastify.jwtAuth] },
    async (request, reply) => {
      const { id } = request.params;
      const client = await fastify.pg.connect();

      const { message } = request.body;

      try {
        const res = await client.query(
          "UPDATE comments SET message = $1 WHERE id = $2",
          [message, id],
        );

        if (res.rowCount == null || res.rowCount < 1) {
          return reply.code(404).send({ error: "comment not found" });
        }

        return reply.code(200).send("update success");
      } catch (e) {
        return reply.code(500).send({ error: e });
      } finally {
        client.release();
      }
    },
  );

  fastify.post<{
    Params: IDParam;
  }>(
    "/comments/:id/report",
    { onRequest: [fastify.jwtAuth] },
    async (request, reply) => {
      const { id } = request.params;
      const client = await fastify.pg.connect();

      const userId = request.user;

      try {
        const res = await client.query(
          "INSERT INTO comment_reports (comment_id, reporter_id) VALUES ($1, $2)",
          [id, userId],
        );

        if (res.rowCount == null || res.rowCount < 1) {
          return reply.code(404).send({ error: "comment not found" });
        }

        return reply.code(200).send("successfully reported");
      } catch (e) {
        return reply.code(500).send({ error: e });
      } finally {
        client.release();
      }
    },
  );

  fastify.delete<{
    Params: IDParam;
  }>(
    "/comments/:id",
    { onRequest: [fastify.jwtAuth] },
    async (request, reply) => {
      const { id } = request.params;
      const client = await fastify.pg.connect();

      const userId = request.user;

      try {
        const res = await client.query<Comment>(
          "SELECT * FROM comments WHERE id = $1",
          [id],
        );

        if (res.rowCount == null || res.rowCount < 1) {
          return reply.code(404).send({ error: "comment not found" });
        }

        const comment = res.rows[0];

        if (userId != comment.commenter) {
          return reply
            .code(403)
            .send("you cannot delete a comment you didn't post");
        }

        await client.query("DELETE FROM comments WHERE id = $1", [id]);

        return reply.code(200).send("delete success");
      } catch (e) {
        return reply.code(500).send({ error: e });
      } finally {
        client.release();
      }
    },
  );
}

export default commentRoutes;
