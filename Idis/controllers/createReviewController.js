const fs = require("fs");
const qs = require("querystring");
const pool = require("../dbConnection");
const jwt = require("jsonwebtoken");
const Utils = require("../utils");
const Users = require("../models/Users");
require("dotenv").config();

let createReviewController = {};

createReviewController.createReviewGet = (req, res) => {
  Utils.sendResources(req, res, "/views/createReview.html");
};

createReviewController.createReviewPost = (req, res) => {
  let user = req.locals.userId;
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", () => {
    const formatdata = qs.parse(body);

    const query = `
        INSERT INTO reviews (user_id,product_id,price,bought_on,store,body,rating,title)
        VALUES ($1, $2, $3,$4,$5,$6,$7,$8)
      `;

    pool.query(
      query,
      [user, , , , , formatdata.body, formatdata.mySelect2, formatdata.title],
      (err, result) => {
        if (err) {
          console.error("Error executing query: " + err.stack);
          res.statusCode = 500;
          res.end("Internal Server Error");
        } else {
          console.log(req.body);
          res.statusCode = 302;
          res.setHeader("Location", "/views/profile.html");
          res.end();
        }
      }
    );
  });
};

module.exports = createReviewController;
