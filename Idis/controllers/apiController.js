const Reviews = require("../models/Review");
const Products = require("../models/Products");

let apiController = {};

apiController.getReviews = async (req, res) => {
  const id = req.url.split("/")[3];
  let reviews = await Reviews.getByProductId(id);
  res.end(JSON.stringify(reviews));
};
apiController.getProducts = async (req, res) => {
  const products = await Products.getAll();
  res.end(JSON.stringify(products));
};
module.exports = apiController;
