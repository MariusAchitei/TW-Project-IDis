const fs = require("fs");
const qs = require("querystring");
const pool = require("../dbConnection");
const jwt = require("jsonwebtoken");
const Utils = require("../utils");
const Users = require("../models/Users");
const parser = require("body-parser");
const multer = require("multer");
require("dotenv").config();

let reviewController = {};

reviewController.createReviewGet = (req, res) => {
  Utils.sendResources(req, res, "/views/createReview.html");
};
reviewController.editReviewGet = (req, res) => {
  Utils.sendResources(req, res, "/views/editReview.html");
};
reviewController.deleteReviewGet = (req, res) => {
  Utils.sendResources(req, res, "/views/profile.html");
};
reviewController.createReviewPost = (req, res) => {
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
      [
        user,
        formatdata.productId,
        formatdata.price,
        formatdata.bought_on,
        formatdata.store,
        formatdata.body,
        formatdata.mySelect2,
        formatdata.title,
      ],
      (err, result) => {
        if (err) {
          console.error("Error executing query: " + err.stack);
          res.statusCode = 500;
          res.end("Internal Server Error");
        } else {
          console.log(req.body);
          res.statusCode = 302;
          res.setHeader("Location", "/profile");
          res.end();
        }
      }
    );
  });
};

// Configure multer middleware
const upload = multer();

reviewController.editReviewPut = (req, res) => {
  let user = req.locals.userId;
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    const formatdata = JSON.parse(body);
    console.log(formatdata);
    const query = `
      UPDATE reviews
      SET
          user_id = $1,
          product_id = $2,
          price = $3,
          bought_on = $4,
          title = $5,
          store = $6,
          body = $7,
          rating = $8
      WHERE
          id = $9;
    `;

    pool.query(
      query,
      [
        user,
        formatdata.productId,
        formatdata.price,
        formatdata.bought_on,
        formatdata.title,
        formatdata.store,
        formatdata.body,
        formatdata.mySelect2,
        formatdata.id,
      ],
      (err, result) => {
        if (err) {
          console.error("Error executing query: " + err.stack);
          res.statusCode = 500;
          res.end("Internal Server Error");
        } else {
          res.statusCode = 302;
          res.setHeader("Location", "/profile");
          res.end();
        }
      }
    );
  });
};

module.exports = reviewController;
