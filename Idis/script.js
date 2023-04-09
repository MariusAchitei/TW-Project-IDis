const menuItem = document.querySelectorAll(".menu-item");

const removeActive = () => {
  menuItem.forEach((item) => {
    item.classList.remove("active");
  });
};

menuItem.forEach((item) => {
  item.addEventListener("click", () => {
    removeActive();
    item.classList.add("active");

    if (item.id != "notifice") {
      document.querySelector(".notification").style.display = "none";
    } else {
      document.querySelector(".notification").style.display = "block";
      document.querySelector("#notifice .count").style.display = "none";
    }
  });
});

const message = document.querySelector("#message");
const messageBox = document.querySelector("#message-box");

message.addEventListener("click", () => {
  messageBox.classList.add("box-sh");
  message.querySelector(".count").style.display = "none";

  setTimeout(() => {
    messageBox.classList.remove("box-sh");
  }, 2000);
});

const themeMenu = document.querySelector("#themeMenu");
const themBOx = document.querySelector(".theme");

themeMenu.addEventListener("click", () => {
  themBOx.style.display = "grid";
});

window.addEventListener("scroll", () => {
  themBOx.style.display = "none";
  document.querySelector(".notification").style.display = "none";
});

let rateBox = Array.from(document.querySelectorAll(".rate-box"));
let globalValue = document.querySelector(".global-value");
let two = document.querySelector(".two");
let totalReviews = document.querySelector(".total-reviews");
let reviews = {
  5: 0,
  4: 0,
  3: 0,
  2: 0,
  1: 0,
};
updateValues();

function updateValues() {
  rateBox.forEach((box) => {
    let valueBox = rateBox[rateBox.indexOf(box)].querySelector(".value");
    let countBox = rateBox[rateBox.indexOf(box)].querySelector(".count");
    let progress = rateBox[rateBox.indexOf(box)].querySelector(".progress");
    console.log(typeof reviews[valueBox.innerHTML]);
    countBox.innerHTML = nFormat(reviews[valueBox.innerHTML]);

    let progressValue = Math.round(
      (reviews[valueBox.innerHTML] / getTotal(reviews)) * 100
    );
    progress.style.width = `${progressValue}%`;
  });
  totalReviews.innerHTML = getTotal(reviews);
  finalRating();
}
function getTotal(reviews) {
  return Object.values(reviews).reduce((a, b) => a + b);
}

document.querySelectorAll(".value").forEach((element) => {
  element.addEventListener("click", () => {
    let target = element.innerHTML;
    reviews[target] += 1;
    updateValues();
  });
});

function finalRating() {
  let final = Object.entries(reviews)
    .map((val) => val[0] * val[1])
    .reduce((a, b) => a + b);
  // console.log(typeof parseFloat(final / getTotal(reviews)).toFixed(1));
  let ratingValue = nFormat(parseFloat(final / getTotal(reviews)).toFixed(1));
  globalValue.innerHTML = ratingValue;
  two.style.background = `linear-gradient(to right, #66bb6a ${
    (ratingValue / 5) * 100
  }%, transparent 0%)`;
}

function nFormat(number) {
  if (number >= 1000 && number < 1000000) {
    return `${number.toString().slice(0, -3)}k`;
  } else if (number >= 1000000 && number < 1000000000) {
    return `${number.toString().slice(0, -6)}m`;
  } else if (number >= 1000000000) {
    return `${number.toString().slice(0, -9)}md`;
  } else if (number === "NaN") {
    return `0.0`;
  } else {
    return number;
  }
}
