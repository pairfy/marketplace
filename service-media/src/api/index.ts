import axios from "axios";

//axios.defaults.withCredentials = true;

const API = axios.create({
  baseURL: "http://192.168.65.9:9080",
  timeout: 59000,
  headers: {
    "Content-Type": "application/json"
  },
});

export default API;
