import React from "react";
// import logo from "../assets/logo-.PNG";
import logo from "../assets/logo-.png"

function Button({
  value="Button",
  onClick
}) {
  return (
    <div onClick={onClick} className="flex items-center gap-3 bg-blue-700 font-bold py-2 px-4 border-blue-800 border rounded-md text-lg text-white shadow-sm shadow-blue-900">
      {/* Logo */}
      <img src={logo} alt="Calendly Logo" className="w-8 h-8" />

    {value}
    </div>
  );
}

export default Button;
