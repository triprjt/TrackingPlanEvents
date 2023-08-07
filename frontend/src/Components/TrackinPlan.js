import React, { useState } from "react";
import DBService from "../Service/DBService";

const TrackingPlan = ({
  trackingPlan,
  onChange,
  error,
  trackinPlanNameRef,
}) => {
  const [sourceInput, setSourceInput] = useState("");
  const [status, setStatus] = useState("");

  function debounce(func, wait) {
    let timeout;

    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  const handleCancel = () => {};
  const checkSourceAvailable = async (source_name) => {
    try {
      let res = await DBService.getSourceByName(source_name);

      if (res.success) {
        setStatus("This source is already assigned to a Tracking Plan.");
      }
    } catch (error) {
      setStatus("Source name is available");
    }
  };
  const handleSaveSource = async (sourceName) => {
    const sourceData = {
      name: sourceName, // add other fields as required
    };
    try {
      const response = await DBService.saveSourceToDB(sourceData);

      setTimeout(() => {
        onChange("source", sourceName);
      }, 0);
    } catch (error) {
      // Display the error message
      // setAPIError(error.message);
    }
  };
  const debouncedCheck = debounce(checkSourceAvailable, 800);

  const handleSourceInputChange = (e) => {
    e.preventDefault();
    // setError(null);
    const value = e.target.value;
    if (value.length === 0) {
      // setError("Name cannot be null");
    } else {
      debouncedCheck(value);
    }
    setSourceInput(value);
  };

  return (
    <div className="p-4  rounded">
      <div className="flex flex-row mb-2 gap-10 items-center">
        <label className="w-56 text-left text-sm">Name:</label>
        <input
          ref={trackinPlanNameRef}
          type="text"
          placeholder="Name"
          required
          value={trackingPlan.name}
          onChange={(e) => onChange("name", e.target.value)}
          className="p-2 w-3/6 h-8 font-light text-sm rounded border border-gray-400"
        />
      </div>
      <div className="flex flex-row gap-10 mb-2 items-center">
        <label className="w-56 text-left text-sm">Description:</label>
        <input
          type="text"
          placeholder="Description"
          value={trackingPlan.description}
          onChange={(e) => onChange("description", e.target.value)}
          className="p-2 w-3/6 h-8 font-light text-sm gap-48 border border-gray-400 rounded"
        />
      </div>
      <div className="flex flex-row gap-10 mb-2 items-center">
        <label className="w-56 text-left text-sm">Source:</label>
        {trackingPlan.source ? (
          <label>{trackingPlan.source}</label>
        ) : (
          <>
            <div className="flex flex-col ">
              <input
                type="text"
                placeholder="source"
                value={sourceInput}
                onChange={handleSourceInputChange}
                className="p-2 w-3/6 h-8 font-light text-sm gap-48 border border-gray-400 rounded"
              />
              {status && (
                <label className=" text-xs text-red-600">{status}</label>
              )}
              <div className=" flex flex-wrap gap-5 ">
                <button
                  onClick={() => {
                    handleSaveSource(sourceInput);
                  }}
                  className="bg-blue-500 text-white rounded"
                >
                  Save
                </button>
                <button className=" bg-red-600 text-white rounded">
                  Close
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <span className=" text-red-500 text-xs ">{error}</span>
    </div>
  );
};

export default TrackingPlan;
