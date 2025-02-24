import jwt from "jsonwebtoken";
import axios from "axios";
import User from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const refreshTokenController = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      console.error("🚨 ERROR: User ID not provided");
      return next(new ApiError(400, "User ID is required"));
    }

    console.log("🔄 Refreshing token for user:", userId);

    // 🔹 Find user in the database
    const user = await User.findById(userId);
    if (!user) {
      console.error("🚨 ERROR: User not found in database");
      return next(new ApiError(404, "User not found"));
    }

    console.log("✅ User found:", user.email);
    console.log("📆 Token expires at:", user.expires_at);
    console.log("🕒 Current time:", new Date());

    // 🔹 Check if Calendly access token is still valid
    if (user.expires_at > new Date()) {
      console.log("✅ Calendly token still valid, issuing new JWT");

      const newAccessToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json(
        new ApiResponse(200, { accessToken: newAccessToken, expiresAt: user.expires_at }, "New JWT issued")
      );
    }

    console.log("⚠️ Calendly token expired, requesting new one...");

    // 🔹 Refresh Calendly access token
    const calendlyAuthUrl = "https://auth.calendly.com/oauth/token";
    const refreshData = {
      grant_type: "refresh_token",
      client_id: process.env.CALENDLY_CLIENT_ID,
      client_secret: process.env.CALENDLY_CLIENT_SECRET,
      refresh_token: user.refresh_token,
    };

    console.log("🔁 Refresh request data:", refreshData);

    let response;
    try {
      response = await axios.post(calendlyAuthUrl, refreshData);
    } catch (error) {
      console.error("🚨 ERROR: Calendly token refresh failed");
      console.error("📌 Calendly API response:", error.response?.data || error.message);

      if (error.response?.data?.error === "invalid_grant") {
        return next(new ApiError(401, "Refresh token expired. Please reconnect Calendly"));
      }

      return next(new ApiError(500, "Error refreshing Calendly token", error));
    }

    console.log("✅ Calendly token refreshed successfully:", response.data);

    const { access_token, refresh_token, expires_in } = response.data;

    // 🔹 Update user's tokens in the database
    user.access_token = access_token;
    user.refresh_token = refresh_token;
    user.expires_at = new Date(Date.now() + expires_in * 1000);

    await user.save();
    console.log("✅ Database updated with new tokens");

    // 🔹 Generate a new JWT
    const newAccessToken = jwt.sign({ userId: user._id },process.env.JWT_SECRET,{ expiresIn: "1h" });

    console.log("✅ Issuing new JWT:", newAccessToken);

    return res.status(200).json(
      new ApiResponse(200, { accessToken: newAccessToken, expiresAt: user.expires_at.toISOString(), }, "New JWT issued")
    );

  } catch (error) {
    console.error("🚨 ERROR: Unexpected error in refreshTokenController");
    console.error(error);

    return next(new ApiError(500, "Error refreshing token", error));
  }
};

export default refreshTokenController;
