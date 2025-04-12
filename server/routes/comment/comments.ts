import { IDParam } from "../../types.js";

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
}

export default commentRoutes;
