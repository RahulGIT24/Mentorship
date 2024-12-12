import axios from "axios";

export async function logout() {
  try {
    const res = await axios.get(
      import.meta.env.VITE_SERVER_API + "auth/logout",
      { withCredentials: true }
    );
    const { success } = res.data;
    return success;
  } catch (error: any) {
    console.log(error)
    return false;
  }
}