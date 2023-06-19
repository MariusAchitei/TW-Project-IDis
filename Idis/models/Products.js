const pool = require("../dbConnection");

let Products = {};

Products.getById = async (id) => {
  console.log("AM Primit Id-ul: " + id);

  try {
    const result = await pool.query(
      `SELECT * FROM Products p JOIN interests i ON p.interest_id = i.id WHERE p.id = ${id}`
    );

    if (result.rows.length > 0) {
      let product = result.rows[0];
      console.log(product);
      return product;
    } else {
      console.log("Nu am gasit produsul");
      return null;
    }
  } catch (err) {
    console.log("Eroare la query");
    console.log(err);
    return null;
  }
};

module.exports = Products;
