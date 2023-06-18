const Utils = require("../utils.js");

let homeController = {};

homeController.homeGet = (req, res) => {
  Utils.sendResources(req, res, "/views/index.html");
};

module.exports = homeController;
