import axios from "axios";


const geoAPI = axios.create({
  baseURL: "https://ipinfo.io/",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  //  "Access-Control-Allow-Credentials": true,
  },
});


export { geoAPI };
