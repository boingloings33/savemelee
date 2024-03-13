import { login, logout } from "./login";
import { signup } from "./signup";
import { updateSettings } from "./updateSetting";
import { uploadSavestate } from "./uploadSavestate";
import { deleteAccount } from "./deleteAccount";
import { showAlert } from "./alert";

const characterPage = document.querySelector(".character__page");
const uploadSavestatePage = document.querySelector(".upload__savestate__page");
const userDataForm = document.querySelector(".user__data__form");
const updatePasswordForm = document.querySelector(".update__password__form");
const loginForm = document.getElementById("login__form");
const signupForm = document.getElementById("signup__form");
const deleteAccountForm = document.querySelector(".delete__account__form");
const logOutBtn = document.querySelector(".logout__btn");
const charactersRemaining = document.getElementById("characters__remaining");
const savestateDescription = document.getElementById("savestate__title");

if (characterPage) {
  // const reportButton = document.querySelectorAll(".report__btn");
  // const reportDialog = document.querySelector(".report__dialog");
  // const reportForm = document.querySelector(".report__form");
  const shareButton = document.querySelectorAll(".share__btn");
  const nextButton = document.querySelector(".page__btn__next");
  const prevButton = document.querySelector(".page__btn__prev");
  const protocol = location.protocol + "//" + location.host;
  const pageCounter = document.querySelector(".page__counter");
  const currentUrlPage = window.location.href.slice(-1);
  const characterToken =
    document.querySelector(".character__token").dataset.token;
  const savesateAmountToken = Number(
    document.querySelector(".savestate__amount__token").dataset.token
  );
  let savestateRowAmount = document.querySelectorAll("tr.savestate_row").length;

  pageCounter.textContent = `${currentUrlPage}/${Math.ceil(savesateAmountToken / 20)}`;

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
  shareButton.forEach((btn) => {
    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(
        `${protocol}/share-savestate/${btn.dataset.token}`
      );
      showAlert("success", "Link added to the clipboard!");
    });
  });
  // reportButton.forEach((btn) => {
  //   btn.addEventListener("click", () => {
  //     reportDialog.showModal();
  //     reportForm.addEventListener("submit", (e) => {
  //       e.preventDefault();
  //       const selectedValue = reportForm.querySelector(
  //         'input[type="radio"]:checked'
  //       ).value;
  //       console.log(selectedValue);
  //       console.log(btn.dataset.token);
  //       reportDialog.close();
  //       showAlert("success", "Report Submitted!");
  //       window.setTimeout(() => {
  //         location.assign(`${protocol}/character/${characterToken}/1`);
  //       }, 1500);
  //     });
  //     reportForm.addEventListener("close", () => {
  //       console.log("closed");
  //     });
  //   });
  // });
}

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
  const savestateForm = document.querySelector(".form");
  const files = document.getElementById("file");
  const title = document.getElementById("savestate__title");
  const removeFiles = document.querySelector(".remove__files");

  files.addEventListener("change", () => {
    if (files.files.length > 0) {
      removeFiles.classList.remove("hidden");
    }
    if (files.files.length > 1) {
      title.value = "";
      title.disabled = true;
      charactersRemaining.textContent = "0 / 30";
      charactersRemaining.textContent = ` ${savestateDescription.value.length} / 30`;
    }
  });
  savestateForm.addEventListener("submit", (e) => {
    e.preventDefault();

    Array.from(files.files).forEach((file, i) => {
      const form = new FormData();
      form.append("character", document.getElementById("characters").value);
      form.append(
        "characterAgainst",
        document.getElementById("character__against").value
      );

      form.append("user", document.querySelector(".user__id").dataset.token);
      if (files.files.length === 1) {
        form.append("title", title.value);
      }
      if (files.files.length > 1) {
        form.append("title", file.name);
      }

      form.append("file", file);
      uploadSavestate(form);
    });
  });
  charactersRemaining.textContent = "0 / 30";
  savestateDescription.addEventListener("input", () => {
    charactersRemaining.textContent = ` ${savestateDescription.value.length} / 30`;
  });
  removeFiles.addEventListener("click", () => {
    files.value = "";
    title.disabled = false;
    removeFiles.classList.add("hidden");
  });
}

if (deleteAccountForm) {
  deleteAccountForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = document.getElementById("delete__account__input").value;

    await deleteAccount(input);
    document.getElementById("delete-account-input").value = "";
  });
}
