import React from "react";
import logo from "../assets/logo-.PNG";

function Button({
  value="Button",
  onclick
}) {
  return (
    <div className="flex items-center gap-3 bg-blue-700 font-bold py-2 px-4 border-blue-800 border rounded-md text-lg text-white shadow-sm shadow-blue-900">
      {/* Logo */}
      <img src={logo} alt="Calendly Logo" className="w-8 h-8" />

      {/* Button */}
      <input 
        type="button" 
        value={value}
        onClick={onclick}
        className=""
      />
    </div>
  );
}

export default Button;
