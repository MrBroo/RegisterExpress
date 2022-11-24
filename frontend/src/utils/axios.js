import axios from "axios";
const jwtToken = localStorage.getItem("token");
console.log("token")
export const instance = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    Authorization: `Bearer ${jwtToken}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
