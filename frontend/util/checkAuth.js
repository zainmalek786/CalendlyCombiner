import axios from "axios";
import { setUser, logout } from "../src/redux/authSlice.js";

const checkAuthStatus = async (dispatch) => { // ❌ Removed navigate
  const accessToken = localStorage.getItem("accessToken");
  const expiresAt = new Date(localStorage.getItem("expiresAt"));
  const refreshToken = localStorage.getItem("refreshToken");

  console.log("🔍 Checking auth...");

  if (!accessToken || Date.now() > expiresAt) {
    console.log("❌ Access token expired or missing, checking refresh...");

    if (!refreshToken) {
      console.log("❌ Refresh token missing, logging out");
      dispatch(logout());
      return false; // ❌ Removed navigate (handle in component)
    }

    try {
      console.log("🔄 Refreshing token...");
      const response = await axios.post("http://localhost:5000/refresh", { refreshToken });

      if (response.data.accessToken) {
        console.log("✅ Token refreshed successfully!");
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
    console.log("✅ User is already authenticated");
    dispatch(setUser({ id: localStorage.getItem("userId") }));
    return true;
  }
};

export default checkAuthStatus;
