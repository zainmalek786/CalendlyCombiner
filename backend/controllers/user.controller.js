import axios from "axios";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import getPublicAvailability from "../utils/calendlyApi.js";

const handleAuth = async (req, res, next) => {
  const code = req.query.code;

  console.log("call recieve");
  
  if (!code) {
    return next(new ApiError(400, "Authorization code is missing"));
  }

  try {
    // 🔹 Exchange code for tokens
    const response = await axios.post("https://auth.calendly.com/oauth/token", {
      grant_type: "authorization_code",
      client_id: process.env.CALENDLY_CLIENT_ID,
      client_secret: process.env.CALENDLY_CLIENT_SECRET,
      redirect_uri: process.env.CALENDLY_REDIRECT_URI,
      code: code,
    });
console.log("point 1",response.data.expires_in);

    if (!response.data.access_token) {
      return next(new ApiError(400, "Unable to retrieve access token"));
    }

    const { access_token, refresh_token, expires_in } = response.data;

    // 🕒 Calculate expiry time
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expires_in);

    // expiresAt.setSeconds(expiresAt.getSeconds() + 70);
//     const expiresAt = Date.now() + 300 * 1000;

console.log(expiresAt);


    
    // 🔹 Get user details from Calendly API
    const userInfoResponse = await axios.get("https://api.calendly.com/users/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const userData = userInfoResponse.data.resource;
    const { email, name } = userData;

    // 🔹 Check if user exists in MongoDB
    let user = await User.findOne({ email });

    if (user) {
      // 🔄 Update existing user
      user.access_token = access_token;
      user.refresh_token = refresh_token;
      user.expires_at = expiresAt;
      await user.save();
    } else {
      // 🆕 Create a new user
      user = await User.create({
        name,
        email,
        access_token,
        refresh_token,
        expires_at: expiresAt,
      });
    }
console.log("point 2",name);
   
    const jwtAccessToken = jwt.sign({ userId: user._id,}, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("point 3 all ok");
     
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          accessToken: jwtAccessToken,
          expiresAt: expiresAt.toISOString(),
          user: { id: user._id, name: user.name, email: user.email },
        },
        "User authenticated successfully"
      )
    );
  } catch (error) {
    console.log("point 4 some error");

    return next(new ApiError(500, error?.response?.data?.message || "Internal Server Error"));
  }
};

const fetchAvailability = async (req, res, next) => {
  console.log("call achieved ");

  try {
    const links = req.body.links;
    console.log(links);
    
    // const combinedAvailability =" sunday to wednesday"
     
    // ✅ Separate Calendly & Google links
    const googleLinks = links.filter((link) => link.includes("calendar.google.com"));
    const calendlyLinks = links.filter((link) => link.includes("calendly.com"));

    

    // ✅ Get user's stored Calendly token
    const user = await User.findOne({ _id: req.user.userId });

    
    if (!user || !user.access_token) {
      return next(new ApiError(401, "Calendly not connected"));
    }

    // // ✅ Check if token is expired & refresh if needed
    // let accessToken = user.access_token;
    // if (new Date() > new Date(user.expires_at)) {
    //   console.log("🔄 Access token expired, refreshing...");
    //   accessToken = await refreshCalendlyToken(user);
    //   if (!accessToken) {
    //     return next(new ApiError(401, "Failed to refresh Calendly token"));
    //   }
    // }

    // // ✅ Fetch Free/Busy Data from Calendly
    const calendlyAvailability = await getPublicAvailability(calendlyLinks)

    // // ✅ Fetch Free/Busy Data from Google Calendar
    // const googleAvailability = await getGoogleAvailability(googleLinks);

    // // ✅ Merge both availabilities & find overlapping free slots
    // const combinedAvailability = mergeAvailabilities(calendlyAvailability, googleAvailability);
     
    return res.status(200).json(new ApiResponse(200, { availability: calendlyAvailability }, "Availability fetched successfully"));
  } catch (error) {
    return next(new ApiError(500, error.message || "Internal Server Error"));
  }
};

export { handleAuth, fetchAvailability };
