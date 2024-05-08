import pg from "pg";

export const pool = new pg.Pool({
  host: "dpg-corfkl21hbls73f554ag-a.frankfurt-postgres.render.com",
  port: 5432,
  database: "database_proyect",
  user: "avengers",
  password: "fJRx4qphyA5ruNHCFR4piJyBQz4SuDel",
  ssl: {
    rejectUnauthorized: false, 
  },
});
