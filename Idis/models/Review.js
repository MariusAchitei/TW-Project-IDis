const pool = require("../dbConnection");

let Reviews = {};

Reviews.getById = async (id) => {
  console.log("AM Primit Id-ul: " + id);

  try {
    const result = await pool.query(
      `SELECT * FROM reviews r join products p on p.id=r.product_id WHERE r.id = ${id}`
    );

    if (result.rows.length > 0) {
      let review = result.rows[0];
      console.log(review);
      return review;
    } else {
      console.log("Nu am gasit review-ul");
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
      `SELECT c.id,user_id,product_id,price,bought_on,title,store,body,rating,p.name,p.interest_id,p.description,p.photo,username,profile FROM (SELECT r.id,user_id,product_id,price,bought_on,title,store,body,rating,u.username,u.profile FROM Reviews r JOIN users u ON r.user_id = u.id WHERE u.id = ${id}) c JOIN products p ON c.product_id = p.id`
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

Reviews.getAll = async () => {
  try {
    const result = await pool.query(
      `SELECT * FROM (SELECT * FROM Reviews r JOIN users u ON r.user_id = u.id) c JOIN products p ON c.product_id = p.id`
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

Reviews.deleteById = async (id) => {
  try {
    await pool.query(`DELETE FROM reviews WHERE id = ${id}`);
  } catch (err) {
    console.log("Error deleting review:", err);
    throw err;
  }
};

module.exports = Reviews;
