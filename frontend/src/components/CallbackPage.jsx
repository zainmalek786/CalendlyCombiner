import { useEffect } from "react";
import { useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice.js";
import axios from "axios";

const CallbackPage =  () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code"); // Extract 'code' from URL

    if (code && !loading) { // Check if already loading
      setLoading(true);
      handleCalendlyCallback(code);
    }
  },[location.search,loading]);

  const handleCalendlyCallback = async (code) => {
    console.log("api call ho rhi hai",code);
    
    try {
      const response = await axios.get(`http://localhost:5000/auth?code=${code}`);
      console.log("Full API Response:", response);
      if (response.data.user) {
        dispatch(setUser(response.data.user)); // Update Redux
        console.log("Backend response",response.data.user);
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("expiresAt", response.data.expiresAt);
        localStorage.setItem("userId", response.data.user.id); // 🔹 Store userId

        console.log(localStorage.getItem("accessToken", response.data.accessToken)  );
        
        
        
        navigate("/"); // Redirect after success
      }
    } catch (error) {
      console.error("Calendly callback error:", error);
      navigate("/error");
    }
  };

  return <div>Authenticating...</div>;
};

export default CallbackPage;
