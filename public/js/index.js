import { login, logout } from "./login";
import { signup } from "./signup";
import { updateSettings } from "./updateSetting";
import { uploadSavestate } from "./uploadSavestate";

const characterPage = document.querySelector(".character__page");
const homePage = document.querySelector(".home__page");
const uploadSavestatePage = document.querySelector(".upload__savestate__page");
const userDataForm = document.querySelector(".user__data__form");
const updatePasswordForm = document.querySelector(".update__password__form");
const loginForm = document.getElementById("login__form");
const signupForm = document.getElementById("signup__form");
const nextButton = document.querySelector(".page__btn__next");
const prevButton = document.querySelector(".page__btn__prev");
const uploadSavestateImg = document.getElementById("upload__savestate");
const logOutBtn = document.querySelector(".logout__btn");
const charactersRemaining = document.getElementById("characters__remaining");
const savestateDescription = document.getElementById("savestate__title");

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

// if (accountPage) {
// }

if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("test");
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password__confirm").value;
    console.log(email);
    signup(email, username, password, passwordConfirm);
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

if (userDataForm) {
  userDataForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    updateSettings(name, email, "data");
  });
}
if (updatePasswordForm) {
}

if (uploadSavestatePage) {
  const form = document.querySelector(".form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("character", document.getElementById("characters").value);
    form.append("stage", document.getElementById("stages").value);
    form.append("user", document.querySelector(".user__id").dataset.token);
    form.append("title", document.getElementById("savestate__title").value);
    form.append("file", document.getElementById("file").files[0]);
    uploadSavestate(form);
  });

  charactersRemaining.textContent = "0 / 20";
  savestateDescription.addEventListener("input", () => {
    charactersRemaining.textContent = ` ${savestateDescription.value.length} / 20`;
  });
}
