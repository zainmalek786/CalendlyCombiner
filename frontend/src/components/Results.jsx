import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  const overlappingTimesRaw = data?.overlappingTimes || [];

  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const overlappingTimes = useMemo(() => {
    return [...overlappingTimesRaw].sort((a, b) => {
      const indexA = dayOrder.indexOf(a.dayName);
      const indexB = dayOrder.indexOf(b.dayName);
      return indexA - indexB;
    });
  }, [overlappingTimesRaw]);

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  return (
    <div className="flex flex-col items-center w-full md:w-7/12 shadow-xl shadow-slate-400 h-auto min-h-[550px]">
      <div className="flex flex-col w-full shadow-xl shadow-gray-300 rounded-md bg-gray-100 p-4 relative">
        {/* Back Button */}
        <button
  className="absolute md:top-1 left-0 ml-0 mb-2 flex items-center justify-center bg-transparent outline-none border-none disable focus:outline-none "
>
  {/* onClick={() => navigate("/")} */}
  <ArrowLeft   className="rounded-full md:h-12 md:w-12 border border-blue-700 bg-slate-50 text-blue-900 hover:text-blue-700 hover:bg-blue-100 transition"  onClick={() => navigate("/")} />
</button>





        <h2 className="text-xl font-bold text-blue-900 text-center md:mt-0 mt-9 mb-4">
          Available Time Slots
        </h2>

        {overlappingTimes.length > 0 ? (
          <>
            <div className="hidden md:flex flex-row w-full">
              <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
                {overlappingTimes.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDayIndex(index)}
                    className={`w-full text-left px-4 py-3 my-1 border border-gray-300 transition-all duration-200 ${
                      selectedDayIndex === index
                        ? "bg-gray-200 border border-gray-300 text-blue-900 font-semibold"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    <p>{item.dayName}</p>
                  </button>
                ))}
              </div>
              <div className="w-2/3 p-6 bg-white overflow-y-auto">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                  {overlappingTimes[selectedDayIndex].dayName}, {overlappingTimes[selectedDayIndex].date}
                </h3>
                {overlappingTimes[selectedDayIndex].times.length > 0 ? (
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {overlappingTimes[selectedDayIndex].times.map((time, idx) => (
                      <button
                        key={idx}
                        className="py-2 px-4 border border-blue-800 rounded-md bg-blue-50 text-gray-700 hover:bg-blue-100 transition"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-red-600">No available times.</p>
                )}
              </div>
            </div>
            <div className="md:hidden flex flex-col w-full">
              {overlappingTimes.map((item, index) => (
                <div key={index} className="mb-4">
                  <button
                    onClick={() => setSelectedDayIndex(index)}
                    className={`w-full text-left px-4 py-2 rounded-md border border-gray-300 transition-all duration-200 ${
                      selectedDayIndex === index
                        ? "bg-blue-100 border-blue-700 text-blue-900 font-semibold"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {item.dayName}
                  </button>
                  {selectedDayIndex === index && (
                    <div className="mt-2 p-2 bg-blue-50 rounded-md">
                      <p className="text-sm text-gray-600 mb-2 text-center">{item.date}</p>
                      <div className="grid grid-cols-3 gap-2">
                        {item.times.length > 0 ? (
                          item.times.map((time, idx) => (
                            <button
                              key={idx}
                              className="py-1 px-3 text-sm border border-blue-800 rounded-md bg-white text-gray-700 hover:bg-blue-100 transition"
                            >
                              {time}
                            </button>
                          ))
                        ) : (
                          <p className="text-sm text-red-600 col-span-full text-center">No available times</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-red-600 text-center">No overlapping availability found.</p>
        )}
      </div>
    </div>
  );
}

export default Results;
