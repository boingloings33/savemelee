import { login, logout } from "./login";
import { signup } from "./signup";
import { updateSettings } from "./updateSetting";
import { uploadSavestate } from "./uploadSavestate";
import { deleteAccount } from "./deleteAccount";
import { showAlert } from "./alert";
import { deleteSavestate } from "./deleteSavestate";
import { emailReport } from "./emailReport";
import { updateSavestate } from "./updateSavestate";

const reportBug = document.querySelector(".report__bug");
const homePage = document.querySelector(".home__page");
const characterPage = document.querySelector(".character__page");
const uploadSavestatePage = document.querySelector(".upload__savestate__page");
const userDataForm = document.querySelector(".user__data__form");
const loginForm = document.getElementById("login__form");
const signupForm = document.getElementById("signup__form");
const deleteAccountForm = document.querySelector(".delete__account__form");
const logOutBtn = document.querySelector(".logout__btn");
const savestateByUserPage = document.querySelector(".savestate__by__user__page");

if (homePage) {
  const sheikBox = document.querySelectorAll(".character__box")[15];
  sheikBox.className = "character__box zindex";
  const zeldaImg = Object.assign(document.createElement("img"), {
    src: "/img/character-icons-hd/zelda.webp",
    className: "character__icon zelda__icon",
  });
  const zeldaBox = Object.assign(document.createElement("a"), {
    href: "/character/zelda/1",
    className: "character__box zelda__box zindex hidden",
  });
  zeldaBox.appendChild(zeldaImg);
  sheikBox.appendChild(zeldaBox);

  sheikBox.addEventListener("mouseenter", () => zeldaBox.classList.remove("hidden"));
  sheikBox.addEventListener("click", () => zeldaBox.classList.add("hidden"));
  sheikBox.addEventListener("mouseleave", () => zeldaBox.classList.add("hidden"));

  const characterImg = document.querySelectorAll(".character__icon");
  const characterBox = document.querySelectorAll(".character__box");
  const homeTitle = document.querySelector(".home__title");
  const homeSubtitle = document.querySelector(".home__subtitle");
  const uploadButton = document.querySelector(".upload__btn");

  homeTitle.classList.add("fastFade");
  if (homeSubtitle) setTimeout(() => homeSubtitle.classList.add("fade"), 200);
  if (uploadButton) uploadButton.classList.add("fade");

  window.addEventListener("load", () => {
    function imgLoadDelay(array, callback, delay) {
      let i = 0;
      const interval = setInterval(() => {
        callback(array[i], i, array);
        if (i++ === array.length) clearInterval(interval);
      }, delay);
    }
    imgLoadDelay(characterImg, (img) => img?.classList.add("fade"), 0.2);
    imgLoadDelay(characterBox, (box) => box?.classList.add("fade"), 0.2);
  });
}

if (characterPage) {
  let reportedSavestate = "";
  let savestateTitle = "";
  const username = document.querySelectorAll(".username");
  const reportButton = document.querySelectorAll(".report__btn");
  const reportDialog = document.querySelector(".report__dialog");
  const reportForm = document.querySelector(".report__form");
  const closeIcon = document.querySelector(".close__icon");
  const shareButton = document.querySelectorAll(".share__btn");
  const deleteButton = document.querySelectorAll(".delete__btn");
  const protocol = `${location.protocol}//${location.host}`;
  const characterToken = document.querySelector(".character__token").dataset.token;

  username.forEach((name) => {
    if (name.textContent.length > 8) name.textContent = `${name.textContent.slice(0, 10)}...`;
  });

  shareButton.forEach((btn) => {
    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(`${protocol}/share-savestate/${btn.dataset.token}`);
      showAlert("success", "Link added to the clipboard!");
    });
  });

  reportButton.forEach((btn) => {
    btn.addEventListener("click", () => {
      reportDialog.showModal();
      reportForm.reset();
      reportDialog.returnValue = "none";
      reportedSavestate = btn.dataset.token;
      savestateTitle = btn.dataset.title;
    });
  });

  deleteButton?.forEach((btn) => {
    btn.addEventListener("click", () => deleteSavestate(btn.dataset.token));
  });

  reportForm.addEventListener("submit", () => {
    emailReport(reportedSavestate, reportForm.report.value, characterToken, savestateTitle);
  });

  closeIcon.addEventListener("click", () => reportDialog.close());
}

if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    signup(
      document.getElementById("email").value,
      document.getElementById("username").value,
      document.getElementById("password").value,
      document.getElementById("password__confirm").value
    );
  });
}

if (loginForm) {
  const formSection = document.querySelector(".form__section");
  window.addEventListener("load", () => formSection.classList.add("fastFade"));
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    login(document.getElementById("email").value, document.getElementById("password").value);
  });
}

if (userDataForm) {
  const accountFormSection = document.querySelector(".account__form__section");
  const updatePasswordForm = document.querySelector(".update__password__form");
  userDataForm.addEventListener("submit", (e) => {
    e.preventDefault();
    updateSettings(document.getElementById("name").value, document.getElementById("email").value, "data");
  });
  window.addEventListener("load", () => accountFormSection.classList.add("fastFade"));
}

