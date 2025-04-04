import { EventTypes, } from "../../types.js";
async function eventRoutes(fastify, opts) {
    fastify.get("/events/:id", opts, async (request, reply) => {
        const { id } = request.params;
        const client = await fastify.pg.connect();
        try {
            const res = await client.query("SELECT * FROM events WHERE id = $1 AND deleted_at IS NULL", [id]);
            if (res.rowCount == null || res.rowCount < 1) {
                return reply.code(404).send({ error: "not found" });
            }
            return res.rows[0];
        }
        catch (e) {
            return reply.code(500).send({ error: e });
        }
        finally {
            client.release();
        }
    });
    fastify.get("/events/:id/comments", opts, async (request, reply) => {
        const { id } = request.params;
        const client = await fastify.pg.connect();
        try {
            const eventRes = await client.query("SELECT * FROM events WHERE id = $1 AND deleted_at IS NULL", [id]);
            if (eventRes.rowCount == null || eventRes.rowCount < 1) {
                return reply.code(404).send({ error: `event ${id} doesnt exist` });
            }
            const res = await client.query("SELECT * FROM comments WHERE event_id = $1 AND deleted_at IS NULL", [id]);
            if (res.rowCount == null || res.rowCount < 1) {
                return reply.code(200).send([]);
            }
            return reply.code(200).send(res.rows);
        }
        catch (e) {
            return reply.code(500).send({ error: e });
        }
        finally {
            client.release();
        }
    });
    fastify.get("/events/:id/attendees", opts, async (request, reply) => {
        const { id } = request.params;
        const client = await fastify.pg.connect();
        try {
            const eventRes = await client.query("SELECT * FROM events WHERE id = $1 AND deleted_at IS NULL", [id]);
            if (eventRes.rowCount == null || eventRes.rowCount < 1) {
                return reply.code(404).send({ error: `event ${id} doesnt exist` });
            }
            const query = `
        SELECT id, username, img_url
        FROM users
        LEFT JOIN event_goers ON users.id = event_goers.user_id
        WHERE event_goers.event_id = $1 AND users.deleted_at IS NULL
        `;
            const res = await client.query(
            //"SELECT id, username, img_url FROM users WHERE event_id = $1 AND deleted_at IS NULL",
            query, [id]);
            if (res.rowCount == null || res.rowCount < 1) {
                return reply.code(200).send([]);
            }
            return reply.code(200).send(res.rows);
        }
        catch (e) {
            console.log(e);
            return reply.code(500).send({ error: e });
        }
        finally {
            client.release();
        }
    });
    fastify.get("/events", opts, async (reventsequest, reply) => {
        console.log("--getting events--");
        const client = await fastify.pg.connect();
        try {
            const query = `
        SELECT
        events.*,
        COUNT(comments.id) as comment_count,
        COALESCE(json_agg(json_build_object('id', users.id, 'username', users.username, 'img_url', users.img_url)) FILTER (WHERE users.id IS NOT NULL), '[]') AS attendees
        FROM events
        LEFT JOIN comments ON events.id = comments.event_id
        AND comments.deleted_at IS NULL
        LEFT JOIN event_goers ON events.id = event_goers.event_id
        LEFT JOIN users ON event_goers.user_id = users.id
        WHERE events.deleted_at IS NULL
        GROUP BY events.id`;
            const res = await client.query(query);
            if (res.rowCount == null || res.rowCount < 1) {
                return reply.code(404).send({ error: "no events found" });
            }
            return reply.code(200).send(res.rows);
        }
        catch (e) {
            console.log("oops", e);
            return reply.code(500).send({ error: e });
        }
        finally {
            client.release();
        }
    });
    fastify.post("/events", opts, async (request, reply) => {
        console.log("req cookies", request.cookies);
        console.log("req.session", request.session);
        const userId = request.session.user_id;
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
            const { rows } = await client.query("INSERT INTO events (name, type, poster, time, description) VALUES ($1, $2, $3, $4, $5) RETURNING id", [name, type, userId, time, description]);
            const eventId = rows[0].id;
            await client.query("INSERT INTO event_goers (user_id, event_id) VALUES ($1, $2)", [userId, eventId]);
            return eventId;
        }
        catch (e) {
            return reply.code(500).send({ error: e });
        }
        finally {
            client.release();
        }
    });
    fastify.patch("/events/:id", opts, (request, reply) => {
        const { id } = request.params;
        const userId = request.session.user_id;
        if (!userId) {
            return reply
                .code(401)
                .send({ error: "must be logged in to edit an event" });
        }
        const { type, time, description } = request.body;
    });
    fastify.post("/events/:id/attend", opts, async (request, reply) => {
        const { id: eventId } = request.params;
        const client = await fastify.pg.connect();
        const userId = request.session.user_id;
        if (!userId) {
            return reply
                .code(401)
                .send({ error: "must be logged in to attend an event" });
        }
        try {
            await client.query("INSERT INTO event_goers (event_id, user_id) VALUES ($1, $2)", [eventId, userId]);
        }
        catch (e) {
            return reply.code(500).send({ error: e });
        }
        finally {
            client.release();
        }
    });
    //interface IUsersReply {
    //  200: User[];
    //  "4xx": { error: string };
    //  "5xx": { error: any };
    //}
    //fastify.get<{
    //  Params: IDParam;
    //  Reply: IUsersReply;
    //}>("/events/:id/attendees", opts, async (request, reply) => {
    //  const { id: eventId } = request.params;
    //  const client = await fastify.pg.connect();
    //
    //  try {
    //    const res = await client.query(
    //      "SELECT users.* from users INNER JOIN event_goers ON event_goers.user_id = users.id WHERE event_goers.event_id = $1",
    //      [eventId],
    //    );
    //
    //    if (res.rowCount == null || res.rowCount < 1) {
    //      return reply.code(404).send({ error: "not found" });
    //    }
    //
    //    return reply.code(200).send(res.rows);
    //  } catch (e) {
    //    return reply.code(500).send({ error: e });
    //  } finally {
    //    client.release();
    //  }
    //});
}
export default eventRoutes;
