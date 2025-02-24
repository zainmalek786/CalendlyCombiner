import React,{useEffect} from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Title from "./components/Title.jsx";
import LinksForm from "./components/LinksForm.jsx";
import LeftSideIllustration from "./LeftSideIllustration.jsx";
import StepsGuide from "./components/StepsGuide.jsx";
import Footer from "./components/Footer.jsx";
import { useDispatch } from "react-redux";
import checkAuthStatus from "../util/checkAuth.js";

const PrivateRoute = ({ element }) => {
  const user = useSelector((state) => state.auth.user);
  return user ? element : <Navigate to="/" />;
};

const App = () => {
  


  return (
    <>
      <div className="w-screen bg-slate-100 overflow-auto overflow-x-hidden min-h-screen">
        <Title />
        <div className="w-full md:flex max-h-screen">
          <Outlet/>
          <LeftSideIllustration />
        </div>
      </div>
      <div className="w-screen">
        <StepsGuide />
        <Footer />
      </div>
    </>
  );
};

export default App;
