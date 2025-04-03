import React, { useState } from "react";
import Button from "./Button";
import api from "../../util/axiosInstance";
import { useNavigate } from "react-router-dom";

function LinksForm() {
  const [links, setLinks] = useState(["", ""]); // Start with two input fields
  const [loading,SetLoading]= useState(false)
  const navigate = useNavigate();

  const handleSubmit = async ()=>{
    try {
      SetLoading(true)
      const response = await api.post("/availability",{links})
   
      navigate('/results', { state: { data: response.data } });
      
      SetLoading(false)
    } catch (error) {
      console.error("Error fetching availability:", error.response?.data || error.message);
      alert("Failed to fetch availability.");
    }
  }
  // Function to handle adding a new input field
  const addLinkField = () => {
    setLinks([...links, ""]);
   
    
  };

  // Function to handle input changes
  const handleInputChange = (index, value) => {
    const updatedLinks = [...links];
    updatedLinks[index] = value;
    setLinks(updatedLinks);
  };


  return (
    <div className="flex relative flex-col items-center md:w-7/12 shadow-xl  shadow-slate-400  h-[550px] max-h-[550px] w-screen">


      <div
        className={` ${ loading? 'pointer-events-none   ' : ''} flex flex-col items-center w-full h-[550px] shadow-xl shadow-gray-300 scrollbar-custom overflow-y-auto rounded-md bg-gradient-to-br from-slate-50 to-slate-100`}
      >
        <h2 className="text-xl font-bold mt-14 text-blue-900 text-center mb-4">
          Enter Calendly Share Links
        </h2>

        {loading && (
    <div className="absolute inset-0 flex flex-col items-center justify-center  z-10 bg-gray-100">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-3 text-lg font-semibold text-gray-700">Please wait...</p>
    </div>
  )}




        {/* Input Fields Container */}
        <div className="flex flex-col items-center space-y-3 md:mt-6 w-full  ">
          {links.map((link, index) => (
            <div
              key={index}
              className="flex justify-center w-full md:mt-5 space-x-2"
            >
              <input
                type="url"
                value={link}
                onChange={(e) => handleInputChange(index, e.target.value)}
                placeholder={`Enter ${index + 1} link`}
                className="md:w-7/12 w-10/12 text-blue-900 py-2 px-3 md:p-3 border-2 border-blue-700 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        {/* Button to add another input field */}
        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={addLinkField}
            className="bg-green-500 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            + Add Another Link
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-4">
          <Button value="Proceed" onclick={handleSubmit}/>
        </div>
      </div>
    </div>
  );
}

export default LinksForm;
