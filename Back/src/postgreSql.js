import express from "express";
import { pool } from "../dataBase/connectionPostgreSql.js";

const app = express();
const PORT = 3000;

app.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM public."Client" ORDER BY "idClient" ASC'
    );

    const clients = result.rows;
    res.json(clients);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
