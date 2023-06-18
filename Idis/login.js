const http = require("http");
const { Pool } = require("pg");
const path = require("path");
const mime = require("mime");
const qs = require("querystring");
const clientSessions = require("client-sessions");
const fs = require("fs");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Tw-Project",
  password: "lucians2",
  port: "5432",
});

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method === "GET" && url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.readFile(path.join(__dirname, "login.html"), (err, data) => {
      if (err) {
        console.error("Error reading file", err);
        res.statusCode = 500;
        res.end("Internal Server Error");
      } else {
        res.end(data);
      }
    });
  } else if (method === "POST" && url === "/login") {
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
              // Set session
              req.session = { user: result.rows[0] };
              res.statusCode = 200;
              res.end("Login successful");
            } else {
              res.statusCode = 401;
              res.end("Invalid credentials");
            }
          }
        }
      );
    });
  } else if (method === "POST" && url === "/register") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const { firstname, lastname, country, city, borndate, email, password } =
        qs.parse(body);

      const query = `
        INSERT INTO users (username,country,city,born_date, email, password_hash)
        VALUES ($1, $2, $3,$4,$5,$6)
      `;
      let username = firstname + " " + lastname;
      pool.query(
        query,
        [username, country, city, borndate, email, password],
        (err, result) => {
          if (err) {
            console.error("Error executing query: " + err.stack);
            res.statusCode = 500;
            res.end("Internal Server Error");
          } else {
            console.log(req.body);
            res.statusCode = 302;
            res.setHeader("Location", "/login.html");
            res.end();
          }
        }
      );
    });
  } else if (method === "GET" || method === "HEAD") {
    const filePath = path.join(__dirname, url === "/" ? "login.html" : url);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error("Error reading file", err);
        res.statusCode = 500;
        res.end("Internal Server Error");
      } else {
        res.setHeader("Content-Type", mime.getType(filePath));
        res.end(data);
      }
    });
  } else {
    res.statusCode = 404;
    res.end("Not Found");
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
