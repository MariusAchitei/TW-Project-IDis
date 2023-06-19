const fs = require("fs");
const Utils = require("../utils");
const pool = require("../dbConnection");
const Users = require("../models/Users");
const Reviews = require("../models/Review");
const {
  reviewComponent,
  starComponent,
} = require("../views/components/review");

// const requireAuthentication = require("../middleware").requireAuthentication;

let profileController = {};

profileController.profileGet = async (req, res) => {
  let user = await Users.getById(req.locals.userId);
  let reviews = await Reviews.getByUserId(req.locals.userId);
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

  fs.readFile("views/profile.html", "utf8", (err, data) => {
    if (user === null) {
      console.error("Error reading profile.html", err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    } else {
      let profilePage = data
        .replace("{{username}}", user.username)
        .replace("{{borndate}}", user.born_date)
        .replace("{{city}}", user.city)
        .replace("{{country}}", user.country)
        .replace("{{username}}", user.username)
        .replace("{{profile}}", user.profile)
        .replace(
          "{{#each_review}}",
          reviews?.reduce((acc, review) => acc + review, "")
        );

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(profilePage);
      // return;
    }
  });
};

module.exports = profileController;
