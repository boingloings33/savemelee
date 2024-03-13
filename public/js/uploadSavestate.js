import axios from "axios";
import { showAlert } from "./alert";

export const uploadSavestate = async (formData) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/savestates",
      data: formData,
    });

    if (res.data.status === "success") {
      showAlert("success", "Savestate uploaded successfully!");
      window.setTimeout(() => {
        location.assign("/upload-savestate");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
