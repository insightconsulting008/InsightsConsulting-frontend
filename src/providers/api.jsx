// src/api/axios.js

import axios from "axios";

const api = axios.create({
  baseURL: "https://insightsconsulting-normal-backend.onrender.com/api", // your backend
  withCredentials: true, // IMPORTANT for cookies
});

export default api;