import axios from "axios";
import { showAlert } from "./alert";

export const deleteSavestate = async (savesataeId) => {
  {
    try {
      await axios({
        method: "DELETE",
        url: `/api/v1/savestates/${savesataeId}`,
      });
      showAlert("success", "Savestate Succesfully Deleted");
      location.reload();
    } catch (err) {
      showAlert("error", err.response.data.message);
    }
  }
};
