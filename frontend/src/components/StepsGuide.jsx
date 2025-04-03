import React from "react";

function StepsGuide() {
  const steps = [
    "Paste your Calendly event share link",
    "We analyze availability from the shared links",
    "Find overlapping free time across all schedules",
    "Get a list of the best available time slots",
    "Easily share the results with others",
  ];

  return (
    <div className="w-full px-6 py-10 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-blue-900 text-center mb-6">
        How It Works
      </h2>

      {/* Steps Container */}
      <div className="flex flex-col md:flex-row items-center md:justify-center gap-6 overflow-x-auto md:overflow-visible scrollbar-hide">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            {/* Step Number */}
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg">
              {index + 1}
            </div>
            {/* Step Text */}
            <p className="mt-3 text-blue-900 font-medium text-center max-w-[200px]">
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StepsGuide;
