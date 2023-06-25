const fs = require("fs");
const Utils = require("../utils");
const pool = require("../dbConnection");
const Users = require("../models/Users");
const Reviews = require("../models/Review");
const {
  addReviewComponent,
  starComponent,
} = require("../views/components/reviewAdmin");

// const requireAuthentication = require("../middleware").requireAuthentication;

let profileController = {};

profileController.profileGet = async (req, res) => {
  let user = await Users.getById(req.locals.userId);
  let reviews = await Reviews.getByUserId(req.locals.userId);

  let reviewComponents = reviews?.map((review) =>
    review ? addReviewComponent(review) : ""
  );

  fs.readFile("views/profile.html", "utf8", (err, data) => {
    if (user === null) {
      console.error("Error reading profile.html", err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    } else {
      let profilePage = data
        .replace("{{userId}}", req.locals.userId)
        .replace("{{username}}", user.username)
        .replace("{{borndate}}", user.born_date)
        .replace("{{city}}", user.city)
        .replace("{{country}}", user.country)
        .replace("{{username}}", user.username)
        .replace("{{profile}}", user.profile)
        .replace("{{profile}}", user.profile)
        .replace(
          "{{#each_review}}",
          reviewComponents?.reduce((acc, review) => acc + review, "")
        );

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(profilePage);
      // return;
    }
  });
};

module.exports = profileController;
