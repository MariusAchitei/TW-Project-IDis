const Products = require("../models/Products");
const Reviews = require("../models/Review");
const fs = require("fs");
const {
  addReviewComponent,
  starComponent,
} = require("../views/components/review");

let productsController = {};

productsController.productGet = async (req, res) => {
  const id = req.url.split("/")[2];
  const product = await Products.getById(id);
  let reviews = await Reviews.getByProductId(id);

  let average = reviews
    ? reviews?.reduce((acc, review) => acc + review.rating, 0) / reviews?.length
    : 0;

  let reviewsComponents = reviews?.map((review) =>
    review ? addReviewComponent(review) : ""
  );

  fs.readFile("views/product.html", "utf8", (err, data) => {
    if (product === null) {
      console.error("Error reading product.html", err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    } else {
      let productPage = data
        .replace("{{interest_name}}", product.interest_name)
        .replace("{{photo}}", product.photo)
        .replace("{{name}}", product.name)
        .replace("{{description}}", product.description)
        .replace("{{price}}", product.price)
        .replace("{{average}}", average.toFixed(2))
        .replace("{{totalReviews}}", reviews.length)
        .replace("{{productId}}", id)
        .replace("{{#avgStars}}", starComponent.repeat(Math.round(average)))
        .replace("{{#avgStars}}", starComponent.repeat(Math.round(average)))
        .replace(
          "{{oneStar}}",
          reviews.filter((review) => review.rating === 1).length
        )
        .replace(
          "{{twoStar}}",
          reviews.filter((review) => review.rating === 2).length
        )
        .replace(
          "{{threeStar}}",
          reviews.filter((review) => review.rating === 3).length
        )
        .replace(
          "{{fourStar}}",
          reviews.filter((review) => review.rating === 4).length
        )
        .replace(
          "{{fiveStar}}",
          reviews.filter((review) => review.rating === 5).length
        )
        .replace(
          "{{#each_review}}",
          reviewsComponents?.reduce((acc, review) => acc + review, "")
        );
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(productPage);

      // return;
    }
  });
};

module.exports = productsController;
