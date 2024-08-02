import axios from "axios";

//axios.defaults.withCredentials = true;
//kubectl get nodes -o wide

const API = axios.create({
  baseURL: "http://192.168.65.9:9080",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json"
  },
});

export default API;
