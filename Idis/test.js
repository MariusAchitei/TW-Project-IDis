require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DB_PORT,
});

let Users = {};

Users.getById = async (id) => {
  console.log("AM Primit Id-ul: " + id);
  await pool.query(`SELECT * FROM users WHERE id = ${id}`, (err, result) => {
    if (err) {
      console.log("Eroare la query");
      console.log(err);
      return null;
    } else {
      if (result.rows.length > 0) {
        const user = result.rows[0];
        console.log("AM UTILIZATORULlllllllllll");
        console.log(user);
        return user;
      } else {
        console.log("Nu am gasit utilizatorul");
        return null;
      }
    }
  });
};
async function bagPula() {
  const user = await Users.getById(1);
  console.log("AM UTILIZATORUL");
  console.log(user);
}
bagPula();
