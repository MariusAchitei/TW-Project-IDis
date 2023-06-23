let reviewComponent = `<div class="post-wrap">
    <div class="head">
        <div class="profile-phots">
            <img src="../shared/img/{{profile}}" alt="">
        </div>
        <div class="info">
            <h3>{{username}}</h3>
        </div>
        <div class="edit">
            <div class="buttons">
    <button class="btn btn-primary new-post">Edit</button>
    <button class="btn btn-primary new-post">Delete</button>
  </div>
        </div>
    </div>
    <a href="/products/{{productId}}">
    <div class="post">
        <div class="product-details">
            <div class="product-name">{{name}}</div>
            <div class="post-photo">
                <img src="../shared/img/{{photo}}" alt="">
            </div>
        </div>
        <div class="review">
            <div class="rating">
                {{star}}
            </div>
            <div class="review-title">
                <span>{{title}}</span>
            </div>
            <div class="review-text">
                <span>{{body}}
                </span>
            </div>
            <div class="separator"></div>
            <div class="price review-detail">Price:<span>{{price}}</span></div>
            <div class="bought-from review-detail">Bought from:<span>{{store}}</span></div>
            <div class="bought-on review-detail">Bought on:<span>{{bought_on}}</span></div>
        </div>
    </div>
    </a>
</div>`;
function addReviewComponent(review) {
  return reviewComponent
    .replace("{{productId}}", review.product_id)
    .replace("{{title}}", review.title)
    .replace("{{body}}", review.body)
    .replace("{{price}}", review.price)
    .replace("{{store}}", review.store)
    .replace("{{bought_on}}", review.bought_on)
    .replace("{{username}}", review.username)
    .replace("{{profile}}", review.profile)
    .replace("{{name}}", review.name)
    .replace("{{photo}}", review.photo)
    .replace("{{star}}", starComponent.repeat(review.rating));
}
let starComponent = `<img src="../shared/img/star.png" alt="">`;
module.exports = { addReviewComponent, starComponent };
