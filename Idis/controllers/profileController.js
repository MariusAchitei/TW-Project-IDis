const fs = require("fs");
const Utils = require("../utils");
// const requireAuthentication = require("../middleware").requireAuthentication;

let profileController = {};

profileController.profileGet = (req, res) => {
  Utils.sendResources(req, res, "/views/profile.html");

  //   fs.readFile("views/profile.html", "utf8", (err, data) => {
  //     if (err) {
  //       console.error("Error reading profile.html", err);
  //       res.writeHead(500, { "Content-Type": "text/plain" });
  //       res.end("Internal Server Error");
  //     } else {
  //       let profilePage = data.replace("{{username}}", user.username);
  //       profilePage = profilePage.replace("{{borndate}}", user.born_date);
  //       profilePage = profilePage.replace("{{city}}", user.city);
  //       profilePage = profilePage.replace("{{country}}", user.country);
  //       profilePage = profilePage.replace("{{username}}", user.username);
  //       profilePage = profilePage.replace("{{username}}", user.username);
  //       res.writeHead(200, { "Content-Type": "text/html" });
  //       res.end(profilePage);
  //       // return;
  //     }
  //   });
};

module.exports = profileController;
