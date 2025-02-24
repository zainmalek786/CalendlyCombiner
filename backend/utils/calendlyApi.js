import axios from "axios";
import { ApiError } from "../utils/apiError.js";

// ✅ Function to fetch public availability for multiple Calendly links
const getPublicAvailability = async (calendlyLinks) => {
  console.log("🔹 Fetching public availability for links:", calendlyLinks);

  if (!calendlyLinks || !calendlyLinks.length) {
    throw new ApiError(400, "No valid Calendly links provided");
  }

  try {
    // ✅ Fetch availability for all provided links
    const availabilityPromises = calendlyLinks.map(async (calendlyLink) => {
      // ✅ Extract username and event type from the link
      const regex = /calendly\.com\/([^\/]+)\/([^\/?]+)/;
      const match = calendlyLink.match(regex);

      if (!match) {
        console.warn(`⚠️ Invalid Calendly link format: ${calendlyLink}`);
        return { link: calendlyLink, availability: [] };
      }

      const username = match[1]; // Extract username
      const eventType = match[2]; // Extract event type

      console.log(`🔍 Fetching availability for user: ${username}, event: ${eventType}`);

      // ✅ Call Calendly's public API for event availability
      const calendlyApiUrl = `https://api.calendly.com/scheduling_links?owner=${username}&event_type=${eventType}`;

      try {
        const { data } = await axios.get(calendlyApiUrl, {
          headers: { "Content-Type": "application/json" },
        });

        return { link: calendlyLink, availability: data?.collection || [] };
      } catch (error) {
        console.error(`❌ Error fetching availability for ${calendlyLink}:`, error.message);
        return { link: calendlyLink, availability: [] };
      }
    });

    // ✅ Wait for all requests to complete
    const availabilityResults = await Promise.all(availabilityPromises);
    
    return availabilityResults;
  } catch (error) {
    console.error("❌ Error fetching public availability:", error.message);
    throw new ApiError(500, error.message || "Internal Server Error");
  }
};

export default getPublicAvailability;
