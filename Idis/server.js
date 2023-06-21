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
  // let [path, query] = url.split("?");
  let path = url.split("?")[0];
  let query = url.split("?")[1];

  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  sessionMiddleware(req, res, () => {
    switch (true) {
      case method === "GET" && path === "/login":
        console.log("login");
        loginController.loginGet(req, res);
        break;
      case method === "POST" && path === "/login":
        loginController.loginPost(req, res);
        break;
      case method === "POST" && path === "/register":
        loginController.registerPost(req, res);
        break;
      case method === "GET" && path === "/register":
        loginController.registerGet(req, res);
        break;
      case method === "GET" && path === "/logout":
        loginController.logout(req, res);
        break;
      case method === "GET" && path === "/":
        Utils.redirectTo("/login", res);
        break;
      case method === "GET" && path === "/home":
        console.log("home");
        requireAuthentication(req, res, () => {
          homeController.homeGet(req, res);
        });
        break;
      case method === "GET" && path === "/createReview":
        // console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAADIFERIT");
        requireAuthentication(req, res, () => {
          createReviewController.createReviewGet(req, res);
        });
        break;
      case method === "POST" && path === "/createReview":
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAADIFERIT");
        requireAuthentication(req, res, () => {
          createReviewController.createReviewPost(req, res);
        });
        break;
      case method === "GET" && path === "/profile":
        console.log("profile");
        requireAuthentication(req, res, async () => {
          console.log("profile");
          await profileController.profileGet(req, res);
        });
        break;
      case method === "GET" && path === "/api/products":
        apiController.getProducts(req, res);
        break;
      case req.url.match(/^\/api\/products\/\w+/) && req.method === "GET":
        apiController.getProduct(req, res);
        break;
      case req.url.match(/^\/api\/products\/\w+\/reviews$/) &&
        req.method === "GET":
        apiController.getReviews(req, res);
        break;
      case req.url.match(/\/products\/\w+/) && req.method === "GET":
        productsController.productGet(req, res);
        break;
      case method === "GET" && path === "/profile":
        requireAuthentication(req, res, async () => {
          console.log("profile");
          await profileController.profileGet(req, res);
        });
        break;
      case method === "GET" || method === "HEAD":
        Utils.sendResources(req, res, path);
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
