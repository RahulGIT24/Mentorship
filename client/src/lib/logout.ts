import axios from "axios";
import toast from "react-hot-toast";

export async function logout() {
  try {
    await axios({
      method:"PATCH",
      url: import.meta.env.VITE_SERVER_API + "auth/logout",
      withCredentials: true,
    });
    toast.success("Logged Out")
    return true;
  } catch (error) {
    return false;
  }
}
