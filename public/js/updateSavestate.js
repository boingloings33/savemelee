import axios from "axios";
import { showAlert } from "./alert";

export const updateSavestate = async (formData, savestateId, rowIndex) => {
  let charAs = document.querySelectorAll(".character__as")[rowIndex];
  let charAgainst = document.querySelectorAll(".character__against")[rowIndex];
  let title = document.querySelectorAll(".savestate__title")[rowIndex];
  let desc = document.querySelectorAll(".savestate__description")[rowIndex];

  try {
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/savestates/${savestateId}`,
      data: formData,
    });

    if (res.data.status === "success") {
      showAlert("success", "Savestate updated successfully!");
      charAs.textContent =
        formData.character[0].toUpperCase() +
        formData.character
          .slice(1)
          .toLowerCase()
          .replaceAll("-", " ")
          .replaceAll("_", "/");
      charAgainst.textContent =
        formData.characterAgainst[0].toUpperCase() +
        formData.characterAgainst
          .slice(1)
          .toLowerCase()
          .replaceAll("-", " ")
          .replaceAll("_", "/");
      title.textContent = formData.title;
      desc.textContent = formData.description;
    }
  } catch (err) {
    showAlert("error", err);
  }
};
