const fs = require("fs");
const qs = require("querystring");
const pool = require("../dbConnection");
const jwt = require("jsonwebtoken");
const Utils = require("../utils");
require("dotenv").config();

let loginController = {};

loginController.loginGet = (req, res) => {
  Utils.sendResources(req, res, "/views/login.html");
};

loginController.loginPost = (req, res) => {
  //   console.log("FDSKBGUIKDSJBILN");
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", () => {
    const { email, password } = qs.parse(body);

    pool.query(
      "SELECT * FROM users WHERE email = $1 AND password_hash = $2",
      [email, password],
      (err, result) => {
        if (err) {
          console.error("Error executing query", err);
          res.statusCode = 500;
          res.end("Internal Server Error");
        } else {
          if (result.rows.length > 0) {
            const user = result.rows[0];

            let { token } = req.headers.cookie || "";

            if (token) {
              // Clear the token
              //   console
              res.setHeader("Set-Cookie", "token=; Max-Age=0");
            }

            token = jwt.sign({ id: user.id }, process.env.JWT_KEY);

            res.setHeader(
              "Set-Cookie",
              `token=${token}; HttpOnly; Max-Age=${1 * 60 * 60 * 1000}`
            );
            res.writeHead(200, { "Content-Type": "application/json" });

            res.end(
              JSON.stringify({ success: true, message: "User logged in" })
            );
          } else {
            res.statusCode = 401;
            res.end("Invalid credentials");
          }
        }
      }
    );
  });
};

loginController.registerPost = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", () => {
    const { firstname, lastname, email, country, city, borndate, password } =
      qs.parse(body);

    const query = `
        INSERT INTO users (username, email,country,city,born_date, password_hash)
        VALUES ($1, $2, $3,$4,$5,$6)
      `;
    let username = firstname + " " + lastname;
    pool.query(
      query,
      [username, email, country, city, borndate, password],
      (err, result) => {
        if (err) {
          console.error("Error executing query: " + err.stack);
          res.statusCode = 500;
          res.end("Internal Server Error");
        } else {
          console.log(req.body);
          res.statusCode = 302;
          res.setHeader("Location", "views/login.html");
          res.end();
        }
      }
    );
  });
};
module.exports = loginController;
