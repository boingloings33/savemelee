(() => {
  // public/js/index.js
  var characterPage = document.querySelector(".character__page");
  var nextButton = document.querySelector(".page__btn__next");
  var prevButton = document.querySelector(".page__btn__prev");
  var uploadSavestateImg = document.getElementById("upload__savestate");
  var homePage = document.querySelector(".home__page");
  if (homePage) {
    uploadSavestateImg.addEventListener("mouseenter", () => {
      uploadSavestateImg.src = "/img/upload-savestate2.svg";
    });
    uploadSavestateImg.addEventListener("mouseleave", () => {
      uploadSavestateImg.src = "/img/upload-savestate1.svg";
    });
  }
  if (characterPage) {
    const currentUrlPage = window.location.href.slice(-1);
    const characterToken = document.querySelector(".character__token").dataset.token;
    const savesateAmountToken = Number(
      document.querySelector(".savestate__amount__token").dataset.token
    );
    let savestateRowAmount = document.querySelectorAll("tr.savestate_row").length;
    if (savestateRowAmount < 20 || savestateRowAmount * currentUrlPage === savesateAmountToken) {
      nextButton.classList.add("unactive");
    }
    if (Number(currentUrlPage) === 1) {
      prevButton.classList.add("unactive");
    }
    nextButton.addEventListener("click", () => {
      nextButton.href = `/character/${characterToken}/${Number(currentUrlPage) + 1}`;
    });
    prevButton.addEventListener("click", () => {
      prevButton.href = `/character/${characterToken}/${Number(currentUrlPage) - 1}`;
    });
  }
})();
