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

const sessionMiddleware = clientSessions({
  cookieName: "session",
  secret: "ceva pt securitate",
  duration: 24 * 60 * 60 * 1000, // 1 day
  activeDuration: 30 * 60 * 1000, // 30 minutes
});

const server = http.createServer((req, res) => {
  const { method, url } = req;
  sessionMiddleware(req, res, () => {
    if (method === "POST" && url === "/login") {
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

                fs.readFile("profile.html", "utf8", (err, data) => {
                  if (err) {
                    console.error("Error reading profile.html", err);
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    res.end("Internal Server Error");
                  } else {
                    let profilePage = data.replace(
                      "{{username}}",
                      user.username
                    );
                    profilePage = profilePage.replace(
                      "{{borndate}}",
                      user.born_date
                    );
                    profilePage = profilePage.replace("{{city}}", user.city);
                    profilePage = profilePage.replace(
                      "{{country}}",
                      user.country
                    );
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end(profilePage);
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
    } else if (method === "POST" && url === "/register") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        const {
          firstname,
          lastname,
          email,
          country,
          city,
          borndate,
          password,
        } = qs.parse(body);

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
});

server.on("request", (req, res) => {
  sessionMiddleware(req, res, () => {
    server.emit("sessionParsed", req, res);
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
