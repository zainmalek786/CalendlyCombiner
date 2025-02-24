import axios from "axios";
import {jwtDecode} from "jwt-decode";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

// 🔄 Interceptor to refresh token if expired
api.interceptors.request.use(async (config) => {


  const accessToken = localStorage.getItem("accessToken");
  const expiresAtString = localStorage.getItem("expiresAt"); // Retrieve as a string
  const expiresAt = expiresAtString ? new Date(expiresAtString).getTime() : 0;
  console.log("uper wala expiresAtString",expiresAtString);
  console.log("uper wala expiresAt",expiresAt);

  console.log("uper wala access",accessToken);
  

  
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
      console.log("trying to refresh");
      
      const refreshResponse = await axios.post("http://localhost:5000/refresh-token", {        
        userId: localStorage.getItem("userId"), 
      });
      
      console.log("refreshing token");
      console.log();
      
      
      localStorage.setItem("accessToken", refreshResponse.data.accessToken);
      localStorage.setItem("expiresAt", refreshResponse.data.expiresAt);
     console.log("token refreshed successfully expires at",refreshResponse.data.expiresAt);

     console.log(" access token from local storage:", localStorage.getItem("accessToken"));
     console.log(" expires at  from local storage:",localStorage.getItem("expiresAt"));
     
     
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
