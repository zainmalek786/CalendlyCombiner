import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";

const authMiddleware = (req, res, next) => {
  // Get token from request headers
  const token = req.header("Authorization");
  console.log("1");

  // Check if token exists and starts with "Bearer"
  if (!token || !token.startsWith("Bearer ")) {
    console.log("2");

    return next(new ApiError(401, "No token, authorization denied"));

  }


  try {
    // Extract token (remove "Bearer " prefix)
    const tokenOnly = token.split(" ")[1];
    console.log("3");
    
    // Verify token and extract user data
    const decoded = jwt.verify(tokenOnly, process.env.JWT_SECRET);

    console.log("decoded data:",decoded);
    
    // Attach user info to request object
    req.user = decoded;

    next();
    console.log("everything id\s fine in auth middleware ");
     // Continue to next middleware/controller
  } catch (error) {
    if (error.name === "TokenExpiredError") {
    console.log("5");

      return next(new ApiError(401, "Token expired"));
      
    }
    return next(new ApiError(401, "Invalid token"));
  }
};

export default authMiddleware;
