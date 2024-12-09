import axios from "axios";
import { baseURL, env } from './index.js';

axios.defaults.withCredentials = true;

const axiosAPI = axios.create({
  baseURL: baseURL[env],
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials": true,
  },
});

export default axiosAPI;
