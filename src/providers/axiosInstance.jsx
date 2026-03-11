import axios from "axios";
 
const axiosInstance = axios.create({
  baseURL: "https://insightsconsult-backend.onrender.com",
  withCredentials: true, // 🔑 send cookies automatically
});
 
/* ✅ REQUEST INTERCEPTOR — ADD ACCESS TOKEN */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);
 
/* ✅ RESPONSE INTERCEPTOR — HANDLE TOKEN REFRESH */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
 
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
 
      try {
        // refresh token is in cookie, no need to send in body
        const response = await axios.post(
          "https://insightsconsult-backend.onrender.com/auth/refresh",
          {},
          { withCredentials: true }
        );
 
        const accessToken = response.data.accessToken;
        if (!accessToken) throw new Error("Access token undefined");
 
        // ✅ save new access token
        localStorage.setItem("accessToken", accessToken);
 
        // ✅ update headers for future requests
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
 
        return axiosInstance(originalRequest);
      } catch (err) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }
 
    return Promise.reject(error);
  }
);
 
export default axiosInstance;