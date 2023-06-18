const express = require("express");
const session = require("express-session");
const { Pool } = require("pg");
const path = require("path");
const mime = require("mime");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Tw-Project",
  password: "lucians2",
  port: "5432",
});

app.use(
  session({
    secret: "ceva pt securitate",
    resave: false,
    saveUninitialized: true,
  })
);

//app.use(express.static(path.join(__dirname, "IDIs")));
app.use(
  express.static(__dirname, {
    setHeaders: (res, filePath) => {
      res.setHeader("Content-Type", mime.getType(filePath));
    },
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  pool.query(
    "SELECT * FROM users WHERE email = $1 AND password_hash = $2",
    [email, password],
    (err, result) => {
      if (err) {
        console.error("Error executing query", err);
        res.status(500).send("Internal server error");
      } else {
        if (result.rows.length > 0) {
          req.session.user = result.rows[0];
          res.status(200).send("Login successful");
        } else {
          res.status(401).send("Invalid credentials");
        }
      }
    }
  );
});
app.post("/register", (req_new, res_new) => {
  const { firstname, lastname, email, password } = req_new.body;

  const query = `
    INSERT INTO users (username, email, password_hash)
    VALUES ($1, $2, $3)
  `;
  let username = firstname + lastname;
  pool.query(query, [username, email, password], (err, result) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      res_new.status(500).send("Internal Server Error");
    } else {
      console.log(req_new.body);
      res_new.redirect("/login.html"); // Redirect to the login page
    }
  });
});
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
