const Products = require("../models/Products");
const fs = require("fs");

let productsController = {};

productsController.productGet = async (req, res) => {
  const id = req.url.split("/")[2];
  const product = await Products.getById(id);
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
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(productPage);
      // return;
    }
  });
};

module.exports = productsController;
