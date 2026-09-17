require("dotenv").config();

const express = require("express");
const app = express();
const pool = require("./db/connection");

const { getCategories } = require("./queries/categories");
const { getTransaction } = require("./queries/transaction");


app.get("/", (req, res) =>{
    res.send("Backend is running!");
});

app.get("/api/test", (req, res) => {
    res.json({
        message:"Backend API is working",
        status:"Success"
    });
});

app.get("/api/categories", async (req, res) => {
    try {
        const categories = await getCategories();

        res.json(categories);
    }catch (error){
        res.status(500).json({
            error: "Failed to fetch categories."
        });
    }
});

app.get("/api/transaction", async (req, res) => {
    try{
        const transaction = await getTransaction();

        res.json(transaction);
    }catch (error) {
        res.status(500).json({
            error:"Failed to fetch Transactions"
        });
    }
});

app.get("/api/db-test", async (req, res) => {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
})

app.listen(3000, () =>{
    console.log("Backend is running on port 3000");
});

