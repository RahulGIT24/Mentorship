import axios from "axios";
import { refresh } from "./refresh";
import { logout } from "./logout";

const apiCall = async ({
  url,
  method,
  reqData = "",
    withCredentials=true
}: {
  url: string;
  method: string;
  reqData?: any;
  withCredentials?:boolean
}) => {
  try {
    const response = await axios({
      method,
      url: import.meta.env.VITE_SERVER_API + url,
      data: reqData,
      withCredentials: withCredentials,
    });
    if (response.status === 401) {
      await refresh();
    }
    return {data:response.data.data,status:response.status,message:response.data.message};
  } catch (error: any) {
    const data = error.response.data.data;
    if (error.response.status === 401) {
      const isRefreshed = await refresh();
      if(!isRefreshed){
        await logout()
        return {data,status:error.response.status}
      }
    }
    return {data,status:error.response.status,message:error.response.data.message}
  }
};

export default apiCall;
