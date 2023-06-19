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
const createReviewController = require("./controllers/createReviewController");

const sessionMiddleware = clientSessions({
  cookieName: "session",
  secret: "ceva pt securitate",
  duration: 24 * 60 * 60 * 1000, // 1 day
  activeDuration: 30 * 60 * 1000, // 30 minutes
});

const server = http.createServer((req, res) => {
  let { method, url } = req;
  sessionMiddleware(req, res, () => {
    switch (true) {
      case method === "GET" && url === "/login":
        console.log("login");
        loginController.loginGet(req, res);
        break;
      case method === "POST" && url === "/login":
        loginController.loginPost(req, res);
        break;
      case method === "POST" && url === "/register":
        loginController.registerPost(req, res);
        break;
      case method === "GET" && url === "/register":
        loginController.registerGet(req, res);
        break;
      case method === "GET" && url === "/":
        Utils.redirectTo("/login", res);
        break;
      case method === "GET" && url === "/home":
        console.log("home");
        requireAuthentication(req, res, () => {
          homeController.homeGet(req, res);
        });
        break;
      case method === "GET" && url === "/createReview":
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAADIFERIT");
        requireAuthentication(req, res, () => {
          createReviewController.createReviewGet(req, res);
        });
        break;
      case method === "POST" && url === "/createReview":
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAADIFERIT");
        requireAuthentication(req, res, () => {
          createReviewController.createReviewPost(req, res);
        });
        break;
      case method === "GET" && url === "/profile":
        console.log("profile");
        requireAuthentication(req, res, async () => {
          console.log("profile");
          await profileController.profileGet(req, res);
        });
        break;
      case req.url.match(/^\/api\/products\/\w+\/reviews$/) &&
        req.method === "GET":
        apiController.getReviews(req, res);
        break;
      case req.url.match(/\/products\/\w+/) && req.method === "GET":
        productsController.productGet(req, res);
        break;
      case method === "GET" && url === "/profile":
        requireAuthentication(req, res, async () => {
          console.log("profile");
          await profileController.profileGet(req, res);
        });
        break;
      case method === "GET" || method === "HEAD":
        Utils.sendResources(req, res, url);
        break;
      default:
        res.statusCode = 404;
        res.end("Not Found");
        break;
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
