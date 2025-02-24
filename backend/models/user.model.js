import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  access_token: { type: String }, // Matches Calendly response field
  refresh_token: { type: String }, // Matches Calendly response field
  expires_at: { type: Date }, // Store expiry time
});

const User = mongoose.model("User", userSchema);
export default User;
