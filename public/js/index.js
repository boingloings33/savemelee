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
const updatePasswordForm = document.querySelector(".update__password__form");
const loginForm = document.getElementById("login__form");
const signupForm = document.getElementById("signup__form");
const deleteAccountForm = document.querySelector(".delete__account__form");
const logOutBtn = document.querySelector(".logout__btn");

const savestateByUserPage = document.querySelector(
  ".savestate__by__user__page"
);

if (homePage) {
  const sheikBox = document.querySelectorAll(".character__box")[15];
  sheikBox.className = "character__box zindex";
  const zeldaImg = document.createElement("img");
  zeldaImg.setAttribute("src", "/img/character-icons-hd/zelda.webp");
  zeldaImg.className = "character__icon zelda__icon";
  const zeldaBox = document.createElement("a");
  zeldaBox.href = "/character/zelda/1";
  zeldaBox.className = "character__box zelda__box zindex hidden";

  zeldaBox.appendChild(zeldaImg);
  sheikBox.appendChild(zeldaBox);

  sheikBox.addEventListener("mouseenter", () => {
    zeldaBox.classList.remove("hidden");
  });

  sheikBox.addEventListener("click", () => {
    zeldaBox.classList.add("hidden");
  });

  sheikBox.addEventListener("mouseleave", () => {
    zeldaBox.classList.add("hidden");
  });

  const characterImg = document.querySelectorAll(".character__icon");
  const homeTitle = document.querySelector(".home__title");
  const homeSubtitle = document.querySelector(".home__subtitle");
  const uploadButton = document.querySelector(".upload__btn");
  homeTitle.classList.add("fastFade");
  if (homeSubtitle) {
    setTimeout(() => {
      homeSubtitle.classList.add("fade");
    }, 200);
  }
  if (uploadButton) {
    uploadButton.classList.add("fade");
  }
  window.addEventListener("load", () => {
    function imgLoadDelay(array, callback, delay) {
      let i = 0;
      let interval = setInterval(() => {
        callback(array[i], i, array);
        if (i++ === array.length) clearInterval(interval);
      }, delay);
    }
    imgLoadDelay(
      characterImg,
      (img) => {
        if (img) {
          img.classList.add("fade");
        }
      },
      10
    );
  });
}
if (characterPage) {
  let reportedSavestate = "";
  const reportButton = document.querySelectorAll(".report__btn");
  const reportDialog = document.querySelector(".report__dialog");
  const reportForm = document.querySelector(".report__form");
  const closeIcon = document.querySelector(".close__icon");
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
  reportButton.forEach((btn) => {
    btn.addEventListener("click", () => {
      reportDialog.showModal();
      reportForm.reset();
      reportDialog.returnValue = "none";
      reportedSavestate = btn.dataset.token;
    });
  });
  reportForm.addEventListener("submit", () => {
    emailReport(reportedSavestate, reportForm.report.value, characterToken);
  });
  closeIcon.addEventListener("click", () => {
    reportDialog.close();
  });
}

if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password__confirm").value;
    signup(email, username, password, passwordConfirm);
  });
}

if (loginForm) {
  window.addEventListener("load", () => {
    formSection.classList.add("fastFade");
  });
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
  const accountFormSection = document.querySelector(".account__form__section");
  userDataForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    updateSettings(name, email, "data");
  });
  window.addEventListener("load", () => {
    accountFormSection.classList.add("fastFade");
  });
}
if (updatePasswordForm) {
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
  const descriptionCharactersRemaining = document.getElementById(
    "desc__characters__remaining"
  );
  charactersRemaining.textContent = "0 / 30";
  descriptionCharactersRemaining.textContent = " 0 / 120";

  window.addEventListener("load", () => {
    formSection.classList.add("fastFade");
  });

  files.addEventListener("change", () => {
    if (files.files.length > 0) {
      removeFiles.classList.remove("hidden");
    }
    if (files.files.length > 1) {
      title.value = "";
      title.disabled = true;
      submitButton.classList.remove("unactive__btn");
      charactersRemaining.textContent = "0 / 30";
      charactersRemaining.textContent = ` ${title.value.length} / 30`;
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
    charactersRemaining.textContent = ` ${title.value.length} / 30`;
  });
  description.addEventListener("input", () => {
    descriptionCharactersRemaining.textContent = ` ${description.value.length} / 60`;
  });
  removeFiles.addEventListener("click", () => {
    files.value = "";
    title.disabled = false;
    removeFiles.classList.add("hidden");
    submitButton.classList.add("unactive__btn");
  });

  title.addEventListener("input", () => {
    charactersRemaining.textContent = `${title.value.length} / 30`;
    if (charactersRemaining.textContent[0] !== "0") {
      submitButton.classList.remove("unactive__btn");
    }
    if (charactersRemaining.textContent[0] === "0") {
      submitButton.classList.add("unactive__btn");
    }
  });
}

if (deleteAccountForm) {
  deleteAccountForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = document.getElementById("delete__account__input").value;
    const userId = document.querySelector(".delete__account__form").dataset
      .token;

    await deleteAccount(input, userId);
    document.getElementById("delete-account-input").value = "";
  });
}

if (savestateByUserPage) {
  const title = document.getElementById("savestate__title");
  const description = document.getElementById("savestate__description");
  const charactersRemaining = document.getElementById("characters__remaining");
  const descriptionCharactersRemaining = document.getElementById(
    "desc__characters__remaining"
  );
  const deleteButton = document.querySelectorAll(".delete__btn");
  const shareButton = document.querySelectorAll(".share__btn");
  const editButton = document.querySelectorAll(".edit__btn");
  const updateDialog = document.querySelector(".update__dialog");
  const updateForm = document.querySelector(".update__form");
  const closeIcon = document.querySelector(".close__icon");
  const protocol = location.protocol + "//" + location.host;
  const submitButton = document.querySelector(".dialog__submit");
  let selectedSavestate = "";
  let rowIndex = "";

  charactersRemaining.textContent = "0 / 30";
  descriptionCharactersRemaining.textContent = " 0 / 120";

  title.addEventListener("input", () => {
    charactersRemaining.textContent = `${title.value.length} / 30`;
    if (charactersRemaining.textContent[0] !== "0") {
      submitButton.classList.remove("unactive__btn");
    }
    if (charactersRemaining.textContent[0] === "0") {
      submitButton.classList.add("unactive__btn");
    }
  });

  description.addEventListener("input", () => {
    descriptionCharactersRemaining.textContent = `${description.value.length} / 60`;
  });

  shareButton.forEach((btn) => {
    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(
        `${protocol}/share-savestate/${btn.dataset.token}`
      );
      showAlert("success", "Link added to the clipboard!");
    });
  });

  deleteButton.forEach((btn, i) => {
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
  closeIcon.addEventListener("click", () => {
    updateDialog.close();
  });
}

reportBug.addEventListener("click", () => {
  navigator.clipboard.writeText(`savemeleegg@gmail.com`);
  showAlert("success", "Email Link added to the clipboard!");
});
