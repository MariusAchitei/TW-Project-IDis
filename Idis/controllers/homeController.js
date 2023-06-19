const Utils = require("../utils.js");
const Reviews = require("../models/Review");
const Users = require("../models/Users");
const fs = require("fs");
const {
  reviewComponent,
  starComponent,
} = require("../views/components/review");

let homeController = {};

homeController.homeGet = async (req, res) => {
  let user = await Users.getById(req.locals.userId);
  let reviews = await Reviews.getAll();
  reviews = reviews?.map((review) =>
    reviewComponent
      .replace("{{title}}", review.title)
      .replace("{{body}}", review.body)
      .replace("{{price}}", review.price)
      .replace("{{store}}", review.store)
      .replace("{{bought_on}}", review.bought_on)
      .replace("{{username}}", review.username)
      .replace("{{profile}}", review.profile)
      .replace("{{name}}", review.name)
      .replace("{{photo}}", review.photo)
      .replace("{{star}}", starComponent.repeat(review.rating))
  );

  fs.readFile("views/index.html", "utf8", (err, data) => {
    if (data === null) {
      console.error("Error reading index.html", err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    } else {
      let homePage = data
        .replace("{{username}}", user.username)
        // .replace("{{borndate}}", user.born_date)
        // .replace("{{city}}", user.city)
        // .replace("{{country}}", user.country)
        // .replace("{{username}}", user.username)
        .replace("{{profile}}", user.profile)
        .replace(
          "{{#each_review}}",
          reviews?.reduce((acc, review) => acc + review, "")
        );

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(homePage);
      // return;
    }
  });
  //   Utils.sendResources(req, res, "/views/index.html");
};

module.exports = homeController;
