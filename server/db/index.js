import fs from "fs";
async function dbPlugin(fastify, options) {
    const sql = fs.readFileSync("./db/init.sql").toString();
    const client = await fastify.pg.connect();
    try {
        const res = await client.query(sql);
        return res;
    }
    finally {
        // Release the client immediately after query resolves, or upon error
        client.release();
    }
}
export default dbPlugin;
