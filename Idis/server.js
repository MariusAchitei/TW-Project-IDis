const http = require("http");
const path = require("path");
const mime = require("mime");
const qs = require("querystring");
const clientSessions = require("client-sessions");
const fs = require("fs");
require("dotenv").config();

const pool = require("./dbConnection");
const { requireAuthentication } = require("./middleware");
const loginController = require("./controllers/loginController");
const homeController = require("./controllers/homeController");
const profileController = require("./controllers/profileController");
const productsController = require("./controllers/productsController");
const apiController = require("./controllers/apiController");
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
    if (method === "GET" && url === "/login") {
      console.log("login");
      loginController.loginGet(req, res);
    } else if (method === "POST" && url === "/login")
      loginController.loginPost(req, res);
    else if (method === "POST" && url === "/register")
      loginController.registerPost(req, res);
    else if (method === "GET" && url == "/register")
      loginController.registerGet(req, res);
    else if (method === "GET" && url === "/logout")
      loginController.logout(req, res);
    else if (method === "GET" && url === "/") Utils.redirectTo("/login", res);
    else if (method === "GET" && url === "/home") {
      console.log("home");
      requireAuthentication(req, res, () => {
        homeController.homeGet(req, res);
      });
    } else if (method === "GET" && url === "/createReview") {
      requireAuthentication(req, res, () => {
        homeController.createReviewGet(req, res);
      });
    } else if (
      req.url.match(/^\/api\/products\/\w+\/reviews$/) &&
      req.method === "GET"
    ) {
      apiController.getReviews(req, res);
    } else if (req.url.match(/\/products\/\w+/) && req.method === "GET") {
      productsController.productGet(req, res);
    } else if (method === "GET" && url === "/profile") {
      console.log("profile");
      requireAuthentication(req, res, async () => {
        console.log("profile");
        await profileController.profileGet(req, res);
      });
    } else if (method === "GET" || method === "HEAD")
      Utils.sendResources(req, res, url);
    else {
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

const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
