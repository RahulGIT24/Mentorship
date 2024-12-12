import apiCall from "./apiCall";

export const getUser = async () => {
  const res = await apiCall({
    url: `auth/get-current-user`,
    method: "GET",
  });
  return res;
};
