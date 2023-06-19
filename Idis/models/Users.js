const pool = require("../dbConnection");

let Users = {};

Users.getById = async (id) => {
  console.log("AM Primit Id-ul: " + id);

  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = ${id}`);

    if (result.rows.length > 0) {
      let user = result.rows[0];
      //   console.log("AM UTILIZATORULlllllllllll");
      console.log(user);
      user.born_date = user.born_date?.toLocaleDateString();
      return user;
    } else {
      console.log("Nu am gasit utilizatorul");
      return null;
    }
  } catch (err) {
    console.log("Eroare la query");
    console.log(err);
    return null;
  }
};

module.exports = Users;
