const pool = require("../db/connection");

async function getCategories() {
    const result = await pool.query("SELECT * FROM public.categories");
    return result.rows;
};

module.exports = {
    getCategories
};