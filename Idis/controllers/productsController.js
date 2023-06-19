const Products = require("../models/Products");
const Reviews = require("../models/Review");
const fs = require("fs");
const {
  reviewComponent,
  starComponent,
} = require("../views/components/review");

let productsController = {};

productsController.productGet = async (req, res) => {
  const id = req.url.split("/")[2];
  const product = await Products.getById(id);
  let reviews = await Reviews.getByProductId(id);

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

  fs.readFile("views/product.html", "utf8", (err, data) => {
    if (product === null) {
      console.error("Error reading product.html", err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    } else {
      let productPage = data.replace(
        "{{interest_name}}",
        product.interest_name
      );
      productPage = productPage.replace("{{photo}}", product.photo);
      productPage = productPage.replace("{{name}}", product.name);
      productPage = productPage.replace("{{description}}", product.description);
      productPage = productPage.replace("{{price}}", product.price);
      productPage = productPage.replace(
        "{{#each_review}}",
        reviews?.reduce((acc, review) => acc + review, "")
      );
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(productPage);

      // return;
    }
  });
};

module.exports = productsController;
