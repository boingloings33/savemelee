import axios from "axios";
import { showAlert } from "./alert";

export const deleteSavestate = async (savesataeId, userId) => {
  {
    try {
      await axios({
        method: "DELETE",
        url: `/api/v1/savestates/${savesataeId}`,
      });
      showAlert("success", "Savestate Succesfully Deleted");
      window.setTimeout(() => {
        location.assign(`/user-savestates/${userId}`);
      }, 1500);
    } catch (err) {
      showAlert("error", err.response.data.message);
    }
  }
};
