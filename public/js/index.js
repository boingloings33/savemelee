import { login, logout } from "./login";

const characterPage = document.querySelector(".character__page");
const loginForm = document.getElementById("login__form");
const nextButton = document.querySelector(".page__btn__next");
const prevButton = document.querySelector(".page__btn__prev");
const uploadSavestateImg = document.getElementById("upload__savestate");
const homePage = document.querySelector(".home__page");
const logOutBtn = document.querySelector(".logout__btn");

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
  const characterToken =
    document.querySelector(".character__token").dataset.token;
  const savesateAmountToken = Number(
    document.querySelector(".savestate__amount__token").dataset.token
  );
  let savestateRowAmount = document.querySelectorAll("tr.savestate_row").length;

  if (
    savestateRowAmount < 20 ||
    savestateRowAmount * currentUrlPage === savesateAmountToken
  ) {
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

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener("click", logout);
}