if (uploadSavestatePage) {
  const submitButton = document.querySelector(".btn");
  const savestateForm = document.querySelector(".form");
  const files = document.getElementById("file");
  const title = document.getElementById("savestate__title");
  const description = document.getElementById("savestate__description");
  const removeFiles = document.querySelector(".remove__files");
  const formSection = document.querySelector(".form__section");
  const charactersRemaining = document.getElementById("characters__remaining");
  const descriptionCharactersRemaining = document.getElementById("desc__characters__remaining");

  charactersRemaining.textContent = "0 / 30";
  descriptionCharactersRemaining.textContent = " 0 / 120";

  window.addEventListener("load", () => formSection.classList.add("fastFade"));

  files.addEventListener("change", () => {
    if (files.files.length > 0) removeFiles.classList.remove("hidden");
    if (files.files.length > 1) {
      title.value = "";
      title.disabled = true;
      submitButton.classList.remove("unactive__btn");
      charactersRemaining.textContent = `0 / 30`;
    }
  });

  savestateForm.addEventListener("submit", (e) => {
    e.preventDefault();
    Array.from(files.files).forEach((file) => {
      const form = new FormData();
      form.append("character", document.getElementById("characters").value);
      form.append("characterAgainst", document.getElementById("character__against").value);
      form.append("user", document.querySelector(".user__id").dataset.token);
      form.append("title", files.files.length === 1 ? title.value : file.name);
      form.append("description", description.value);
      form.append("file", file);
      uploadSavestate(form);
    });
    title.value = "";
    description.value = "";
    files.value = "";
    charactersRemaining.textContent = "0 / 30";
    descriptionCharactersRemaining.textContent = " 0 / 60";
    title.disabled = false;
    removeFiles.classList.add("hidden");
  });

  title.addEventListener("input", () => {
    charactersRemaining.textContent = `${title.value.length} / 30`;
    submitButton.classList.toggle("unactive__btn", title.value.length === 0);
  });

  description.addEventListener("input", () => {
    descriptionCharactersRemaining.textContent = `${description.value.length} / 60`;
  });

  removeFiles.addEventListener("click", () => {
    files.value = "";
    title.disabled = false;
    removeFiles.classList.add("hidden");
    submitButton.classList.add("unactive__btn");
  });
}

if (deleteAccountForm) {
  deleteAccountForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await deleteAccount(document.getElementById("delete__account__input").value, deleteAccountForm.dataset.token);
    document.getElementById("delete-account-input").value = "";
  });
}

if (savestateByUserPage) {
  const title = document.getElementById("savestate__title");
  const description = document.getElementById("savestate__description");
  const charactersRemaining = document.getElementById("characters__remaining");
  const descriptionCharactersRemaining = document.getElementById("desc__characters__remaining");
  const deleteButton = document.querySelectorAll(".delete__btn");
  const shareButton = document.querySelectorAll(".share__btn");
  const editButton = document.querySelectorAll(".edit__btn");
  const updateDialog = document.querySelector(".update__dialog");
  const updateForm = document.querySelector(".update__form");
  const closeIcon = document.querySelector(".close__icon");
  const protocol = `${location.protocol}//${location.host}`;
  const submitButton = document.querySelector(".dialog__submit");

  let selectedSavestate = "";
  let rowIndex = "";

  charactersRemaining.textContent = "0 / 30";
  descriptionCharactersRemaining.textContent = " 0 / 120";

  title.addEventListener("input", () => {
    charactersRemaining.textContent = `${title.value.length} / 30`;
    submitButton.classList.toggle("unactive__btn", title.value.length === 0);
  });

  description.addEventListener("input", () => {
    descriptionCharactersRemaining.textContent = `${description.value.length} / 60`;
  });

  shareButton.forEach((btn) => {
    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(`${protocol}/share-savestate/${btn.dataset.token}`);
      showAlert("success", "Link added to the clipboard!");
    });
  });

  deleteButton.forEach((btn) => {
    btn.addEventListener("click", () => {
      deleteSavestate(btn.dataset.token);
    });
  });

  editButton.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      rowIndex = i;
      updateDialog.showModal();
      updateForm.reset();
      updateDialog.returnValue = "none";
      selectedSavestate = btn.dataset.token;
    });
  });

  updateForm.addEventListener("submit", () => {
    const data = {
      character: updateForm.characters.value,
      characterAgainst: updateForm.character__against.value,
      title: updateForm.title.value,
      description: updateForm.description.value,
    };
    updateSavestate(data, selectedSavestate, rowIndex);
  });

  closeIcon.addEventListener("click", () => updateDialog.close());
}

logOutBtn?.addEventListener("click", logout);

reportBug?.addEventListener("click", () => {
  navigator.clipboard.writeText(`savemeleegg@gmail.com`);
  showAlert("success", "Email Link added to the clipboard!");
});
