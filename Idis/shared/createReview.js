const urlParams = new URLSearchParams(window.location.search);
const product = urlParams.get("product");
console.log("+++++");
console.log(product);
console.log("+++++");
if (product != null) {
  fetch(`http://127.0.0.1:3000/api/products/${product}`)
    .then((response) => response.json())
    .then((productFetched) => {
      let productId = document.getElementById("productId");
      let option = document.createElement("option");
      option.value = productFetched.id;
      option.text = productFetched.name;
      option.setAttribute("selected", true);
      productId.appendChild(option);
      console.log(productFetched);
    })
    .catch((error) => {
      // Handle any errors
      console.error(error);
    });
} else {
  fetch("http://127.0.0.1:3000/api/products")
    .then((response) => response.json())
    .then((data) => {
      let productId = document.getElementById("productId");
      data.forEach((element) => {
        let option = document.createElement("option");
        option.value = element.id;
        option.text = element.name;
        productId.appendChild(option);
      });
      console.log(data);
    })
    .catch((error) => {
      // Handle any errors
      console.error(error);
    });
}
