function requireAuthentication(req, res, next) {
  if (
    (req.url === "/views/index.html" ||
      req.url === "/views/profile.html" ||
      req.url === "/views/createReview.html" ||
      req.url === "/views/product.html") &&
    !req.session.user
  ) {
    res.statusCode = 401;
    res.end("Unauthorized");
  } else {
    next();
  }
}

module.exports = { requireAuthentication };
