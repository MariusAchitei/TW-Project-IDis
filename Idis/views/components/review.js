let reviewComponent = `<div class="post-wrap">
    <div class="head">
        <div class="profile-phots">
            <img src="../shared/img/{{profile}}" alt="">
        </div>
        <div class="info">
            <h3>{{username}}</h3>
        </div>
        <span class="edit">
            <img src="../shared/icon/three-dots.svg" class="icon1">
        </span>
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
let starComponent = `<img src="../shared/img/star.png" alt="">`;
module.exports = { reviewComponent, starComponent };
