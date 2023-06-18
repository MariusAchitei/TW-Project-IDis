const fs = require("fs");
const qs = require("querystring");
const pool = require("../dbConnection");

let loginController = {};

loginController.loginPost = (req, res) => {
  console.log("FDSKBGUIKDSJBILN");
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

            fs.readFile("views/profile.html", "utf8", (err, data) => {
              if (err) {
                console.error("Error reading profile.html", err);
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Internal Server Error");
              } else {
                let profilePage = data.replace("{{username}}", user.username);
                profilePage = profilePage.replace(
                  "{{borndate}}",
                  user.born_date
                );
                profilePage = profilePage.replace("{{city}}", user.city);
                profilePage = profilePage.replace("{{country}}", user.country);
                profilePage = profilePage.replace(
                  "{{username}}",
                  user.username
                );
                profilePage = profilePage.replace(
                  "{{username}}",
                  user.username
                );
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(profilePage);
                // return;
              }
            });
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
module.exports = { loginController };
