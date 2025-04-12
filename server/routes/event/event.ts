import {
  Attendee,
  Comment,
  EventType,
  EventTypes,
  IDParam,
  OTRCEvent,
} from "../../types.js";
import { FastifyInstance } from "fastify";

interface IEventReply {
  200: OTRCEvent;
  "4xx": { error: string };
  "5xx": { error: any };
}

async function eventRoutes(fastify: FastifyInstance, opts: any) {
  fastify.get<{
    Params: IDParam;
    Reply: IEventReply;
  }>("/events/:id", opts, async (request, reply) => {
    const { id } = request.params;
    const client = await fastify.pg.connect();

    try {
      const res = await client.query(
        "SELECT * FROM events WHERE id = $1 AND deleted_at IS NULL",
        [id],
      );

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

  interface ICommentsReply {
    200: Comment[];
    "4xx": { error: string };
    "5xx": { error: any };
  }

  fastify.get<{
    Params: IDParam;
    Reply: ICommentsReply;
  }>("/events/:id/comments", opts, async (request, reply) => {
    const { id } = request.params;
    const client = await fastify.pg.connect();

    try {
      const eventRes = await client.query(
        "SELECT * FROM events WHERE id = $1 AND deleted_at IS NULL",
        [id],
      );

      if (eventRes.rowCount == null || eventRes.rowCount < 1) {
        return reply.code(404).send({ error: `event ${id} doesnt exist` });
      }

      const query = `
        SELECT
        comments.*,
        users.id as user_id,
        users.username as username,
        users.img_url as user_pic,
        users.deleted_at as user_deleted_time
        FROM comments
        LEFT JOIN users ON comments.commenter = users.id
        WHERE comments.deleted_at IS NULL
        AND event_id = $1
       `;

      const res = await client.query(
        //"SELECT * FROM comments WHERE event_id = $1 AND deleted_at IS NULL",
        query,
        [id],
      );

      if (res.rowCount == null || res.rowCount < 1) {
        return reply.code(200).send([]);
      }

      return reply.code(200).send(res.rows);
    } catch (e) {
      console.log(e);
      return reply.code(500).send({ error: e });
    } finally {
      client.release();
    }
  });

  interface ICommentBody {
    comment: string;
  }

  fastify.post<{
    Params: IDParam;
    Body: ICommentBody;
  }>(
    "/events/:id/comments",
    { onRequest: [fastify.jwtAuth] },
    async (request, reply) => {
      const { id } = request.params;

      const userId = request.user;
      if (!userId) {
        return reply.code(401).send({ error: "must be logged in to comment" });
      }

      const client = await fastify.pg.connect();

      const { comment } = request.body;

      try {
        const eventRes = await client.query(
          "SELECT * FROM events WHERE id = $1 AND deleted_at IS NULL",
          [id],
        );

        if (eventRes.rowCount == null || eventRes.rowCount < 1) {
          return reply.code(404).send({ error: `event ${id} doesnt exist` });
        }

        console.log(`userId: ${userId}, event: ${id}, comment: ${comment}`);

        await client.query(
          "INSERT INTO comments (commenter, event_id, message) VALUES ($1, $2, $3)",
          [userId, id, comment],
        );

        return reply.code(200).send();
      } catch (e) {
        return reply.code(500).send({ error: e });
      } finally {
        client.release();
      }
    },
  );

  interface IAttendeesReply {
    200: Attendee[];
    "4xx": { error: string };
    "5xx": { error: any };
  }

  fastify.get<{
    Params: IDParam;
    Reply: IAttendeesReply;
  }>("/events/:id/attendees", opts, async (request, reply) => {
    const { id } = request.params;
    const client = await fastify.pg.connect();

    try {
      const eventRes = await client.query(
        "SELECT * FROM events WHERE id = $1 AND deleted_at IS NULL",
        [id],
      );

      if (eventRes.rowCount == null || eventRes.rowCount < 1) {
        return reply.code(404).send({ error: `event ${id} doesnt exist` });
      }

      const query = `
        SELECT id, username, img_url
        FROM users
        LEFT JOIN event_goers ON users.id = event_goers.user_id
        WHERE event_goers.event_id = $1 AND users.deleted_at IS NULL
        `;

      const res = await client.query(query, [id]);

      if (res.rowCount == null || res.rowCount < 1) {
        return reply.code(200).send([]);
      }

      return reply.code(200).send(res.rows);
    } catch (e) {
      console.log(e);
      return reply.code(500).send({ error: e });
    } finally {
      client.release();
    }
  });

  fastify.post<{
    Params: IDParam;
  }>(
    "/events/:id/attendees",
    { onRequest: [fastify.jwtAuth] },
    async (request, reply) => {
      const { id } = request.params;

      //const userId = request.session.user_id;
      //const userId = 1;
      const userId = request.user;
      console.log("user is", userId);
      if (!userId) {
        return reply
          .code(401)
          .send({ error: "must be logged in to attend an event" });
      }

      const client = await fastify.pg.connect();

      try {
        const eventRes = await client.query(
          "SELECT * FROM events WHERE id = $1 AND deleted_at IS NULL",
          [id],
        );

        if (eventRes.rowCount == null || eventRes.rowCount < 1) {
          return reply.code(404).send({ error: `event ${id} doesnt exist` });
        }

        await client.query(
          "INSERT INTO event_goers (event_id, user_id) VALUES ($1, $2)",
          [id, userId],
        );

        return reply.code(200).send();
      } catch (e) {
        console.log("Unable to attend event:", e);
        return reply.code(500).send({ error: e });
      } finally {
        client.release();
      }
    },
  );

  fastify.post<{
    Params: IDParam;
  }>(
    "/events/:id/unattend",
    { onRequest: [fastify.jwtAuth] },
    async (request, reply) => {
      const { id } = request.params;

      const userId = request.user;
      if (!userId) {
        return reply
          .code(401)
          .send({ error: "must be logged in to unattend an event" });
      }

      const client = await fastify.pg.connect();

      try {
        const eventRes = await client.query(
          "SELECT * FROM events WHERE id = $1 AND deleted_at IS NULL",
          [id],
        );

        if (eventRes.rowCount == null || eventRes.rowCount < 1) {
          return reply.code(404).send({ error: `event ${id} doesnt exist` });
        }

        await client.query(
          "DELETE FROM event_goers WHERE event_id = $1 AND user_id = $2",
          [id, userId],
        );

        return reply.code(200).send();
      } catch (e) {
        console.log("Unable to unattend event:", e);
        return reply.code(500).send({ error: e });
      } finally {
        client.release();
      }
    },
  );

  interface IEventsReply {
    200: OTRCEvents[];
    "4xx": { error: string };
    "5xx": { error: any };
  }

  interface OTRCEvents {
    id: number;
    name: string;
    type: EventType;
    poster: number;
    time: Date;
    description: string;
    img_url?: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
    comment_count: number;
  }

  fastify.get<{
    Params: IDParam;
    Reply: IEventsReply;
  }>("/events", opts, async (request, reply) => {
    console.log("--getting events--");
    console.log("auth header:", request.headers.authorization);
    const client = await fastify.pg.connect();

    try {
      const query = `
        SELECT
        events.*,
        COUNT(comments.id) as comment_count,
        (SELECT COALESCE(json_agg(json_build_object('id', users.id, 'username', users.username, 'img_url', users.img_url)) FILTER (WHERE users.id IS NOT NULL), '[]')
         FROM users
         LEFT JOIN event_goers ON events.id = event_goers.event_id
         WHERE users.id = event_goers.user_id AND users.deleted_at IS NULL) as attendees
        FROM events
        LEFT JOIN comments ON events.id = comments.event_id
        AND comments.deleted_at IS NULL
        WHERE events.deleted_at IS NULL
        GROUP BY events.id`;
      const res = await client.query(query);

      if (res.rowCount == null || res.rowCount < 1) {
        return reply.code(404).send({ error: "no events found" });
      }

      return reply.code(200).send(res.rows);
    } catch (e) {
      console.log("oops", e);
      return reply.code(500).send({ error: e });
    } finally {
      client.release();
    }
  });

  interface EventBody {
    name: string;
    type: EventType;
    time: Date;
    description?: string;
  }

  fastify.post<{
    Body: EventBody;
  }>("/events", { onRequest: [fastify.jwtAuth] }, async (request, reply) => {
    const userId = request.user;
    if (!userId) {
      return reply
        .code(401)
        .send({ error: "must be logged in to create an event" });
    }

    const { name, type, time, description } = request.body;
    // validate event type
    if (!EventTypes.includes(type)) {
      return reply.code(400).send({
        error: "type must be one of race, fun-run, training, or hang",
      });
    }

    if (!name || !type || !time) {
      return reply.code(400).send({
        error: "name, type, and  time are required to create an event",
      });
    }

    const client = await fastify.pg.connect();
    try {
      const { rows } = await client.query(
        "INSERT INTO events (name, type, poster, time, description) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [name, type, userId, time, description],
      );

      const eventId = rows[0].id;

      await client.query(
        "INSERT INTO event_goers (user_id, event_id) VALUES ($1, $2)",
        [userId, eventId],
      );
      return eventId;
    } catch (e) {
      return reply.code(500).send({ error: e });
    } finally {
      client.release();
    }
  });

  // TODO: Update to be able to edit the image as well
  interface IEventUpdateBody {
    type?: string;
    time?: Date;
    description?: string;
  }

  fastify.patch<{
    Params: IDParam;
    Body: IEventUpdateBody;
  }>("/events/:id", { onRequest: [fastify.jwtAuth] }, (request, reply) => {
    const { id } = request.params;

    const userId = request.user;
    if (!userId) {
      return reply
        .code(401)
        .send({ error: "must be logged in to edit an event" });
    }

    const { type, time, description } = request.body;
  });
}

export default eventRoutes;
