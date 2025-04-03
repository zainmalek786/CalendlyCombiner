import axios from "axios";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
// import scrapeAvailableDatesAndTimes from "../utils/scrapeCalendly.js";
import scrapeAvailableDatesAndTimes from "../utils/scrapeCalendly.js";



const handleAuth = async (req, res, next) => {
  const code = req.query.code;


  
  if (!code) {
    return next(new ApiError(400, "Authorization code is missing"));
  }
  const redirectUri = `${process.env.FRONTEND_BASE_URL}/callback`;

  try {
    // 🔹 Exchange code for tokens
    const response = await axios.post("https://auth.calendly.com/oauth/token", {
      grant_type: "authorization_code",
      client_id: process.env.CALENDLY_CLIENT_ID,
      client_secret: process.env.CALENDLY_CLIENT_SECRET,
      redirect_uri: redirectUri,
      code: code,
    });


    if (!response.data.access_token) {
      return next(new ApiError(400, "Unable to retrieve access token"));
    }

    const { access_token, refresh_token, expires_in } = response.data;

    // 🕒 Calculate expiry time
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expires_in);




    
    // 🔹 Get user details from Calendly API
    const userInfoResponse = await axios.get("https://api.calendly.com/users/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const userData = userInfoResponse.data.resource;
    const { email, name ,timezone } = userData;

    // 🔹 Check if user exists in MongoDB
    let user = await User.findOne({ email });

    if (user) {
      // 🔄 Update existing user
      user.access_token = access_token;
      user.refresh_token = refresh_token;
      user.expires_at = expiresAt;
      user.timezone = timezone;
      await user.save();
    } else {
      // 🆕 Create a new user
      user = await User.create({
        name,
        email,
        access_token,
        refresh_token,
        expires_at: expiresAt,
        timezone
      });
    }

   
    const jwtAccessToken = jwt.sign({ userId: user._id,}, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  
     
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          accessToken: jwtAccessToken,
          expiresAt: expiresAt.toISOString(),
          user: { id: user._id, name: user.name, email: user.email ,timezone:user.timezone},
        },
        "User authenticated successfully"
      )
    );
  } catch (error) {
   

    return next(new ApiError(500, error?.response?.data?.message || "Internal Server Error"));
  }
};


const fetchAvailability = async (req, res, next) => {
  console.log("📞 API Call Received");

  try {
    const links = req.body.links;
  

    const calendlyLinks = links.filter((link) => link.includes("calendly.com"));

    if (calendlyLinks.length === 0) {
      return next(new ApiError(400, "No valid Calendly links provided"));
    }


    const userId = req.user.userId;

    // ✅ Query database to get the user's stored time zone
    const user = await User.findById(userId);
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }
    const userTimeZone = user.timezone || "UTC"; // Default to UTC if missing

   


    console.log("📡 Scraping Calendly links one by one...");

    let calendlyAvailabilities = [];

    // ✅ Process each link one by one
    for (let link of calendlyLinks) {
      try {
        let data = await scrapeAvailableDatesAndTimes(link,userTimeZone);
        calendlyAvailabilities.push(data);
      } catch (error) {
        console.error(`❌ Error scraping ${link}:`, error);
        return next(new ApiError(500, "Failed to fetch availability"));
      }
    }

    const overlappingTimes = findOverlappingTimes(calendlyAvailabilities);
// console.log("Overlapping times",overlappingTimes);

    return res.status(200).json(
      new ApiResponse(200, { overlappingTimes }, "Availability fetched successfully")
    );
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return next(new ApiError(500, error.message || "Internal Server Error"));
  }
};


export const findOverlappingTimes = (allAvailabilities) => {
  let availabilityMap = new Map();

  // ✅ Step 1: Store all available times for each date
  for (let userAvailability of allAvailabilities) {
    for (let { date, dayName, times } of userAvailability) {
      if (!availabilityMap.has(date)) {
        availabilityMap.set(date, { dayName, timesArray: [] });
      }
      availabilityMap.get(date).timesArray.push(times);
    }
  }

  let commonAvailability = [];

  // ✅ Step 2: Find overlapping times for each date
  for (let [date, { dayName, timesArray }] of availabilityMap.entries()) {
    if (timesArray.length !== allAvailabilities.length) {
      // ❌ If not all users have availability for this date, skip it
      continue;
    }

    // ✅ Fix: Corrected `.reduce()` to handle the first iteration properly
    let commonTimes = timesArray.reduce((acc, times) => 
      acc.length === 0 ? times : acc.filter(time => times.includes(time))
    );

    commonAvailability.push({ date, dayName, times: commonTimes });
  }

  return commonAvailability;
};




export { handleAuth, fetchAvailability };
