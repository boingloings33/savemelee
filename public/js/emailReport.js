import axios from "axios";
import { showAlert } from "./alert";

export const emailReport = async (savestateId, reportValue, character, savestateName) => {
  try {
    const res = await axios({
      method: "POST",
      url: "https://formspree.io/f/mayrbbew",
      data: {
        savestateId,
        savestateName,
        character,
        reportValue,
      },
    });

    if (res.status === 200) {
      showAlert("success", "Report Submitted!");
      window.setTimeout(() => {
        location.assign(`/character/${character}/1`);
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err);
  }
};
