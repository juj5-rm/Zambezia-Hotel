import { pool } from "../dataBase/connectionPostgreSql.js";

const getClients = async () => {
  try {
    const result = await pool.query('SELECT * FROM public."Client" ORDER BY "idClient" ASC '
);

    const clients = result.rows;

    console.log(clients);
  } catch (error) {
    console.log(error);
  }
};

getClients();
