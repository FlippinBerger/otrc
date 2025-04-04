async function userRoutes(fastify, opts) {
    fastify.get("/users/:id", opts, async (request, reply) => {
        const { id } = request.params;
        const client = await fastify.pg.connect();
        try {
            const res = await client.query("SELECT * FROM users WHERE id = $1", [id]);
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
    fastify.get("/users", opts, async (request, reply) => {
        const client = await fastify.pg.connect();
        try {
            const res = await client.query("SELECT * FROM users");
            if (res.rowCount == null || res.rowCount < 1) {
                return reply.code(404).send({ error: "not found" });
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
    fastify.patch("/users/:id", opts, async (request, reply) => {
        const { id } = request.params;
        const userId = request.session.user_id;
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
        }
        catch (e) {
            return reply.code(500).send({ error: e });
        }
        finally {
            client.release();
        }
    });
}
export default userRoutes;
