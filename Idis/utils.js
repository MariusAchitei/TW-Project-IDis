const fs = require("fs");
const mime = require("mime");
const path = require("path");

let Utils = {};

// Utils.use() = (req, res, next) => {
//     next(req, res);
// }

Utils.get = (targetUrl, req, res, next) => {
  let { method, url } = req;
  if (method === "GET" && url === targetUrl) next(req, res);
};

Utils.post = (targetUrl, req, res, next) => {
  let { method, url } = req;
  if (method === "POST" && url === targetUrl) next(req, res);
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

Utils.redirect = (redirectedMethod, redirectedUrl, targetUrl, req, res) => {
  let { methodFrom, urlFrom } = req;
  console.log(`Vin de la ${methodFrom} ${urlFrom}`);
  console.log(`Redirectez la ${redirectedMethod} ${redirectedUrl}`);
  if (methodFrom === redirectedMethod && urlFrom === redirectedUrl) {
    console.log("Redirecting to", targetUrl);
    res.writeHead(302, {
      Location: targetUrl,
    });
    res.end();
  }
};

module.exports = Utils;
