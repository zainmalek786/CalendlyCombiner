import React,{useEffect} from 'react';
import Button from "./Button";
import { useNavigate } from 'react-router-dom';
import checkAuthStatus from '../../util/checkAuth';
import { useDispatch,useSelector } from 'react-redux';


function ConnectCalendly() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // ✅ Get auth state

  useEffect(() => {
    const checkAuth = async () => {
      await checkAuthStatus(dispatch);
    };
    checkAuth();
  }, [dispatch]);

  // ✅ Navigate when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log("✅ User authenticated, navigating to home...");
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);


  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
    const CLIENT_ID = import.meta.env.VITE_CALENDLY_CLIENT_ID

    const connectCalendly = () =>{
      const authUrl = `https://auth.calendly.com/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}`;
      window.location.href = authUrl
    }
    return ( <>
                <div className="flex flex-col items-center md:w-7/12 shadow-xl  shadow-slate-400  h-[550px] max-h-[550px] w-screen">
      {/* Button Section */}
      <div
  className={`flex flex-col w-full h-[550px] shadow-2xl shadow-gray-600 rounded-lg justify-center items-center bg-slate-100 p-6 
    
  }`}
>
  {/* Heading */}
  <h2 className="text-2xl font-semibold text-blue-900 mb-2">
    Connect Your Calendly
  </h2>

  {/* Subtitle */}
  <p className="text-gray-700 text-sm text-center max-w-md mb-6">
    Link your Calendly account to start sharing your availability seamlessly.
  </p>

  {/* Button */}
  <Button value="Connect To Calendly" onclick={connectCalendly} />

  {/* Optional: Add an Icon Below */}
  <div className="mt-6 text-blue-700 text-4xl">
    📅 {/* You can replace this with a proper icon */}
  </div>
</div>
</div>
             </> );
}

export default ConnectCalendly;