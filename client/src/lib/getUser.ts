import apiCall from "./apiCall";

export const getUser = async () => {
  const res = await apiCall({
    url: `users/get-current-user`,
    method: "GET",
  });
  return res;
};
