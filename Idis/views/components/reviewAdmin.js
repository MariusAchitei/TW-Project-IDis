let reviewComponent = `
<div class="post-wrap">
    <div class="head">
        <div class="profile-phots">
            <img src="../shared/img/{{profile}}" alt="">
        </div>
        <div class="info">
            <h3>{{username}}</h3>
        </div>
        <a href="/editReview/{{reviewId}}">
            <button class="btn btn-primary new-post">Edit</button>
        </a>
        <form action="/deleteReview/{{reviewId}}" method="DELETE">
            <button class="btn btn-primary new-post">Delete</button>
        </form>
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
    .replaceAll("{{reviewId}}", review.id)
    .replaceAll("{{productId}}", review.product_id)
    .replaceAll("{{title}}", review.title)
    .replaceAll("{{body}}", review.body)
    .replaceAll("{{price}}", review.price)
    .replaceAll("{{store}}", review.store)
    .replaceAll("{{bought_on}}", review.bought_on)
    .replaceAll("{{username}}", review.username)
    .replaceAll("{{profile}}", review.profile)
    .replaceAll("{{name}}", review.name)
    .replaceAll("{{photo}}", review.photo)
    .replaceAll("{{star}}", starComponent.repeat(review.rating));
}

let starComponent = `<img src="../shared/img/star.png" alt="">`;
module.exports = { addReviewComponent, starComponent };
