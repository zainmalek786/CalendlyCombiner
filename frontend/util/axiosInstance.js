import axios from "axios";
import {jwtDecode} from "jwt-decode";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL, // Use environment variable
});

// 🔄 Interceptor to refresh token if expired
api.interceptors.request.use(async (config) => {


  const accessToken = localStorage.getItem("accessToken");
  const expiresAtString = localStorage.getItem("expiresAt"); // Retrieve as a string
  const expiresAt = expiresAtString ? new Date(expiresAtString).getTime() : 0;
 
  

  
  let isJwtExpired = false;

  // 🔹 Check JWT expiry
  if (accessToken) {
    try {
      const decoded = jwtDecode(accessToken);
      if (decoded.exp * 1000 < Date.now()) {
        isJwtExpired = true;
      }
    } catch (err) {
      console.error("Error decoding JWT:", err);
      isJwtExpired = true; // Treat decoding errors as expired
    }
  }


  if (!accessToken || isJwtExpired || Date.now() > expiresAt){
    try {
     
      
      const refreshResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/refresh-token`, 
        { userId: localStorage.getItem("userId") }
      );
      
      

      
      
      localStorage.setItem("accessToken", refreshResponse.data.accessToken);
      localStorage.setItem("expiresAt", refreshResponse.data.expiresAt);
  


     
     
      config.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
    } catch (error) {
      console.error("Token refresh failed:", error);
      localStorage.clear(); 
      // window.location.href = "/"; 
    }
  }
  config.headers.Authorization = `Bearer ${localStorage.getItem("accessToken")}`;
  return config;
});

export default api;
