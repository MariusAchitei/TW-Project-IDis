const pool = require("../dbConnection");

let Reviews = {};

Reviews.getById = async (id) => {
  console.log("AM Primit Id-ul: " + id);

  try {
    const result = await pool.query(
      `SELECT * FROM Reviews r JOIN Products p ON r.product_id = p.id WHERE r.id = ${id}`
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

Reviews.getByProductId = async (id) => {
  console.log("AM Primit Id-ul: " + id);

  try {
    const result = await pool.query(
      `SELECT * FROM (SELECT * FROM Reviews r JOIN Products p ON r.product_id = p.id WHERE p.id = ${id}) c JOIN Users u ON c.user_id = u.id`
    );

    if (result.rows.length > 0) {
      console.log(result.rows);
      return result.rows;
    } else {
      console.log("Produsul nu are review-uri");
      return null;
    }
  } catch (err) {
    console.log("Eroare la query");
    console.log(err);
    return null;
  }
};

Reviews.getByUserId = async (id) => {
  console.log("AM Primit Id-ul: " + id);

  try {
    const result = await pool.query(
      `SELECT * FROM (SELECT * FROM Reviews r JOIN users u ON r.user_id = u.id WHERE u.id = ${id}) c JOIN products p ON c.product_id = p.id`
    );

    if (result.rows.length > 0) {
      console.log(result.rows);
      return result.rows;
    } else {
      console.log("Produsul nu are review-uri");
      return null;
    }
  } catch (err) {
    console.log("Eroare la query");
    console.log(err);
    return null;
  }
};
module.exports = Reviews;
