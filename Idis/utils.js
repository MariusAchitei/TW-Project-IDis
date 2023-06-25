const fs = require("fs");
const mime = require("mime");
const path = require("path");
const crypto = require("crypto");
require("dotenv").config();

let Utils = {};

// Utils.use() = (req, res, next) => {
//     next(req, res);
// }

Utils.get = (targetUrl, req, res, next, second) => {
  let { method, url } = req;
  if (method === "GET" && url === targetUrl) {
    next(req, res);
    return true;
  }
  return false;
};

Utils.post = (targetUrl, req, res, next, second) => {
  let { method, url } = req;
  if (method === "POST" && url === targetUrl) {
    next(req, res);
    return true;
  }
  return false;
};

Utils.sendResources = (req, res, url) => {
  const filePath = path.join(__dirname, url);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error("Error reading file:", filePath);
      res.statusCode = 500;
      res.end("Internal Server ErroR");
    } else {
      res.setHeader("Content-Type", mime.getType(filePath));
      res.end(data);
    }
  });
};

Utils.redirect = (
  methodFrom,
  urlFrom,
  redirectedMethod,
  redirectedUrl,
  targetUrl,
  res
) => {
  if (methodFrom === redirectedMethod && urlFrom === redirectedUrl) {
    res.writeHead(302, {
      Location: targetUrl,
    });
    res.end();
    return true;
  }
  return false;
};

Utils.redirectTo = (targetUrl, res) => {
  res.writeHead(302, {
    Location: targetUrl,
  });
  res.end();
  return true;
};

Utils.hash256 = (str) => {
  // create a sha-256 hasher
  const sha256Hasher = crypto.createHmac("sha256", process.env.APP_SECRET);
  // hash the string
  return sha256Hasher.update(str).digest("hex");
};

module.exports = Utils;
