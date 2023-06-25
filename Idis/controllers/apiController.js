const Reviews = require("../models/Review");
const Products = require("../models/Products");
const Users = require("../models/Users");

let apiController = {};

apiController.getReviews = async (req, res) => {
  const id = req.url.split("/")[3];
  let reviews = await Reviews.getByProductId(id);
  res.end(JSON.stringify(reviews));
};
apiController.getReview = async (req, res) => {
  const id = req.url.split("/")[3];
  let review = await Reviews.getById(id);
  res.end(JSON.stringify(review));
};
apiController.deleteReview = async (req, res) => {
  const oldId = req.url.split("/")[2];
  const id = oldId.slice(0, -1);
  await Reviews.deleteById(id);
  res.writeHead(302, {
    Location: "/profile",
  });
  res.end();
};
apiController.getUser = async (req, res) => {
  const id = req.url.split("/")[3];
  const user = await Users.getById(id);
  res.end(JSON.stringify(user));
};
apiController.getProducts = async (req, res) => {
  const products = await Products.getAll();
  res.end(JSON.stringify(products));
};
apiController.getProduct = async (req, res) => {
  const id = req.url.split("/")[3];
  const product = await Products.getById(id);
  res.end(JSON.stringify(product));
};
module.exports = apiController;
