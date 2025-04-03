import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";

const authMiddleware = (req, res, next) => {
  // Get token from request headers
  const token = req.header("Authorization");
 

  // Check if token exists and starts with "Bearer"
  if (!token || !token.startsWith("Bearer ")) {
   

    return next(new ApiError(401, "No token, authorization denied"));

  }


  try {
    // Extract token (remove "Bearer " prefix)
    const tokenOnly = token.split(" ")[1];

    
    // Verify token and extract user data
    const decoded = jwt.verify(tokenOnly, process.env.JWT_SECRET);

   
    
    // Attach user info to request object
    req.user = decoded;

    next();
    console.log("everything is fine in auth middleware ");
     // Continue to next middleware/controller
  } catch (error) {
    if (error.name === "TokenExpiredError") {
   

      return next(new ApiError(401, "Token expired"));
      
    }
    return next(new ApiError(401, "Invalid token"));
  }
};

export default authMiddleware;
