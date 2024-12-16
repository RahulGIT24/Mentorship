import axios from "axios";

export async function refresh() {
  try {
    await axios.patch(`${import.meta.env.VITE_SERVER_API}auth/refresh-access-token`,{withCredentials:true});
    return true;
  } catch (error) {
    return false;
  }
}
