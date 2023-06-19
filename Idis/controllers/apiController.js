const Reviews = require("../models/Review");

let apiController = {};

apiController.getReviews = async (req, res) => {
  const id = req.url.split("/")[3];
  let reviews = await Reviews.getByProductId(id);
  res.end(JSON.stringify(reviews));
};
module.exports = apiController;
