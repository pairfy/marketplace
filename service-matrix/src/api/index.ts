import axios from "axios";

//axios.defaults.withCredentials = true;

const matrixAPI = axios.create({
  baseURL: "https://maps.googleapis.com",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  //  "Access-Control-Allow-Credentials": true,
  },
});



const geoAPI = axios.create({
  baseURL: "https://ipinfo.io/",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  //  "Access-Control-Allow-Credentials": true,
  },
});


export { matrixAPI, geoAPI };
