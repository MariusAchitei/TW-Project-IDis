const jwt = require("jsonwebtoken");
const Utils = require("./utils");
require("dotenv").config();

function requireAuthentication(req, res, next) {
  //   console.log("requireAuthentication");
  //   console.log(req.session);
  //   console.log(req.url);
  //   if (
  //     (req.url === "/views/index.html" ||
  //       req.url === "/views/profile.html" ||
  //       req.url === "/views/createReview.html" ||
  //       req.url === "/views/product.html") &&
  //     !req.session.user
  //   ) {
  //     res.statusCode = 401;
  //     res.end("Unauthorized");
  //   } else {
  //     next();
  //   }

  //   if (req.url === "/validate-token") {
  const token = req.headers.cookie?.replace("token=", "") || "";
  console.log("TOOOOOOOOOOOOOOKEN");
  console.log(token);

  if (!token) {
    console.log("NO TOKEN");
    Utils.redirectTo("/login", res);
    // res.writeHead(401, { "Content-Type": "application/json" });
    // res.end(
    //   JSON.stringify({
    //     success: false,
    //     message: "Unauthorized: Token not found",
    //   })
    // );
    return;
  }

  try {
    let decodedToken;

    jwt.verify(token, process.env.JWT_KEY, (err, tokenUser) => {
      if (err) {
        res.setHeader("Set-Cookie", "token=; Max-Age=0");
        Utils.redirectTo("/login", res);
        // res.writeHead(401, { "Content-Type": "application/json" });
        // res.end(
        //   JSON.stringify({
        //     success: false,
        //     message: "Unauthorized: Bad token",
        //   })
        // );
        return;
      }
      decodedToken = { id: tokenUser.id };
    });

    if (!decodedToken.id) {
      res.setHeader("Set-Cookie", "token=; Max-Age=0");
      Utils.redirectTo("/login", res);
      // res.writeHead(401, { "Content-Type": "application/json" });
      // res.end(
      //   JSON.stringify({
      //     success: false,
      //     message: "Unauthorized: User not found",
      //   })
      // );
      return;
    }

    // Set the userId in locals for further processing
    console.log("DECODED TOKEN");
    console.log(decodedToken.id);
    req.locals = { userId: decodedToken.id };
    // Continue to the next middleware or route handler
    // Call the appropriate handler or return a response here
  } catch (err) {
    console.log("CATCH");
    console.log(err);
    res.setHeader("Set-Cookie", "token=; Max-Age=0");
    Utils.redirectTo("/login", res);
    // res.writeHead(401, { "Content-Type": "application/json" });
    // return res.end(
    //   JSON.stringify({
    //     success: false,
    //     message: "Unauthorized: Token not found",
    //   })
    // );
  }
  //   }
  next(req, res);
}

module.exports = { requireAuthentication };
