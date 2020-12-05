import Axios from "axios";

export const api = Axios.create({ baseURL: "http://localhost:8000/api/v1/" });
api.interceptors.request.use(function (config) {
  const token = window.localStorage.getItem("token");
  config.headers["Content-Type"] = "application/json";
  if (token !== null) config.headers.Authorization = `token ${token}`;
  return config;
});
