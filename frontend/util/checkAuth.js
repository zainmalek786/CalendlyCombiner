import axios from "axios";
import { setUser, logout } from "../src/redux/authSlice.js";

const checkAuthStatus = async (dispatch) => { // ❌ Removed navigate
  const accessToken = localStorage.getItem("accessToken");
  const expiresAt = new Date(localStorage.getItem("expiresAt"));
  const refreshToken = localStorage.getItem("refreshToken");



  if (!accessToken || Date.now() > expiresAt) {
   

    if (!refreshToken) {
   
      dispatch(logout());
      return false; // ❌ Removed navigate (handle in component)
    }

    try {
    
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/refresh`, 
        { refreshToken }
      );
      

      if (response.data.accessToken) {
   
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("expiresAt", response.data.expiresAt);
        dispatch(setUser(response.data.user));
        return true; // ✅ Indicate success
      } else {
        console.log("❌ Refresh failed, logging out");
        dispatch(logout());
        return false;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      dispatch(logout());
      return false;
    }
  } else {
   
    dispatch(setUser({ id: localStorage.getItem("userId") }));
    return true;
  }
};

export default checkAuthStatus;
