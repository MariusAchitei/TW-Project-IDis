const Utils = require("../utils.js");

let homeController = {};

homeController.homeGet = (req, res) => {
  Utils.sendResources(req, res, "/views/index.html");
};
homeController.createReviewGet = (req, res) => {
  Utils.sendResources(req, res, "/views/createReview.html");
};

module.exports = homeController;
