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
loginController.registerGet = (req, res) => {
  Utils.sendResources(req, res, "/views/register.html");
};
loginController.resetPasswordGet = (req, res) => {
  Utils.sendResources(req, res, "/views/resetPassword.html");
};
loginController.resetPasswordPut = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", () => {
    const formatData = JSON.parse(body);
    console.log(
      formatData.email,
      formatData.password,
      formatData.newpassword,
      formatData.id
    );
    const query = "UPDATE users SET password_hash = $1 WHERE id=$2 ";
    pool.query(
      query,
      [Utils.hash256(formatData.newpassword.toString()), formatData.id],
      (err, result) => {
        if (err) {
          console.error("Error executing query", err);
          res.statusCode = 500;
          res.end("Internal Server Error");
        } else {
          if (formatData.password !== formatData.newpassword) {
            res.statusCode = 302;
            res.setHeader("Location", "/profile");
            res.end();
          } else {
            res.statusCode = 401;
            res.end("Please choose a different password!");
          }
        }
      }
    );
  });
};

loginController.loginPost = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", () => {
    let { email, password } = qs.parse(body);
    password = Utils.hash256(password);

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

            Utils.redirectTo("/profile", res);
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
    let {
      firstname,
      lastname,
      email,
      country,
      city,
      borndate,
      password,
      profile,
    } = qs.parse(body);
    password = Utils.hash256(password);
    profile = profile ? profile : "profile-default.png";

    const query = `
        INSERT INTO users (username, email,country,city,born_date, password_hash, profile)
        VALUES ($1, $2, $3,$4,$5,$6, $7)
      `;
    let username = firstname + " " + lastname;
    pool.query(
      query,
      [username, email, country, city, borndate, password, profile],
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

loginController.logout = (req, res) => {
  res.setHeader("Set-Cookie", "token=; Max-Age=0");
  Utils.redirectTo("/login", res);
};
module.exports = loginController;
