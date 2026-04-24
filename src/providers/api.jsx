// src/api/axios.js

import axios from "axios";

const api = axios.create({
  baseURL: "https://insightsconsulting-normal-backend-production.up.railway.app/api", // your backend
  withCredentials: true, // IMPORTANT for cookies
});

export default api;