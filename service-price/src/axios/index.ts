import axios from "axios";

//axios.defaults.withCredentials = true;

const axiosAPI = axios.create({
  baseURL: "https://api.binance.com",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  //  "Access-Control-Allow-Credentials": true,
  },
});

export { axiosAPI };
