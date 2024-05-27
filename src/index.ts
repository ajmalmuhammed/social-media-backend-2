import express from 'express';
import dotenv from "dotenv";

const app = express()
dotenv.config();

app.get("/hello", (req, res) => {
    res.json({success: "Hello world"})
})

const port = process.env.PORT || 8000
app.listen(port)