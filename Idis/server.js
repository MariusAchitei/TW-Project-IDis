const http = require("http");
const path = require("path");
const mime = require("mime");
const qs = require("querystring");
const clientSessions = require("client-sessions");
const fs = require("fs");
require("dotenv").config();

const pool = require("./dbConnection");
const { requireAuthentication } = require("./middleware");
const { loginController } = require("./controllers/loginController");
const Utils = require("./utils");

const sessionMiddleware = clientSessions({
  cookieName: "session",
  secret: "ceva pt securitate",
  duration: 24 * 60 * 60 * 1000, // 1 day
  activeDuration: 30 * 60 * 1000, // 30 minutes
});

const server = http.createServer((req, res) => {
  let { method, url } = req;
  sessionMiddleware(req, res, () => {
    Utils.post("/login", req, res, loginController.loginPost);

    Utils.post("/register", req, res, loginController.registerPost);

    Utils.redirect(method, url, "GET", "/", "/views/login.html", res);

    if (method === "GET" || method === "HEAD") {
      requireAuthentication(req, res, () => {
        Utils.sendResources(req, res, url);
      });
    }
    //  else {
    //   res.statusCode = 404;
    //   res.end("Not Found");
    // }
  });
});

server.on("request", (req, res) => {
  sessionMiddleware(req, res, () => {
    server.emit("sessionParsed", req, res);
  });
});

const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
