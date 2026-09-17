const pool = require("../db/connection");

async function getTransaction() {
    const result = await pool.query("SELECT * FROM public.transaction");

    return result.rows;
}

module.exports = {
    getTransaction
};