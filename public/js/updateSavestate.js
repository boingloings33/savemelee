import axios from "axios";
import { showAlert } from "./alert";

export const updateSavestate = async (formData) => {
  try {
    console.log('updated');
    const res = await axios({
      method: "PATCH",
      url: "/api/v1/savestates",
      data: formData,
    });

    if (res.data.status === "success") {
      showAlert("success", "Savestate uploaded successfully!");
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};